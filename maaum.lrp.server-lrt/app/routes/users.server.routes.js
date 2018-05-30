'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function(app) {
	// User Routes
	var users = require('../../app/controllers/users.server.controller');

	// Setting up the users profile api
	app.route('/users/me').get(users.me);
	app.route('/users').put(users.update);
	app.route('/users/update').post(users.update);
	app.route('/users/accounts').delete(users.removeOAuthProvider);

	app.route('/users/certify').post(users.hasAuthorization(['admin', 'manager', 'doctor']), users.certify);
	app.route('/users/therapist/:userId')
		.get(users.hasAuthorization(['admin', 'manager']), users.getTherapist)
		.put(users.hasAuthorization(['admin', 'manager']), users.update)
		.post(users.hasAuthorization(['admin', 'manager']), users.update)
		.delete(users.hasAuthorization(['admin', 'manager']), users.delete);
	app.route('/users/patient/:userId')
		.get(users.hasAuthorization(['admin', 'therapist', 'manager']), users.getPatient)
		.put(users.hasAuthorization(['admin', 'therapist', 'manager']), users.update)
		.post(users.hasAuthorization(['admin', 'therapist', 'manager']), users.update)
		.delete(users.hasAuthorization(['admin', 'therapist', 'manager']), users.delete);
    app.route('/users/manager/:userId')
        .get(users.hasAuthorization(['admin']), users.getManager)
        .put(users.hasAuthorization(['admin']), users.update)
        .post(users.hasAuthorization(['admin']), users.update)
        .delete(users.hasAuthorization(['admin']), users.delete);

	app.route('/users/hasAdmin').get(users.hasAdmin);

	// Setting up the users password api
	app.route('/users/password').post(users.changePassword);
	app.route('/users/password/:userId').post(users.hasAuthorization(['admin', 'manager']), users.changePasswordByAdmin);
	app.route('/users/role/:userId').post(users.hasAuthorization(['admin', 'manager']), users.changeRoleByAdmin);
	app.route('/auth/forgot').post(users.forgot);
	app.route('/auth/reset/:token').get(users.validateResetToken);
	app.route('/auth/reset/:token').post(users.reset);
	app.route('/auth/adminPasswordReset').get(users.apr);

	// Setting up the users authentication api
	app.route('/auth/signup').post(users.signup);
	app.route('/auth/signin').post(users.signin);
	app.route('/auth/signout').get(users.signout);
	app.route('/auth/removeAdmin').get(users.removeAdmin);

	app.route('/user/datatable').get(users.hasAuthorization(['admin', 'manager', 'doctor']), users.userDT);
	app.route('/therapist/datatable').get(users.hasAuthorization(['admin', 'manager', 'doctor']), users.therapistDT);
	app.route('/therapist/list').get(users.hasAuthorization(['admin', 'manager', 'doctor']), users.therapistList);
	app.route('/patient/datatable').get(users.hasAuthorization(['admin', 'manager', 'therapist', 'doctor']), users.patientDT);
	app.route('/patient/list').get(users.hasAuthorization(['admin', 'manager','therapist', 'doctor']), users.patientList);
	app.route('/patient/list/:therapistId').get(users.hasAuthorization(['admin', 'manager','therapist', 'doctor']), users.patientList);
	app.route('/patient/activate').post(users.hasAuthorization(['admin', 'manager']), users.activation);
	app.route('/patient/assign').post(users.hasAuthorization(['admin', 'manager','therapist', 'doctor']), users.assign);
	app.route('/patient/unassign').post(users.hasAuthorization(['admin', 'manager','therapist', 'doctor']), users.unassign);

	// Setting the facebook oauth routes
	app.route('/auth/facebook').get(passport.authenticate('facebook', {
		scope: ['email']
	}));
	app.route('/auth/facebook/callback').get(users.oauthCallback('facebook'));

	// Setting the twitter oauth routes
	app.route('/auth/twitter').get(passport.authenticate('twitter'));
	app.route('/auth/twitter/callback').get(users.oauthCallback('twitter'));

	// Setting the google oauth routes
	app.route('/auth/google').get(passport.authenticate('google', {
		scope: [
			'https://www.googleapis.com/auth/userinfo.profile',
			'https://www.googleapis.com/auth/userinfo.email'
		]
	}));
	app.route('/auth/google/callback').get(users.oauthCallback('google'));

	// Setting the linkedin oauth routes
	app.route('/auth/linkedin').get(passport.authenticate('linkedin'));
	app.route('/auth/linkedin/callback').get(users.oauthCallback('linkedin'));

	// Setting the github oauth routes
	app.route('/auth/github').get(passport.authenticate('github'));
	app.route('/auth/github/callback').get(users.oauthCallback('github'));

	// Finish by binding the user middleware
	app.param('userId', users.userByID);
};
