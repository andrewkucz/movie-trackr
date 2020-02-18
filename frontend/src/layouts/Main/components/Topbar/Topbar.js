import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Toolbar, Hidden, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import InputIcon from '@material-ui/icons/Input';

import { useAuth0 } from "../../../../react-auth0-spa";

import logo from '../../../../assets/logos/logo-white.png';

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none'
  },
  flexGrow: {
    flexGrow: 1
  },
  signOutButton: {
    marginLeft: theme.spacing(1)
  },
  logo: {
    width: 200,
    marginTop: 5,
    marginLeft: 20
  }
}));


const Topbar = props => {
  const { className, onSidebarOpen, ...rest } = props;

  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

  const logoutWithRedirect = () =>
  logout({
    returnTo: window.location.origin
  });

  const classes = useStyles();

  const [notifications] = useState([]);

  return (
    <AppBar
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Toolbar>
        <RouterLink to="/">
          <img
            alt="Logo"
            src={logo}
            className={classes.logo}
          />
        </RouterLink>
        <div className={classes.flexGrow} />
        { isAuthenticated && <Hidden mdDown>
          <IconButton
            className={classes.signOutButton}
            color="inherit"
            onClick={() => logoutWithRedirect()}
          >
            <InputIcon />
          </IconButton>
        </Hidden> }
        <Hidden lgUp>
          <IconButton
            color="inherit"
            onClick={onSidebarOpen}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func
};

export default Topbar;
