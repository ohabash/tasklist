var path = require('path');

module.exports = {
  entry: './assets/js/index.js',
  output: {
    filename: 'bundler.js',
    path: here('dist')
  },
};

function j() {
new webpack.ProvidePlugin({
'window.jQuery': 'jquery',
'windows.$': 'jquery'
});
}


function here(d) {
	if (!d){ return __dirname; }
	return path.resolve(__dirname, d);
}