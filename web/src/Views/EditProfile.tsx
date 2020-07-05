import React from 'react';
import { user$ } from '../lib/user';
import { Redirect, RouteComponentProps } from 'react-router';

export default (props: RouteComponentProps) => {
  if (!user$.value) {
    return (
      <Redirect
        to={{
          pathname: '/login',
          state: { from: props.location },
        }}
      />
    );
  }
  return <div>profile</div>;
};
