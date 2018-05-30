'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Officialtesttemplate = mongoose.model('Officialtesttemplate'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, officialtesttemplate;

/**
 * Officialtesttemplate routes tests
 */
describe('Officialtesttemplate CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Officialtesttemplate
		user.save(function() {
			officialtesttemplate = {
				name: 'Officialtesttemplate Name'
			};

			done();
		});
	});

	it('should be able to save Officialtesttemplate instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Officialtesttemplate
				agent.post('/officialtesttemplates')
					.send(officialtesttemplate)
					.expect(200)
					.end(function(officialtesttemplateSaveErr, officialtesttemplateSaveRes) {
						// Handle Officialtesttemplate save error
						if (officialtesttemplateSaveErr) done(officialtesttemplateSaveErr);

						// Get a list of Officialtesttemplates
						agent.get('/officialtesttemplates')
							.end(function(officialtesttemplatesGetErr, officialtesttemplatesGetRes) {
								// Handle Officialtesttemplate save error
								if (officialtesttemplatesGetErr) done(officialtesttemplatesGetErr);

								// Get Officialtesttemplates list
								var officialtesttemplates = officialtesttemplatesGetRes.body;

								// Set assertions
								(officialtesttemplates[0].user._id).should.equal(userId);
								(officialtesttemplates[0].name).should.match('Officialtesttemplate Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Officialtesttemplate instance if not logged in', function(done) {
		agent.post('/officialtesttemplates')
			.send(officialtesttemplate)
			.expect(401)
			.end(function(officialtesttemplateSaveErr, officialtesttemplateSaveRes) {
				// Call the assertion callback
				done(officialtesttemplateSaveErr);
			});
	});

	it('should not be able to save Officialtesttemplate instance if no name is provided', function(done) {
		// Invalidate name field
		officialtesttemplate.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Officialtesttemplate
				agent.post('/officialtesttemplates')
					.send(officialtesttemplate)
					.expect(400)
					.end(function(officialtesttemplateSaveErr, officialtesttemplateSaveRes) {
						// Set message assertion
						(officialtesttemplateSaveRes.body.message).should.match('Please fill Officialtesttemplate name');
						
						// Handle Officialtesttemplate save error
						done(officialtesttemplateSaveErr);
					});
			});
	});

	it('should be able to update Officialtesttemplate instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Officialtesttemplate
				agent.post('/officialtesttemplates')
					.send(officialtesttemplate)
					.expect(200)
					.end(function(officialtesttemplateSaveErr, officialtesttemplateSaveRes) {
						// Handle Officialtesttemplate save error
						if (officialtesttemplateSaveErr) done(officialtesttemplateSaveErr);

						// Update Officialtesttemplate name
						officialtesttemplate.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Officialtesttemplate
						agent.put('/officialtesttemplates/' + officialtesttemplateSaveRes.body._id)
							.send(officialtesttemplate)
							.expect(200)
							.end(function(officialtesttemplateUpdateErr, officialtesttemplateUpdateRes) {
								// Handle Officialtesttemplate update error
								if (officialtesttemplateUpdateErr) done(officialtesttemplateUpdateErr);

								// Set assertions
								(officialtesttemplateUpdateRes.body._id).should.equal(officialtesttemplateSaveRes.body._id);
								(officialtesttemplateUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Officialtesttemplates if not signed in', function(done) {
		// Create new Officialtesttemplate model instance
		var officialtesttemplateObj = new Officialtesttemplate(officialtesttemplate);

		// Save the Officialtesttemplate
		officialtesttemplateObj.save(function() {
			// Request Officialtesttemplates
			request(app).get('/officialtesttemplates')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Officialtesttemplate if not signed in', function(done) {
		// Create new Officialtesttemplate model instance
		var officialtesttemplateObj = new Officialtesttemplate(officialtesttemplate);

		// Save the Officialtesttemplate
		officialtesttemplateObj.save(function() {
			request(app).get('/officialtesttemplates/' + officialtesttemplateObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', officialtesttemplate.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Officialtesttemplate instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Officialtesttemplate
				agent.post('/officialtesttemplates')
					.send(officialtesttemplate)
					.expect(200)
					.end(function(officialtesttemplateSaveErr, officialtesttemplateSaveRes) {
						// Handle Officialtesttemplate save error
						if (officialtesttemplateSaveErr) done(officialtesttemplateSaveErr);

						// Delete existing Officialtesttemplate
						agent.delete('/officialtesttemplates/' + officialtesttemplateSaveRes.body._id)
							.send(officialtesttemplate)
							.expect(200)
							.end(function(officialtesttemplateDeleteErr, officialtesttemplateDeleteRes) {
								// Handle Officialtesttemplate error error
								if (officialtesttemplateDeleteErr) done(officialtesttemplateDeleteErr);

								// Set assertions
								(officialtesttemplateDeleteRes.body._id).should.equal(officialtesttemplateSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Officialtesttemplate instance if not signed in', function(done) {
		// Set Officialtesttemplate user 
		officialtesttemplate.user = user;

		// Create new Officialtesttemplate model instance
		var officialtesttemplateObj = new Officialtesttemplate(officialtesttemplate);

		// Save the Officialtesttemplate
		officialtesttemplateObj.save(function() {
			// Try deleting Officialtesttemplate
			request(app).delete('/officialtesttemplates/' + officialtesttemplateObj._id)
			.expect(401)
			.end(function(officialtesttemplateDeleteErr, officialtesttemplateDeleteRes) {
				// Set message assertion
				(officialtesttemplateDeleteRes.body.message).should.match('User is not logged in');

				// Handle Officialtesttemplate error error
				done(officialtesttemplateDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Officialtesttemplate.remove().exec();
		done();
	});
});