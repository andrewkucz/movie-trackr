import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Divider, Drawer } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ListAltIcon from '@material-ui/icons/ListAlt';
import VisibilityIcon from '@material-ui/icons/Visibility';
import InfoIcon from '@material-ui/icons/Info';
import StarsIcon from '@material-ui/icons/Stars';
import EventIcon from '@material-ui/icons/Event';
import TheatersIcon from '@material-ui/icons/Theaters';
import SearchIcon from '@material-ui/icons/Search';

import { Profile, SidebarNav, AuthButtons } from './components';

import { useAuth0 } from "../../../../react-auth0-spa";

const useStyles = makeStyles(theme => ({
  drawer: {
    width: 240,
    [theme.breakpoints.up('lg')]: {
      marginTop: 64,
      height: 'calc(100% - 64px)'
    }
  },
  root: {
    backgroundColor: theme.palette.white,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2)
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  nav: {
    marginBottom: theme.spacing(1)
  }
}));

const Sidebar = props => {
  const { open, variant, onClose, className, ...rest } = props;

  const { isAuthenticated, loading } = useAuth0();

  const classes = useStyles();

  const pages = [[
      {
        title: 'Home',
        href: '/',
        icon: <DashboardIcon />
      },
      {
        title: 'Search',
        href: '/search',
        icon: <SearchIcon />
      },
      {
        title: 'Now Playing',
        icon: <TheatersIcon />,
        href: '/movies/Now%20Playing'
      },
      {
        title: 'Upcoming',
        icon: <EventIcon />,
        href: '/movies/Upcoming'
      },
      {
        title: 'Top Rated',
        icon: <StarsIcon />,
        href: '/movies/Top%20Rated'
      }
    ],
    [{
      title: 'My Want to Watch',
      href: '/list/watch',
      icon: <ListAltIcon />
    },
    {
      title: 'My Seen Movies',
      href: '/list/seen',
      icon: <VisibilityIcon />
    }],
    [{
      title: 'About',
      href: '/about',
      icon: <InfoIcon />
    }] 
  ];

  return (
    <Drawer
      anchor="left"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}
    >
      <div
        {...rest}
        className={clsx(classes.root, className)}
      >
        {isAuthenticated ? <Profile /> : (!loading && <AuthButtons />)}
        <Divider className={classes.divider} />
        {pages.map((p,i) => 
        <div key={i}>
        <SidebarNav
          className={classes.nav}
          pages={p}
        />
        {(i!==pages.length-1) && <Divider className={classes.divider} />}
        </div>)}       
      </div>
    </Drawer>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired
};

export default Sidebar;
