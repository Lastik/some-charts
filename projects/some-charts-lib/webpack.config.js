const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const nodeExternals = require('webpack-node-externals');
const packageJson = require(path.resolve(__dirname, 'package.json'));

const buildDirectory = './../../dist/' + packageJson.name;

module.exports = {
  target: 'web',
  mode: "production",
  devtool: 'source-map',
  entry: './src/index.ts',
  externalsPresets: { node: true }, // in order to ignore built-in modules like path, fs, etc.
  externals: [nodeExternals({
    modulesDir: path.resolve(__dirname, './../../node_modules')
  })],
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, buildDirectory),
    library: "some-charts",
    libraryTarget: 'umd',
    clean: true,
    globalObject: 'this',
    umdNamedDefine: true,
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({ extractComments: false }),
      new CssMinimizerPlugin()
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
      cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, buildDirectory)],
      dangerouslyAllowCleanPatternsOutsideProject: true
    }),
    new CopyPlugin({
      patterns: [{
        from: "package.json",
        to: buildDirectory,
        transform(content, absoluteFrom) {
          content.scripts = undefined;
          return content;
        }
      }]
    })
  ],
  module: {
    rules: [
      {
        test: /\.(m|j|t)s$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve(__dirname, './tsconfig.lib.json')
            }
          }
        ],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader', // creates style nodes from JS strings
          {
            loader: 'css-loader', // translates CSS into CommonJS
            options: {
              importLoaders: 1
            }
          },
          'postcss-loader', // post process the compiled CSS
          'sass-loader' // compiles Sass to CSS, using Node Sass by default
        ]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  }
};
