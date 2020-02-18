import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import { RouteWithLayout } from './components';
import { Main as MainLayout, Minimal as MinimalLayout } from './layouts';

import {
  Dashboard as DashboardView,
  NotFound as NotFoundView,
  SingleMovie as MovieView,
  MovieCollection as MoviesView,
  MovieList as ListView,
  MovieSearch as SearchView
} from './views';

const Routes = () => {
  return (
    <Switch>
      <RouteWithLayout
        component={DashboardView}
        exact
        layout={MainLayout}
        path="/"
      />
      <RouteWithLayout
        component={MovieView}
        exact
        layout={MainLayout}
        path="/movie/:id"
      />
      <RouteWithLayout
        component={MoviesView}
        exact
        layout={MainLayout}
        path="/movies/:slug"
      />
      <RouteWithLayout
        component={ListView}
        exact
        layout={MainLayout}
        path="/list/:list"
        isPrivate={true}
      />
      <RouteWithLayout
        component={SearchView}
        exact
        layout={MainLayout}
        path="/search"
      />
      <RouteWithLayout
        component={NotFoundView}
        exact
        layout={MinimalLayout}
        path="/not-found"
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default Routes;
