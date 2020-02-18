import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Typography, CardActionArea, Menu, CardMedia, MenuItem } from '@material-ui/core';
import axios from 'axios';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ListAltIcon from '@material-ui/icons/ListAlt';
import Tooltip from '@material-ui/core/Tooltip';
import { NavLink as RouterLink } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  content: {
    alignItems: 'center',
    display: 'flex'
  },
  title: {
    width: '90%',
    display: 'inline-block'
  },
  icon: {
    display: 'inline-block',
    width: '10%'
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  divider: {
    backgroundColor: 'darkgray'
  }
}));

const MovieCard = props => {
  const { movie, base_url, userID, list, addToUserList, setPopup} = props;
  const classes = useStyles();

  const [mouse, setMouse] = useState({X: null, Y: null});

  const isOnWatchList = list === 'watch';
  const isOnSeenList = list === 'seen';


  const handleClick = event => {
    event.preventDefault();
    if(isOnSeenList) return;
    setMouse({
      X: event.clientX - 2,
      Y: event.clientY - 4,
    });
    
  };

  const closeMenu = () => {
    setMouse({X: null, Y: null});
  };

  const getImageURL = (path) => {
    return (base_url && path !== null) ? base_url + path : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  }

  const getCollectionItem = (movie, list) => {
    return {
      user: userID,
      tmdb_id: movie.id,
      title: movie.title,
      poster: movie.poster_path || '',
      list: list
    };



  }

  const addToList = (list) => {

    let listNeedsToBeUpdated = (isOnWatchList && list === 'seen') || (isOnSeenList && list === 'watch');
    closeMenu();

    if(!userID)
    {
      setPopup({severity: 'error', open: true, message: `Must be logged in to add a movie to your ${list} list!`});
    }
    else if(isOnWatchList && list==='watch')
    {
      console.log('already on ' + list + ' list');
      setPopup({severity: 'error', open: true, message: `Movie is already on your ${list} list`});
    }
    else if(isOnSeenList && list==='seen')
    {
      console.log('already on ' + list + ' list');
      setPopup({severity: 'error', open: true, message: `Movie is already on your ${list} list`});
    }
    else
    {
      console.log(`Adding ${movie.title} to ${list} list`);
      let collectionObj = getCollectionItem(movie,list);

      let url = listNeedsToBeUpdated ? '/api/v1/collectionitems/updatelist' : '/api/v1/collectionitems';
      
      axios.post(url,collectionObj).then(response => {
        console.log(response);
        setPopup({severity: 'success', open: true, message: `Added "${collectionObj.title}" to your ${list} list`});
        addToUserList(collectionObj.tmdb_id,list);
      }).catch(err => {
        console.log(err);
        setPopup({severity: 'warning', open: true, message: `Error adding movie to your ${list} list`});
      });
    

    }
  };

  const getIcon = () => {
    
    if(isOnWatchList)
    {
      return <Tooltip title="On Your Watch List"><ListAltIcon className={classes.icon} color="primary"/></Tooltip>;
    }
    else if(isOnSeenList)
    {
      return <Tooltip title="You've Seen This Move"><CheckCircleOutlineIcon className={classes.icon} style={{ color: 'green' }}/></Tooltip>;
    }
                
  };

   
  return (
    <Card className={classes.root}>
        <CardActionArea component={RouterLink} to={'/movie/'+movie.id} onContextMenu={handleClick}>
            <CardMedia
                component="img"
                alt={movie.title + ' Poster'}
                image={getImageURL(movie.poster_path)}
            />
            <CardContent>
                <Typography className={classes.title} style={{width: (isOnWatchList || isOnSeenList) ? '90%' : '100%'}} variant="subtitle1" component="h2" noWrap>
                  {movie.title}
                </Typography>
                {getIcon()}
            </CardContent>
        </CardActionArea>

        <Menu
        keepMounted
        open={mouse.Y !== null}
        onClose={closeMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          mouse.Y !== null && mouse.X !== null
            ? { top: mouse.Y, left: mouse.X }
            : undefined
        }
      >
        {!isOnSeenList && !isOnWatchList && <MenuItem onClick={() => addToList('watch')}>Add to Want to Watch List</MenuItem>}
        {!isOnSeenList && <MenuItem onClick={() => addToList('seen')}>Add to Seen Movies List</MenuItem>}
        
      </Menu>



    </Card>

  );
};

MovieCard.propTypes = {
  className: PropTypes.string
};

export default MovieCard;
