import React from 'react';
import { Route, Switch, useLocation } from 'react-router';
import { RedirectWithStatus } from '../Components/RedirectStatus';
import { initializeUser, user } from '../lib/user';
import SidebarLayout from '../Components/SidebarLayout';
import SignUp from '../Views/SignUp';
import Login from '../Views/Login';
import Home from '../Views/Home';

const isProd = process.env.NODE_ENV === 'production';

export const routes = [
  {
    path: `/signup`,
    component: SignUp,
  },
  {
    path: `/login`,
    component: Login,
  },
  {
    exact: true,
    path: `/`,
    component: Home,
  },
];

export default ({ staticContext }) => {
  // const location = useLocation();
  // const background = location && location.state && location.state.background;
  return (
    <>
      <SidebarLayout>
        <Switch>
          {routes.map((route) => (
            <Route key={route.path} {...route} />
          ))}
        </Switch>
      </SidebarLayout>
    </>
  );
};
