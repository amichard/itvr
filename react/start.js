const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const path = require('path');

const webpackConfig = require('./webpack.config');

const serverOptions = {
  compress: true,
  historyApiFallback: {
    rewrites: [{
      from: /\/api/,
      to: '/api',
    }],
    verbose: true,
  },
  hot: true,
  port: 3000,
  static: {
    directory: path.join(__dirname, 'public'),
    publicPath: '/',
    serveIndex: true,
  },
};

const compiler = Webpack(webpackConfig);
const devServer = new WebpackDevServer(serverOptions, compiler);

(async () => {
  await devServer.start();
})();
