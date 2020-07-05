import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { matchRoutes } from 'react-router-config';
import { HelmetProvider } from 'react-helmet-async';
import { flushChunkNames } from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';
import Routes, { routes } from '../App/Routes';
import serialize from 'serialize-javascript';
import { MediaContextProvider, mediaStyle, SSRStyleID } from '../lib/media';

export default ({ clientStats }) => (req, res) => {
  const token = req.cookies.token;

  const promises = matchRoutes(routes, req.path).map(({ route, match }) => {
    return route.loadData
      ? route.loadData(match.params).then((data) => {
          return data;
        })
      : Promise.resolve();
  });

  Promise.all(promises).then((data) => {
    const DATA = data.reduce((data, obj) => {
      return {
        ...data,
        ...obj,
      };
    }, {});

    const context = {};
    const helmetContext = {};

    const app = renderToString(
      <MediaContextProvider>
        <HelmetProvider context={helmetContext}>
          <StaticRouter location={req.originalUrl} context={context}>
            <Routes />
          </StaticRouter>
        </HelmetProvider>
      </MediaContextProvider>
    );

    const { helmet } = helmetContext;

    const { js, styles, cssHash } = flushChunks(clientStats, {
      chunkNames: flushChunkNames(),
    });

    if (context.url) {
      const redirectStatus = context.status || 302;
      res.redirect(redirectStatus, context.url);
      return;
    }

    res.header('Content-Type', 'text/html').send(
      `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta name="theme-color" content="#000000"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
            ${styles}
            ${helmet.title}
            ${helmet.meta.toString()}
            ${helmet.link.toString()}
            <style id="${SSRStyleID}" type="text/css">${mediaStyle}</style>
            <script type="text/javascript">window.DATA = ${serialize(
              DATA
            )}</script>
          </head>
          <body ontouchstart="">
            <div id="react-root">${app}</div>
            ${js}
            ${cssHash}
          </body>
        </html>`
    );
  });
};
