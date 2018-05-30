'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var progressnotes = require('../../app/controllers/progressnotes.server.controller');

	// Progressnotes Routes
	app.route('/progressNotes')
		.get(progressnotes.list)
		.post(users.requiresLogin, progressnotes.create);

    app.route('/progressNotes/list/:patientID')
        .get(users.getProgressNotes);
    app.route('/progressNotes/insert')
        .post(users.requiresLogin, progressnotes.create);

	app.route('/progressNotes/:progressNoteID')
		.get(progressnotes.read)
		.put(users.requiresLogin, progressnotes.hasAuthorization, progressnotes.update)
        .post(users.requiresLogin, progressnotes.hasAuthorization, progressnotes.update)
		.delete(users.requiresLogin, progressnotes.hasAuthorization, progressnotes.delete);

	// Finish by binding the Progressnote middleware
	app.param('progressNoteID', progressnotes.progressnoteByID);
    app.param('patientID', users.userByID);
};
