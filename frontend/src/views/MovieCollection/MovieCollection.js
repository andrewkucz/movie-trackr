import React, {useEffect, useState} from 'react';
import { useParams } from "react-router-dom";
import { makeStyles } from '@material-ui/styles';
import { Grid, Snackbar, Paper, Typography, CircularProgress } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { useBottomScrollListener } from 'react-bottom-scroll-listener';

import { api_key } from "../../tmdb_config";
import { useAuth0 } from "../../react-auth0-spa";

import MovieCard from '../../components/MovieCard';

import axios from 'axios';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(4)
  },
  content:{
    padding: theme.spacing(4)
  },
  title: {
    marginBottom: theme.spacing(3)
  },
  duration: {
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(0.5)
  },
  poster: {
    width: '100%',
  },
  divider: {
    margin: theme.spacing(2),
  },
  loader: {
    textAlign: 'center',
    paddingTop: '50%',
  }
}));


const MovieCollection = () => {

  const classes = useStyles();
  const [movies, setMovies] = useState([]);
  const [userList, setUserList] = useState('');
  const [config, setConfig] = useState({});
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth0();
  const { slug } = useParams();
  const [category, setCategory] = useState('');

  const [movieIDs, setMovieIDs] = useState({})

  const [popup, setPopup] = useState({
    open: false,
    severity: '',
    message: ''
  });

  const addToUserList = (id, list) => {
    console.log('adding to list: ' + list);
    setUserList({...userList, [id]: list})
  }

  useEffect(() => {
    //console.log('Getting config...');
    axios.get('https://api.themoviedb.org/3/configuration?api_key='+api_key).then(response => {
      let len = response.data.images.poster_sizes.length;
      setConfig({
        base_url: response.data.images.base_url + response.data.images.poster_sizes[len-1]
      });
    });
  }, []);

  useEffect(() => {
    setCategory(decodeURI(slug).replace(/ /g, '_').toLowerCase());
    setPage(0);
  }, [slug]);

   

  useEffect(() => {

    if(!category) return;

    //console.log('getting page: ' + (page+1) + ' cat: ' + category);

    axios.get(`https://api.themoviedb.org/3/movie/${category}?api_key=${api_key}&language=en-US&page=${page+1}`).then(response => {
      //console.log(response);
      setLoading(false);
      if(page===0 && movies.length)
      {
        setMovies(response.data.results);
      }
      else
      {
        setMovies(m => m.concat(response.data.results));
      }
    }).catch(err => {
      console.log(err);
    });

  }, [page, category]);

  useEffect(() => {
    if(!user || !movies || !movies.length) return

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

  },[movies.length, user])


  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setPopup({...popup, open: false});
  };


  function onBottom() {
    console.log('triggered');
    setLoading(true);
    setPage(page+1);
  }

 
  
  useBottomScrollListener(onBottom, 1000, 200);


  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
      <Typography variant="h2" component="h2" className={classes.title}>{slug}</Typography>
      <Grid container spacing={4}>

        
        {movies.map(m => <Grid key={m.id} item xs={6} sm={4} className={classes.card}>
          <MovieCard movie={m} base_url={config.base_url} userID={user ? user.sub : null} list={userList[m.id]} id={movieIDs[m.id]} addToUserList={addToUserList} setPopup={setPopup}/>
        </Grid>
        )}

        {loading && <Grid item xs={2}><div className={classes.loader}><CircularProgress/></div></Grid>}

      </Grid>

        <Snackbar open={popup.open} autoHideDuration={3000} onClose={handleClose}>
          <MuiAlert elevation={6} variant="filled" onClose={handleClose} severity={popup.severity}>
            {popup.message}
          </MuiAlert>
        </Snackbar>
      </Paper>
    </div>
  );
};

export default MovieCollection;
