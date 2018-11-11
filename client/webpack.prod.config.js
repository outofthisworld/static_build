const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

process.env.NODE_ENV = 'production';

const config = {
  entry: './src/entry.js',
  output: {
    path: path.resolve(__dirname, 'public','dist','prod'),
    filename: '[name].production.[contenthash].bundle.js'
  },
  mode:process.env.NODE_ENV || 'production',
  context: path.resolve(__dirname),
  devtool:'none',
  target:'web',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [
        {
            loader: 'babel-loader',
            options: {
                cacheDirectory: true,
                presets: [
                    [
                    '@babel/preset-env',
                        {
                            modules: false
                        }
                    ],    
                    '@babel/preset-react'
                ]
            }
        }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.svg$/,
        use: 'file-loader'
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              mimetype: 'image/png'
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [
      '.js',
      '.jsx'
    ]
  },
  resolve:{
      //Any short module paths go here
      alias:{}
  },
  devServer: {
    contentBase: path.join(__dirname,'public','static'),
    compress:true,
    port:5555,
    hot:true,
     watchContentBase: true,
     watchOptions: {
      headers: {
        'X-Node-Env': process.env.NODE_ENV 
      },
      poll: 500,
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
        template: path.join(__dirname,'templates','index.html'),
        filename: 'index.[hash].html',
        minifiy:true,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': `"${process.env.NODE_ENV || 'production'}"`,
    }),
    new CleanWebpackPlugin([
          'public/dist/prod/*.*'
    ], {
            // Absolute path to your webpack root folder (paths appended to this)
            // Default: root of your package
            root: __dirname,

            // Write logs to console.
            verbose: true,
            
            // Use boolean "true" to test/emulate delete. (will not remove files).
            // Default: false - remove files
            dry: false,           

            // If true, remove files on recompile. 
            // Default: false
            watch: true,

            // Instead of removing whole path recursively,
            // remove all path's content with exclusion of provided immediate children.
            // Good for not removing shared files from build directories.
            exclude: [ 'files', 'to', 'ignore' ],

            // allow the plugin to clean folders outside of the webpack root.
            // Default: false - don't allow clean folder outside of the webpack root
            allowExternal: false,
            
            // perform clean just before files are emitted to the output dir
            // Default: false
            beforeEmit: false
    })
  ],
  optimization: {
    runtimeChunk:'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\\/]node_modules[\\\/]/,
          name: 'vendors',
          chunks: 'all',
        }
      }
    }
  }
}

module.exports = config;