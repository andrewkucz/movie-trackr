import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
//import PrivateRoute from "../PrivateRoute";

const RouteWithLayout = props => {
  const { layout: Layout, component: Component, isPrivate, ...rest } = props;


  //console.log('isPrivate: ' + isPrivate);

  

  return ( <Route
      {...rest}
      render={matchProps => (
        <Layout>
          <Component {...matchProps} />
        </Layout>
      )}
    />
  );
};

RouteWithLayout.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string
};

export default RouteWithLayout;
