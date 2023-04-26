const path=require("path");
const InjectPlugin = require('webpack-inject-plugin').default;

module.exports = {
  entry: './main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'zhelpmdx.js',
    library: 'zhelpmdx',
    libraryTarget: 'umd',
    chunkFormat: false,
  },
  resolve: {
    fallback: {
      "url": false,
      "path": false,
      "os": false,
      "stream": require.resolve("stream-browserify"),
      "util": require.resolve("./polly_fill_util.cjs"),
      "process": require.resolve("process/browser"),
      "tty": false,
      "buffer": require.resolve("buffer/"),
    },
    alias: {
      "buffer": require.resolve("buffer/"),
      "util": require.resolve("./polly_fill_util.cjs"),
      "process": require.resolve("process/browser"),
    }
  },
  plugins: [
  ],
  target: "es5",
  mode: process.env.ENV == "production" ? "production" : "development",
};
