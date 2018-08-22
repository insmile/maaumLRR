'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var protocols = require('../../app/controllers/protocols.server.controller');

	// Protocols Routes
	app.route('/protocols')
		.get(protocols.list)
		.post(users.requiresLogin, protocols.create);

	app.route('/protocols/:protocolId')
		.get(protocols.read)
		.put(users.requiresLogin, protocols.hasAuthorization, protocols.update)
		.post(users.requiresLogin, protocols.hasAuthorization, protocols.update)
		.delete(users.requiresLogin, protocols.hasAuthorization, protocols.delete);

	// Finish by binding the Protocol middleware
	app.param('protocolId', protocols.protocolByID);
};
