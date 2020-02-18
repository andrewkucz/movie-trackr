import React, {useEffect, useState} from 'react';
import { useParams } from "react-router-dom";
import { makeStyles } from '@material-ui/styles';
import { Grid, Snackbar, Paper, Typography, Chip, Divider, Button } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import ListAltIcon from '@material-ui/icons/ListAlt';
import VisibilityIcon from '@material-ui/icons/Visibility';

import { api_key } from "../../tmdb_config.json";
import { useAuth0 } from "../../react-auth0-spa";

import axios from 'axios';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(4)
  },
  chip: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  content:{
    padding: theme.spacing(4)
  },
  title: {
    marginBottom: theme.spacing(1)
  },
  duration: {
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(0.5)
  },
  poster: {
    width: '100%',
  },
  genres: {
    marginBottom: theme.spacing(1)
  },
  divider: {
    margin: theme.spacing(2),
  }
}));


const SingleMovie = () => {
  const classes = useStyles();
  const [movie, setMovie] = useState({});
  
  //const [actors, setActors] = useState({});

  const [list, setList] = useState('');
  const [config, setConfig] = useState({});

  const { user } = useAuth0();

  const { id } = useParams();

  const [popup, setPopup] = useState({
    open: false,
    severity: '',
    message: ''
  });

  useEffect(() => {
    if(user && id)
    {
      let url = `/api/v1/collectionitems/watched?user=${user.sub}&movies=${id}}`
      axios.get(url).then(response => {
        setList(response.data[id]);
      }).catch(err => {
        console.log(err);
      })
    }
  }, [user, id])

  useEffect(() => {
    console.log('Getting config...');
    axios.get('https://api.themoviedb.org/3/configuration?api_key=bc8272eb5e701f448b839848bc8cce25').then(response => {
      let len = response.data.images.poster_sizes.length;
      setConfig({
        base_url: response.data.images.base_url + response.data.images.poster_sizes[len-1]
      });
    });
  }, []);

  //listing actors TBD
  useEffect(() => {
    if(id)
    {
      axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${api_key}&language=en-US`).then(response => {
        setMovie(response.data);
      }).catch(err => {
        console.log(err);
      });

      // axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${api_key}`).then(response => {
      //   setActors(response.data.cast);
      // }).catch(err => {
      //   console.log(err);
      // });
    }
  }, [id]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setPopup({...popup, open: false});
  };

  const getImage = () => {
    console.log(movie);
    return (config.base_url && movie.poster_path) ? config.base_url + movie.poster_path : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  };

  const getDuration = () => {

    if(!movie.runtime) return '';

    let hours = 0;
    let mins = movie.runtime;

    while(mins >= 60)
    {
      hours++;
      mins -= 60;
    }
    let dur = hours>0 ? `${hours}h ` : '';
    
    if(mins)
    {
      dur += `${mins}m`
    }

    return dur;
  };

  const isOnWatchList = list === 'watch';
  const isOnSeenList = list === 'seen';

  const addToList = (l) => {

    let listNeedsToBeUpdated = (isOnWatchList && l === 'seen') || (isOnSeenList && l === 'watch');
    

    if(!user)
    {
      console.log('no user');
      //setPopup({severity: 'error', open: true, message: `Must be logged in to add a movie to your ${list} list!`});
    }
    else if(isOnWatchList && l==='watch')
    {
      console.log('already on ' + l + ' list');
      //setPopup({severity: 'error', open: true, message: `Movie is already on your ${list} list`});
    }
    else if(isOnSeenList && l==='seen')
    {
      console.log('already on ' + l + ' list');
      //setPopup({severity: 'error', open: true, message: `Movie is already on your ${list} list`});
    }
    else
    {
      console.log(`Adding ${movie.title} to ${l} list`);
      let collectionObj = getCollectionItem(l);

      let url = listNeedsToBeUpdated ? '/api/v1/collectionitems/updatelist' : '/api/v1/collectionitems';

      console.log(collectionObj);

      axios.post(url,collectionObj).then(response => {
        console.log(response);
        //setPopuseverity: 'success', open: true, message: `Added "${collectionObj.title}" to your ${list} list`});
        setList(l);
      }).catch(err => {
        console.log(err);
        //setPopup({severity: 'warning', open: true, message: `Error adding movie to your ${list} list`});
      });
    

    }
  };

  const getCollectionItem = (l) => {
    return {
      user: user.sub,
      tmdb_id: id,
      title: movie.title,
      poster: movie.poster_path || '',
      list: l
    };



  }

  return (
    <div className={classes.root}>
      <Grid className={classes.content} container spacing={4}>

        <Grid item xs={12} md={8} >
          <Paper className={classes.paper}>
          <Typography className={classes.title} variant="h1">
            {movie.title}
          </Typography>
          <Typography variant="subtitle2" className={classes.duration}>
            {getDuration()}
          </Typography>
          <div className={classes.genres}>
            {(movie.genres || []).map(g => <Chip key={g.id} className={classes.chip} label={g.name} />)}
          </div>

          <Typography variant="subtitle1">
            {movie.overview}
          </Typography>

          <Divider className={classes.divider}/>

          <Grid className={classes.content} container spacing={4}>
            <Grid item>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              startIcon={<ListAltIcon />}
              onClick={() => addToList('watch')}
              disabled={isOnWatchList || isOnSeenList}
            >
            {isOnWatchList ? 'On Watch List' : 'Want to Watch'}
            </Button>
            </Grid>
            <Grid item>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              startIcon={<VisibilityIcon />}
              onClick={() => addToList('seen')}
              disabled={isOnSeenList}
            >
            {isOnSeenList ? 'Already Seen' : 'Mark as Seen'}
            </Button>
            </Grid>

          </Grid>

          </Paper>
        </Grid>


        <Grid item xs={12} md={4} >
          <Paper className={classes.paper}>
            <img className={classes.poster} src={getImage()} alt={movie.title + ' Poster'}/>
          </Paper>
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

export default SingleMovie;
