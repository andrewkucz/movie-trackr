import React, {useEffect, useState, forwardRef} from 'react';
import { makeStyles } from '@material-ui/styles';
import {  Paper, Typography } from '@material-ui/core';
import MaterialTable from 'material-table';

import { useParams } from 'react-router-dom';

import { useAuth0 } from "../../react-auth0-spa";


import { api_key } from '../../tmdb_config'
import history from "../../utils/history";

import axios from 'axios';

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import VisibilityIcon from '@material-ui/icons/Visibility';

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
  };



const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  paper: {
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


const MovieList = () => {

  const classes = useStyles();
  const [movies, setMovies] = useState([]);
  const [config, setConfig] = useState({});
  const [page, setPage] = useState(0);


  const { user } = useAuth0();
  const { list } = useParams();

  const [popup, setPopup] = useState({
    open: false,
    severity: '',
    message: ''
  });


  //config
  useEffect(() => {
    console.log('Getting config...');
    axios.get('https://api.themoviedb.org/3/configuration?api_key='+api_key).then(response => {
      setConfig({
        base_url: response.data.images.base_url + response.data.images.poster_sizes[0]
      });
    });
  }, []);


  useEffect(() => {

    if(!list || (list !== 'seen' && list !== 'watch'))
    {
      return;
    }

    if(user)
    {
      let url = `https://movieapp.prestoapi.com/api/collectionitems?list=${list}&user=${user.sub}`
  
      axios.get(url).then(response => {
        setMovies(response.data);
      }).catch(err => {
        console.log(err);
      })
      
    }
  }, [user, list])


  const getImage = (movie) => {
    return (config.base_url && movie.poster && movie.poster !== null) ? config.base_url + movie.poster : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  };

  const title = list ? `${list.charAt(0).toUpperCase() + list.slice(1)} List` : 'Error';

  const renderImg = rowData => {
    return <img src={getImage(rowData)} alt={rowData.title + 'Poster'} />
  };

  const renderTitle = rowData => {
    return <Typography variant="h4" component="h4" className={classes.movieTitle}>{rowData.title}</Typography>
  };

  const cols = [
    { title: 'Poster', field: 'poster', sorting: false, render: renderImg },
    { title: 'Title', field: 'title', render: renderTitle },
  ];


  let options = {
    search: false,
    showTitle: false,
    toolbar: false,
    header: false,
    actionsColumnIndex: 2,
    actionsCellStyle: {paddingLeft: '36px', paddingRight: '36px'},
    pageSize: 10,
    pageSizeOptions: []
  };

  const markSeen = (movie) => {

    let url = '/api/v1/collectionitems/updatelist';

    axios.post(url,{...movie, list: 'seen'}).then(response => {
      console.log(response);
      const data = [...movies];
      data.splice(data.indexOf(movie), 1);
      setMovies(data);
    }).catch(err => {
      console.log(err);
    })
  }



  let actions = (list === 'watch') ? [{
      tooltip: 'Mark as Seen',
      icon: VisibilityIcon,
      onClick: (ev,row) => markSeen(row)
    }] : [];


  let editable = {
    onRowDelete: oldData =>
      new Promise((resolve, reject) => {
        let id = oldData._id;
        console.log('deleting', id);
        axios.delete('/api/v1/collectionitems/id/'+id).then(response => {
          const data = [...movies];
          data.splice(data.indexOf(oldData), 1);
          setMovies(data);
          resolve();
        }).catch(err => {
          console.log(err);
          reject();
        })
        resolve();
      }),
  };

  let onRowClick = (ev, row) => {
    console.log(row);
    history.push("/movie/" + row.tmdb_id);
  };



  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
      <Typography variant="h2" component="h2" className={classes.title}>{title}</Typography>
      <MaterialTable
        icons={tableIcons}
        columns={cols}
        data={movies}
        options={options}
        actions={actions}
        editable={editable}
        onRowClick={onRowClick}
      />
      </Paper>
    </div>
  );
};

export default MovieList;
