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
  } else if (argv.mode === "production") {
  } else if (argv.mode === "none") {
    config.entry = "./src/midi_view.ts";
    config.output.filename = "midi_view.js";
    config.output.path = path.resolve(__dirname, "build");
    config.output.libraryTarget = "umd";
    config.output.globalObject = "typeof self !== 'undefined' ? self : this";
  }

  return config;
};
