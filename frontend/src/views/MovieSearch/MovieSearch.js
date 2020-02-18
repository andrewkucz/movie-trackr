import React, {useEffect, useState, forwardRef} from 'react';
import { makeStyles } from '@material-ui/styles';
import {  Paper, Typography, Grid } from '@material-ui/core';

import { useLocation } from 'react-router-dom';

import { useAuth0 } from "../../react-auth0-spa";
import { api_key } from "../../tmdb_config.json";


import history from "../../utils/history";

import axios from 'axios';


import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';


const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
    textAlign: 'center'
  },
  paper: {
    padding: theme.spacing(4)
  },
  title: {
    marginBottom: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(5)
  },
  poster: {
    width: '100%',
  },
  divider: {
    margin: theme.spacing(2),
  },
  inputPaper: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '50%',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  tmdblogo: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3) 
  },
  grid: {
    padding: theme.spacing(2)
  },
  movie: {
    padding: theme.spacing(2),
    cursor: 'pointer'
  },
  moviedetails: {
    padding: theme.spacing(2),
    textAlign: 'left'
  },
  nextpage: {
    padding: theme.spacing(3),
    cursor:'pointer'
  },
  noresults: {
    padding: theme.spacing(3)
  },
}));

function useQuery() {
  return new URLSearchParams(useLocation().search);
}


const MovieSearch = () => {

  const classes = useStyles();
  const [movies, setMovies] = useState([]);
  const [config, setConfig] = useState({});
  const [page, setPage] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const [noResults, setNoResults] = useState(false);
  const [moreResults, setMoreResults] = useState(false);


  const { user } = useAuth0();

  let query = useQuery();

  const [popup, setPopup] = useState({
    open: false,
    severity: '',
    message: ''
  });

  const [userList, setUserList] = useState({});

  useEffect(() => {
    if(user && movies && movies.length)
    {
      let ids = movies.map(m=>m.id);
      let url = `/api/v1/collectionitems/watched?user=${user.sub}&movies=${ids.join(',')}`
      axios.get(url).then(response => {
        setUserList(response.data);
        console.log(response.data);
      }).catch(err => {
        console.log(err);
      })
    }
  }, [user, movies])

  const addToUserList = (id, list) => {
    console.log('adding to list: ' + list);
    setUserList({...userList, [id]: list})
  }

  //config
  useEffect(() => {
    console.log('Getting config...');
    axios.get('https://api.themoviedb.org/3/configuration?api_key=bc8272eb5e701f448b839848bc8cce25').then(response => {
      setConfig({
        base_url: response.data.images.base_url + response.data.images.poster_sizes[0]
      });
    });


    let s = query.get('q');

    if(s)
    {
      setSearchInput(s);
      setSearch(s);
    }

  }, []);

  useEffect(() => {

    if(!search) return;
    let s = query.get('q');

    if(s !== search)
    {
      history.push("/search?q="+encodeURI(search));
    }

    console.log('SEARCHING: ' + search);

    let url = `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&language=en-US&page=${page+1}&include_adult=false&query=${encodeURI(search)}`

    axios.get(url).then(response => {
      console.log(response);
      setMovies(response.data.results);
      if(response.data.results.length)
      {
        setNoResults(false);
      }
      else
      {
        setNoResults(true);
      }

      if(response.data.total_pages > (page+1))
      {
        setMoreResults(true);
      }
      else
      {
        setMoreResults(false);
      }


    })





  }, [search, page]);


  const goToMovie = (movie) => {
    history.push("/movie/"+movie.id);
  }


  const getImage = (movie) => {
    return (config.base_url && movie.poster_path && movie.poster_path !== null) ? config.base_url + movie.poster_path : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  };

  const handleChange = event => {
    setSearchInput(event.target.value);
  };

  const searchMovies = q => {
    setSearch(searchInput);
  }

  function released(rd) {
    if(!rd) return '';
    let arr = rd.split('-');
    if(arr.length !==3) return '';

    return `${arr[1]}/${arr[2]}/${arr[0]}`;
  }


  return (
    <div className={classes.root}>
      <img className={classes.tmdblogo} src="https://www.themoviedb.org/assets/2/v4/logos/408x161-powered-by-rectangle-blue-10d3d41d2a0af9ebcb85f7fb62ffb6671c15ae8ea9bc82a2c6941f223143409e.png" alt="The Movie DB Logo"/>
      <Paper className={classes.inputPaper}>
      <InputBase
        className={classes.input}
        placeholder="Search Movies"
        inputProps={{ 'aria-label': 'search movies' }}
        value={searchInput}
        onChange={handleChange}
      />
      <IconButton type="submit" className={classes.iconButton} aria-label="search" onClick={() => searchMovies(search)}>
        <SearchIcon />
      </IconButton>
      </Paper>

      { (movies.length!==0 || noResults) &&
      <Paper className={classes.results}>
      <Grid container spacing={3} className={classes.grid}>
        {movies.map(movie=><Grid key={movie.id} item xs={12} md={6}>
        <Paper className={classes.movie} onClick={() => goToMovie(movie)}>
          <Grid container>
            <Grid item xs={2}>
              <img src={getImage(movie)} alt={movie.title + 'Poster'} />
            </Grid>
            <Grid item xs={10} className={classes.moviedetails}>
              <Typography component="h2" variant="h4" gutterBottom>
                {movie.title}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {released(movie.release_date)}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
        </Grid>)}

        { noResults && <Grid item xs={12} md={12}>
        <Paper className={classes.noresults}><Typography variant="body1">No results found</Typography></Paper>
        </Grid>}

        { moreResults && <Grid item xs={12} md={12}>
        <Paper onClick={() => setPage(page+1)} className={classes.nextpage}><Typography variant="button">Next page</Typography></Paper>
        </Grid>}
      </Grid>

      </Paper>
    }

    </div>
  );
};

export default MovieSearch;
