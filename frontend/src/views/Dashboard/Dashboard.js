import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

import { api_key } from "../../tmdb_config";
import { useAuth0 } from "../../react-auth0-spa";

import axios from 'axios';

import {
  MovieSlider
} from './components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));


const categories = ['Now Playing','Top Rated','Upcoming'];

const Dashboard = () => {
  const classes = useStyles();
  const [movies, setMovies] = useState({});
  const [config, setConfig] = useState({});

  const slug = str => str.replace(/ /g,'_').toLowerCase();

  const { user } = useAuth0();
  const [popup, setPopup] = useState({
    open: false,
    severity: '',
    message: ''
  });

  const [ready, setReady] = useState(false)
  const [userList, setUserList] = useState({})
  const [movieIDs, setMovieIDs] = useState({})

  const numMovies = 6;

  useEffect(() => {
    axios.get('https://api.themoviedb.org/3/configuration?api_key='+api_key).then(response => {
      //console.log(response);
      let len = response.data.images.poster_sizes.length;
      let base = response.data.images.base_url + response.data.images.poster_sizes[len-4];
      //console.log(base);
      setConfig({
        base_url: base
      });
    });
  }, []);

  useEffect(() => {
    const p = categories.map(c => {
      let s = slug(c);
      return axios.get(`https://api.themoviedb.org/3/movie/${s}?api_key=${api_key}&language=en-US&page=1`).then(response => {
        //console.log(c, response);
        setMovies(m => {return {...m, [c]: response.data.results.slice(0,numMovies)}});
      });
    });

    Promise.all(p).then(res => {
      setReady(true)
    }).catch(err => {
      console.log(err)
    })

  }, []);


  useEffect(() => {
    if(!ready || !user) return

    axios.get('https://movieapp.prestoapi.com/api/allitems?user='+user.sub).then(res => {

    const obj = res.data.reduce((acc,val) => {
      acc[val.tmdb_id] = val.list
      return acc
    }, {})

    setUserList(obj)

    setMovieIDs(res.data.reduce((acc,val) => {
      acc[val.tmdb_id] = val._id
      return acc
    }, {}))

    }).catch(err => console.log(err))

  },[ready, user])

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setPopup({...popup, open: false});
  };


  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid item xs={12} >
          {
            categories.map(c => <MovieSlider key={c} config={config} slug={slug(c)} title={c} movies={movies[c]} user={user} userList={userList} setUserList={setUserList} movieIDs={movieIDs} setPopup={setPopup}/>)
          }
        </Grid>
      </Grid>

      <Snackbar open={popup.open} autoHideDuration={3000} onClose={handleClose}>
      <MuiAlert elevation={6} variant="filled" onClose={handleClose} severity={popup.severity}>
        {popup.message}
      </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default Dashboard;
