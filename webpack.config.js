module.exports = {
  // ... other webpack config ...
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["babel-loader", "source-map-loader"], // Or similar
        exclude: /node_modules/,
      },
      // ... other rules ...
    ],
  },
  // ...
};