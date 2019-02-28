module.exports = (env) => {
  if (env && env.NODE_ENV === 'production') {
    return require('./webpack/webpack.config.prod.js');
  } else {
    return require('./webpack/webpack.config.dev.js');
  }
}