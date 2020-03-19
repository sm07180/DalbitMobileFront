const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const webpack = require('webpack')
const fs = require('fs')

const ENV_URL = {
  dev: {
    BROADCAST_SOCKET_URL: JSON.stringify('devsv1.dalbitcast.com'),
    WEBRTC_SOCKET_URL: JSON.stringify('wss://v154.dalbitcast.com:5443/WebRTCAppEE/websocket'),
    API_SERVER_URL: JSON.stringify('https://devapi2.dalbitcast.com'),
    STATIC_PHOTO_SERVER_URL: JSON.stringify('https://devimage.dalbitcast.com'),
    USER_PHOTO_SERVER_URL: JSON.stringify('https://devphoto2.dalbitcast.com')
  },
  stage: {
    BROADCAST_SOCKET_URL: JSON.stringify('devsv1.dalbitcast.com'),
    WEBRTC_SOCKET_URL: JSON.stringify('wss://v154.dalbitcast.com:5000/WebRTCAppEE/websocket'),
    API_SERVER_URL: JSON.stringify('https://devapi.dalbitcast.com'),
    STATIC_PHOTO_SERVER_URL: JSON.stringify('https://devimage.dalbitcast.com'),
    USER_PHOTO_SERVER_URL: JSON.stringify('https://devphoto.dalbitcast.com')
  },
  real: {
    BROADCAST_SOCKET_URL: JSON.stringify('sv.dalbitcast.com'),
    WEBRTC_SOCKET_URL: JSON.stringify('wss://v154.dalbitcast.com:5000/WebRTCAppEE/websocket'),
    API_SERVER_URL: JSON.stringify('https://api.dalbitcast.com'),
    STATIC_PHOTO_SERVER_URL: JSON.stringify('https://image.dalbitcast.com'),
    USER_PHOTO_SERVER_URL: JSON.stringify('https://photo.dalbitcast.com')
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
          test: /\.(js|jsx)$/,
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
              options: {minimize: false}
            }
          ]
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader']
        },
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
          exclude: /node_modules/
        },

        {
          // images css에서 background-image 속성 loader
          test: /\.(jpe?g|png|gif|svg|ico)$/,
          loader: 'url-loader',
          options: {
            publicPath: './dist',
            name: 'images/[name].[ext]',
            limit: 10000, // 10kb
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
      extensions: ['*', '.js', '*.jsx'],
      modules: [path.resolve(__dirname, './src'), 'node_modules']
    },

    plugins: [
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
        __BROADCAST_SOCKET_URL: ENV_URL[env]['BROADCAST_SOCKET_URL'],
        __WEBRTC_SOCKET_URL: ENV_URL[env]['WEBRTC_SOCKET_URL'],
        __API_SERVER_URL: ENV_URL[env]['API_SERVER_URL'],
        __STATIC_PHOTO_SERVER_URL: ENV_URL[env]['STATIC_PHOTO_SERVER_URL'],
        __USER_PHOTO_SERVER_URL: ENV_URL[env]['USER_PHOTO_SERVER_URL']
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
        key: fs.readFileSync(path.resolve(__dirname, 'key/privkey.pem')),
        cert: fs.readFileSync(path.resolve(__dirname, 'key/fullchain.pem'))
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

    config.optimization = {
      minimize: true,
      minimizer: [
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
