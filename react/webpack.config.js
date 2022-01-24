const Webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  devServer: {
    compress: true,
    historyApiFallback: true,
    hot: false,
    webSocketServer: false,
  },
  devtool: 'source-map',
  entry: path.resolve(__dirname, 'src', 'index.js'),
  mode: 'development',
  module: {
    rules: [{
      enforce: 'pre',
      test: /\.js$/,
      use: [{
        loader: 'source-map-loader',
        options: {
          filterSourceMappingUrl: (url, resourcePath) => {
            if (resourcePath.includes('/node_modules/')) {
              return false;
            }

            return true;
          },
        },
      }],
    }, {
      exclude: /node_modules/,
      include: path.resolve(__dirname, 'src'),
      test: /\.(jsx|js)$/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env',
            '@babel/preset-react',
          ],
          plugins: [
            ['@babel/plugin-transform-runtime', {
              regenerator: true,
            }],
          ],
        },
      }],
    }, {
      test: /\.css$/i,
      use: ['style-loader', 'css-loader'],
    }, {
      test: /\.s[ac]ss$/i,
      use: ['style-loader', 'css-loader', 'sass-loader'],
    }, {
      test: /\.(otf|eot|ttf|woff|woff2)$/i,
      use: [{
        loader: 'url-loader',
      }],
    }],
  },
  output: {
    crossOriginLoading: 'anonymous',
    filename: 'static/bundle.js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/',
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{
        from: './src/keycloak-source.json',
        to: './keycloak.json',
        force: true,
        transform(content) {
          const keycloak = JSON.parse(content.toString());

          if ('KEYCLOAK_CLIENT_ID' in process.env) {
            keycloak.resource = process.env.KEYCLOAK_CLIENT_ID;
          }

          if ('KEYCLOAK_REALM' in process.env) {
            keycloak.realm = process.env.KEYCLOAK_REALM;
          }

          if ('KEYCLOAK_FRONTEND_URL' in process.env) {
            keycloak['auth-server-url'] = process.env.KEYCLOAK_FRONTEND_URL;

            if (process.env.KEYCLOAK_FRONTEND_URL === 'http://localhost:8080/auth/') {
              keycloak['ssl-required'] = 'none';
            }
          }

          return JSON.stringify(keycloak, null, 2);
        },
      }],
    }),
    new Webpack.DefinePlugin({
      __API_BASE__: 'API_BASE' in process.env ? JSON.stringify(process.env.API_BASE) : JSON.stringify('/'),
      __ENABLE_KEYCLOAK__: 'ENABLE_KEYCLOAK' in process.env ? process.env.ENABLE_KEYCLOAK === 'true' : false,
    }),
  ],
  watchOptions: {
    ignored: /node_modules/,
    poll: 1000,
  },
};
