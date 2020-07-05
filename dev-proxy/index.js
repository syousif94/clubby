const devcert = require('devcert');
const httpProxy = require('http-proxy');
const https = require('https');

const proxy = httpProxy.createProxyServer();

proxy.on('error', (e) => {
  console.log(e);
});

proxy.on('econnreset', (e) => {
  console.log(e);
});

async function app(req, res) {
  try {
    if (req.url.indexOf('/api') === 0) {
      proxy.web(req, res, { target: 'http://localhost:5000' });
    } else {
      proxy.web(req, res, { target: 'http://localhost:3456' });
    }
  } catch (error) {
    console.log(error);
  }
}

async function main() {
  const ssl = await devcert.certificateFor('localhost');

  https.createServer(ssl, app).listen(4000);

  console.log('listening on port 4000');
}

main();
