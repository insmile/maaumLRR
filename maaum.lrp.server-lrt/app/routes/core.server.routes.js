'use strict';

module.exports = function(app) {
	var multer = require('multer');

	// Root routing
	var core = require('../../app/controllers/core.server.controller');
    var users = require('../../app/controllers/users.server.controller');

	app.route('/').get(core.index);

	app.route('/trim/image').get(core.trimImage);
	app.route('/dump/image').get(core.dumpImage);
	app.route('/recover/image').get(core.recoverImage);

	app.route('/dashboard/admin').get(core.dashboardAdmin);
    app.route('/dashboard/manager').get(users.requiresLogin, core.dashboardManager);

	app.post('/uploads', multer({
		dest: './uploads/',
		rename: function (fieldname, filename) {
			return filename.replace(/\W+/g, '-').toLowerCase() + Date.now();
		}
	}), function(req, res){
		console.log(req.files);
		res.send(req.files);
	});
};
