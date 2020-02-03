const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const webpack = require('webpack')
const fs = require('fs')

module.exports = (env, options) => {
  const config = {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/dist/',
      filename: 'bundle.js' //2020-02-03 [kimhogyeom] 나중에 배포할때는 hash 적용해서 해야 할듯
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: '/node_modules',
          use: ['babel-loader']
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
      // alias: {
      //   Context: path.resolve(__dirname, 'src/context/'),
      //   Pages: path.resolve(__dirname, 'src/pages/'),
      //   App: path.resolve(__dirname, 'src/pages/app/'),
      //   Contents: path.resolve(__dirname, 'src/contents/'),
      //   Styles: path.resolve(__dirname, 'src/styles/'),
      //   Components: path.resolve(__dirname, 'src/components/'),
      //   '@': path.resolve(__dirname, 'src/')
      // }
    }
  }
  if (options.mode === 'development') {
    config.devtool = 'source-map'
    config.devServer = {
      hot: true,
      contentBase: path.resolve('./dist'),
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
    config.plugins = [
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebPackPlugin({
        template: './public/index.html', // public/index.html 파일을 읽는다.
        filename: 'index.html', // output으로 출력할 파일은 index.html 이다.
        title: 'Development',
        showErrors: true // 에러 발생시 메세지가 브라우저 화면에 노출 된다.
      }),
      new MiniCssExtractPlugin({
        filename: 'style.css'
      })
    ]
  } else {
    config.plugins = [
      new CleanWebpackPlugin({
        cleanAfterEveryBuildPatterns: ['./dist']
      })
    ]
  }

  return config
}
