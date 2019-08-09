const path = require("path");

var config = {
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist")
  }
};

module.exports = (env, argv) => {
  if (argv.mode === "development") {
    config.devtool = "inline-source-map";
  }
  if (argv.mode === "production") {
  }

  return config;
};

// module.exports = {
//   entry: "./src/index.ts",
//   devtool: "inline-source-map",
//   module: {
//     rules: [
//       {
//         test: /\.tsx?$/,
//         use: "ts-loader",
//         exclude: /node_modules/
//       }
//     ]
//   },
//   resolve: {
//     extensions: [".tsx", ".ts", ".js"]
//   },
//   output: {
//     filename: "main.js",
//     path: path.resolve(__dirname, "dist")
//   }
// };
