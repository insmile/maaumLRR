'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var products = require('../../app/controllers/products.server.controller.js');

	// Progressnotes Routes
	app.route('/products')
		.get(users.requiresLogin, products.list)
		.post(users.requiresLogin, products.create);

    app.route('/products/DT')
        .get(products.DT);

    app.route('/products/insert')
        .post(users.requiresLogin, products.create);

	app.route('/products/:productID')
		.get(users.requiresLogin, products.read)
		.put(users.requiresLogin, products.hasAuthorization, products.update)
        .post(users.requiresLogin, products.hasAuthorization, products.update)
		.delete(users.requiresLogin, products.hasAuthorization, products.delete);

	// Finish by binding the Center middleware
	app.param('productID', products.productByID);
};
