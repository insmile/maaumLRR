'use strict';
/**
 * Module dependencies.
 */

var init = require('./config/init')(),
	config = require('./config/config'),
	mongoose = require('mongoose'), // MongoDB 연결을 위해 사용
	Datatable = require('mongoose-datatable'), // MongoDB와 DataTable을 연결하기 위해 사용
	chalk = require('chalk'); // File 저장을 위해 사용

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

Datatable.configure({verbose: true, debug: false});
mongoose.plugin(Datatable.init);

// Bootstrap db connection
var db = mongoose.connect(config.db, function(err) {
	if (err) {
		console.error(chalk.red('Could not connect to MongoDB!'));
		console.log(chalk.red(err));
	}
});

// Init the express application
var app = require('./config/express')(db);

// Bootstrap passport config
require('./config/passport')();

// Start the app by listening on <port>
app.listen(config.port);

// Expose app
var exports = module.exports = app;

// Logging initialization
console.log('MEAN.JS application started on port ' + config.port);
