import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

import { api_key } from "../../tmdb_config.json";
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

  const numMovies = 6;

  useEffect(() => {
    axios.get('https://api.themoviedb.org/3/configuration?api_key=bc8272eb5e701f448b839848bc8cce25').then(response => {
      console.log(response);
      let len = response.data.images.poster_sizes.length;
      let base = response.data.images.base_url + response.data.images.poster_sizes[len-4];
      console.log(base);
      setConfig({
        base_url: base
      });
    });
  }, []);

  useEffect(() => {
    categories.forEach(c => {
      let s = slug(c);
      axios.get(`https://api.themoviedb.org/3/movie/${s}?api_key=${api_key}&language=en-US&page=1`).then(response => {
        console.log(c, response);
        setMovies(m => {return {...m, [c]: response.data.results.slice(0,numMovies)}});
      });
    });
  }, []);

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
            categories.map(c => <MovieSlider key={c} config={config} slug={slug(c)} title={c} movies={movies[c]} user={user} setPopup={setPopup}/>)
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
