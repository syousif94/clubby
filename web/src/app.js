import React from 'react';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AppContainer } from 'react-hot-loader';
import AppRoot from './App/AppRoot';
import './App.css';
import { initializeUser } from './lib/user';

const isProd = process.env.NODE_ENV === 'production';

function render(Component) {
  initializeUser();

  ReactDOM.hydrate(
    <HelmetProvider>
      <AppContainer>
        <Component />
      </AppContainer>
    </HelmetProvider>,
    document.getElementById('react-root')
  );
}
render(AppRoot);

if (module.hot) {
  module.hot.accept('./App/AppRoot.js', () => {
    const NewAppRoot = require('./App/AppRoot.js').default;
    render(NewAppRoot);
  });
}
