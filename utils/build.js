// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

var webpack = require('webpack'),
  config = require('../webpack.config');

delete config.chromeExtensionBoilerplate;

webpack(config, function(err, stats) {
  if (err) throw err;
  if (stats.hasErrors()) {
    console.error(stats.toString({
      colors: true,
      all: false,
      errors: true,
      warnings: true
    }));
    process.exit(1);
  }
  console.log(stats.toString({
    colors: true,
    chunks: false
  }));
});
