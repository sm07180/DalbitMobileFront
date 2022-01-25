const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const LoadablePlugin = require('@loadable/webpack-plugin');
const webpack = require('webpack')
const fs = require('fs')

const ENV_URL = {
  dev: {
    WEBRTC_SOCKET_URL: JSON.stringify('wss://vo.dalbitlive.com:5443/WebRTCAppEE/websocket'),
    API_SERVER_URL: JSON.stringify('https://devm-gonetpower.dalbitlive.com:463'),
    CHAT_SOCKET_URL: JSON.stringify("devsv1.dalbitlive.com"),
    STATIC_PHOTO_SERVER_URL: JSON.stringify('https://image.dalbitlive.com'),
    USER_PHOTO_SERVER_URL: JSON.stringify('https://devphoto2.dalbitlive.com'),
    PAY_SERVER_URL: JSON.stringify('https://devpay.dalbitlive.com'),
    SOCIAL_URL: JSON.stringify('https://devwww.dalbitlive.com/social')
  },
  stage: {
    WEBRTC_SOCKET_URL: JSON.stringify('wss://v154.dalbitlive.com:5443/WebRTCAppEE/websocket'),
    API_SERVER_URL: JSON.stringify('https://devapi.dalbitlive.com'),
    CHAT_SOCKET_URL: JSON.stringify("devsv1.dalbitlive.com"),
    STATIC_PHOTO_SERVER_URL: JSON.stringify('https://image.dalbitlive.com'),
    USER_PHOTO_SERVER_URL: JSON.stringify('https://devphoto.dalbitlive.com'),
    PAY_SERVER_URL: JSON.stringify('https://devpay.dalbitlive.com'),
    SOCIAL_URL: JSON.stringify('https://devwww.dalbitlive.com/social')
  },
  real: {
    WEBRTC_SOCKET_URL: JSON.stringify('wss://v154.dalbitlive.com:5443/WebRTCAppEE/websocket'),
    CHAT_SOCKET_URL: JSON.stringify("sv.dalbitlive.com"),
    API_SERVER_URL: JSON.stringify('https://api.dalbitlive.com'),
    STATIC_PHOTO_SERVER_URL: JSON.stringify('https://image.dalbitlive.com'),
    USER_PHOTO_SERVER_URL: JSON.stringify('https://photo.dalbitlive.com'),
    PAY_SERVER_URL: JSON.stringify('https://pay.dalbitlive.com'),
    SOCIAL_URL: JSON.stringify('https://www.dalbitlive.com/social')
  }
}

module.exports = (_, options) => {
  const {env, mode} = options
  const config = {
    entry: {
      app: './src/index.js',
      login: './src/html/login.js'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/dist/',
      filename: '[name].[hash].js',
      chunkFilename: '[name].[chunkhash].js'
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /(node_modules)|(dist)/,
          use: {
            loader: 'babel-loader',
            options: {
              env: {
                development: {
                  compact: false
                }
              }
            }
          }
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader',
              options: {minimize: true}
            }
          ]
        },
        {
          test: /\.(css)$/,
          use: [MiniCssExtractPlugin.loader,'style-loader', 'css-loader', 'sass-loader'],
          exclude: /node_modules/
        },
        {
          test: /\.(scss|sass)$/,
          exclude: /\.module\.(scss|sass)$/,
          use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader',  'sass-loader']
        },
        {
          // images css에서 background-image 속성 loader
          test: /\.(jpe?g|png|gif|svg|ico)$/,
          loader: 'url-loader',
          options: {
            publicPath: './dist',
            name: 'images/[name].[ext]',
            limit: 20000, // 10kb
            fallback: 'file-loader' // 파일사이즈가 10k보다 큰 경우, file-loader 이용하여 파일 복사
          }
        },
        {
          // font loader
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          loader: 'file-loader'
        }
      ]
    },

    resolve: {
      extensions: ['*', '.js', '*.jsx', '.ts', '.tsx'],
      modules: [path.resolve(__dirname, './src'), 'node_modules']
    },

    plugins: [
      new LoadablePlugin(), new MiniCssExtractPlugin(),
      new HtmlWebPackPlugin({
        template: './public/index.html', // public/index.html 파일을 읽는다.
        filename: 'index.html', // output으로 출력할 파일은 index.html 이다.
        chunks: ['app'],
        showErrors: false // 에러 발생시 메세지가 브라우저 화면에 노출 된다.
      }),
      new HtmlWebPackPlugin({
        template: './public/html/login.html',
        filename: 'login.html',
        chunks: ['login']
      }),
      new CopyWebpackPlugin([{from: './public/static'}]),

      new webpack.DefinePlugin({
        __NODE_ENV: JSON.stringify(env),
        __WEBRTC_SOCKET_URL: ENV_URL[env]['WEBRTC_SOCKET_URL'],
        __API_SERVER_URL: ENV_URL[env]['API_SERVER_URL'],
        __STATIC_PHOTO_SERVER_URL: ENV_URL[env]['STATIC_PHOTO_SERVER_URL'],
        __USER_PHOTO_SERVER_URL: ENV_URL[env]['USER_PHOTO_SERVER_URL'],
        __PAY_SERVER_URL: ENV_URL[env]['PAY_SERVER_URL'],
        __SOCIAL_URL: ENV_URL[env]['SOCIAL_URL'],
        __CHAT_SOCKET_URL: ENV_URL[env]["CHAT_SOCKET_URL"],
      })
    ]
  }
  if (mode === 'development') {
    config.devtool = 'source-map'
    config.devServer = {
      hot: true,
      contentBase: path.resolve('./'),
      index: 'index.html',
      port: 443,
      host: '0.0.0.0',
      historyApiFallback: true, // 서버사이드렌더링 문제 해결 코드 express 를 사용할 경우 nodejs 에서 해결
      disableHostCheck: true,
      https: {
        ca: fs.readFileSync(path.resolve(__dirname, 'key/fullchain.pem')),
        key: fs.readFileSync(path.resolve(__dirname, 'key/key.pem')),
        cert: fs.readFileSync(path.resolve(__dirname, 'key/cert.pem'))
      }
    }

    config.output.path = path.resolve(__dirname)
    config.output.publicPath = '/'

    config.plugins.push(new webpack.HotModuleReplacementPlugin())
  } else {
    config.plugins.push(
      new CleanWebpackPlugin({
        cleanAfterEveryBuildPatterns: ['./dist']
      })
    )

    let isDev = env === 'dev';
    config.optimization = {
      minimize: !isDev,
      minimizer:
        isDev ? [] : [
            new TerserPlugin({
              terserOptions: {
                compress: {
                  drop_console: true
                }
              }
            })
          ]
    }
  }
  return config
}
