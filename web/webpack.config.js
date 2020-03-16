const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const fs = require('fs')

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
          //use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],  // css 파일 단독 파일로 추출하고 싶을때 사용
          use: ['style-loader', 'css-loader', 'sass-loader'],
          exclude: /node_modules/
        },

        {
          // images css에서 background-image 속성 loader
          test: /\.(jpe?g|png|gif|svg|ico)$/,
          loader: 'url-loader',
          options: {
            //name: '[name].[ext]?[hash]',
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
      new CopyWebpackPlugin([{from: './public/static'}])
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
    config.plugins.push(
      new webpack.DefinePlugin({
        __WEBRTC_SOCKET_URL: JSON.stringify('wss://v154.dalbitcast.com:5443/WebRTCAppEE/websocket')
      })
    )
  } else {
    config.plugins.push(
      new CleanWebpackPlugin({
        cleanAfterEveryBuildPatterns: ['./dist']
      })
    )

    config.plugins.push(
      new webpack.DefinePlugin({
        __WEBRTC_SOCKET_URL: JSON.stringify('wss://v154.dalbitcast.com:5443/WebRTCAppEE/websocket')
      })
    )
  }

  return config
}
