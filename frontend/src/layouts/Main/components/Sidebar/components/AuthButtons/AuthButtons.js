import React from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';

import { useAuth0 } from "../../../../../../react-auth0-spa";

import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 'fit-content'
  },
  avatar: {
    width: 60,
    height: 60
  },
  name: {
    marginTop: theme.spacing(1)
  }
}));

const AuthButtons = props => {

  const { className, ...rest } = props;

  const classes = useStyles();
  const { loginWithRedirect } = useAuth0();

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
        <Button variant="contained" size="large" color="primary" className={classes.margin} onClick={() => loginWithRedirect({})}>
            Log in / Sign up
        </Button>
    </div>
  );
};

AuthButtons.propTypes = {
  className: PropTypes.string
};

export default AuthButtons;
