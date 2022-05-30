const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const webpack = require('webpack')
const fs = require('fs')
const Dotenv = require("dotenv-webpack")
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const {ESBuildMinifyPlugin} = require("esbuild-loader");

module.exports = (_, options) => {
    const {env, mode} = options

    let paths = ".env.prod";
    if (env === "dev") {
        paths = ".env.dev.local";
    } else if (env === "stage") {
        paths = ".env.dev";
    }
    const dotTarget = path.join(__dirname, paths);

    //없을경우 dev env 환경변수 사용 하여 처리
    const exists = fs.existsSync(dotTarget);
    if (!exists && env === "dev") {
        fs.copyFileSync(path.join(__dirname, ".env.dev"), dotTarget);
    }

    const dotenv = new Dotenv({
        path: dotTarget,
        systemvars: false,
    });
    const ENV_URL = dotenv.getEnvs().env;

    const spreadElements = [
        new HtmlWebPackPlugin({
            template: './public/index.html', // public/index.html 파일을 읽는다.
            filename: 'index.html', // output으로 출력할 파일은 index.html 이다.
            chunks: ['app'],
            showErrors: false // 에러 발생시 메세지가 브라우저 화면에 노출 된다.
        }),
        new CopyWebpackPlugin([{from: './public/static'}]),

        new webpack.DefinePlugin({
            __NODE_ENV: JSON.stringify(env),
            __WEBRTC_SOCKET_URL: JSON.stringify(ENV_URL['WEBRTC_SOCKET_URL']),
            __API_SERVER_URL: JSON.stringify(ENV_URL['API_SERVER_URL']),
            __STATIC_PHOTO_SERVER_URL: JSON.stringify(ENV_URL['STATIC_PHOTO_SERVER_URL']),
            __USER_PHOTO_SERVER_URL: JSON.stringify(ENV_URL['USER_PHOTO_SERVER_URL']),
            __PAY_SERVER_URL: JSON.stringify(ENV_URL['PAY_SERVER_URL']),
            __SOCIAL_URL: JSON.stringify(ENV_URL['SOCIAL_URL']),
            __CHAT_SOCKET_URL: JSON.stringify(ENV_URL["CHAT_SOCKET_URL"]),
        })];
    if(env === "dev"){
        let localWebHtmlPack = new HtmlWebPackPlugin({
            template: './public/indexLocalServer.html', // public/index.html 파일을 읽는다.
            filename: 'indexLocalServer.html', // output으로 출력할 파일은 index.html 이다.
            chunks: ['app'],
            showErrors: false // 에러 발생시 메세지가 브라우저 화면에 노출 된다.
        });
        spreadElements.push(localWebHtmlPack);
    }
    const smp = new SpeedMeasurePlugin();

    const config = smp.wrap({
        entry: {
            app: './src/index.js',
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
                    loader: 'esbuild-loader',
                    options:{
                        loader:'tsx',
                        target: 'es2015',
                        tsconfigRaw: require('./tsconfig.json')
                    },
                },
                // {
                //     test: /\.(js|jsx|ts|tsx)$/,
                //     exclude: /(node_modules)|(dist)/,
                //     use: {
                //         loader: 'babel-loader',
                //         options: {
                //             env: {
                //                 development: {
                //                     compact: false
                //                 }
                //             }
                //         }
                //     }
                // },
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
                    test: /\.(css|scss|sass)$/,
                    use: ['style-loader', /*MiniCssExtractPlugin.loader, */'css-loader', 'sass-loader'],
                    exclude: /node_modules/
                },
                {
                    // images css에서 background-image 속성 loader
                    test: /\.(jpe?g|png|gif|svg|ico)$/,
                    loader: 'url-loader',
                    options: {
                        publicPath: '/dist',
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
            //new LoadablePlugin(), new MiniCssExtractPlugin(),
            ...spreadElements
        ]
    })
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
                ca: fs.readFileSync(path.resolve(__dirname, 'key/dalla_fullchain.pem')),
                key: fs.readFileSync(path.resolve(__dirname, 'key/dalla_key.pem')),
                cert: fs.readFileSync(path.resolve(__dirname, 'key/dalla_cert.pem'))
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
                isDev ? [
                  new ESBuildMinifyPlugin({
                      target: 'es2015',
                      css: true  // Apply minification to CSS assets
                  })
                ] : [
                    new TerserPlugin({
                        terserOptions: {
                            compress: {
                                drop_console: true
                            }
                        }
                    }),
                ]
        }
    }
    return config
}
