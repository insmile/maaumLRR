'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users.server.controller');
    var centers = require('../../app/controllers/centers.server.controller.js');

    // Progressnotes Routes
    app.route('/centers')
        .get(centers.list)
        .post(centers.create);

    app.route('/centers/DT')
        .get(centers.DT);

    app.route('/centers/insert')
        .post(centers.create);

    app.route('/centers/:centerId')
        .get(users.requiresLogin, centers.read)
        .put(users.requiresLogin, centers.hasAuthorization, centers.update)
        .post(users.requiresLogin, centers.hasAuthorization, centers.update)
        .delete(users.requiresLogin, centers.hasAuthorization, centers.delete);

    // Finish by binding the Center middleware
    app.param('centerId', centers.centerByID);
};