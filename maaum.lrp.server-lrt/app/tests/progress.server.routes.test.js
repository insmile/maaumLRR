'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Progress = mongoose.model('Progress'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, progress;

/**
 * Progress routes tests
 */
describe('Progress CRUD tests', function() {
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

		// Save a user to the test db and create new Progress
		user.save(function() {
			progress = {
				name: 'Progress Name'
			};

			done();
		});
	});

	it('should be able to save Progress instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Progress
				agent.post('/progresses')
					.send(progress)
					.expect(200)
					.end(function(progressSaveErr, progressSaveRes) {
						// Handle Progress save error
						if (progressSaveErr) done(progressSaveErr);

						// Get a list of Progresses
						agent.get('/progresses')
							.end(function(progressesGetErr, progressesGetRes) {
								// Handle Progress save error
								if (progressesGetErr) done(progressesGetErr);

								// Get Progresses list
								var progresses = progressesGetRes.body;

								// Set assertions
								(progresses[0].user._id).should.equal(userId);
								(progresses[0].name).should.match('Progress Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Progress instance if not logged in', function(done) {
		agent.post('/progresses')
			.send(progress)
			.expect(401)
			.end(function(progressSaveErr, progressSaveRes) {
				// Call the assertion callback
				done(progressSaveErr);
			});
	});

	it('should not be able to save Progress instance if no name is provided', function(done) {
		// Invalidate name field
		progress.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Progress
				agent.post('/progresses')
					.send(progress)
					.expect(400)
					.end(function(progressSaveErr, progressSaveRes) {
						// Set message assertion
						(progressSaveRes.body.message).should.match('Please fill Progress name');
						
						// Handle Progress save error
						done(progressSaveErr);
					});
			});
	});

	it('should be able to update Progress instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Progress
				agent.post('/progresses')
					.send(progress)
					.expect(200)
					.end(function(progressSaveErr, progressSaveRes) {
						// Handle Progress save error
						if (progressSaveErr) done(progressSaveErr);

						// Update Progress name
						progress.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Progress
						agent.put('/progresses/' + progressSaveRes.body._id)
							.send(progress)
							.expect(200)
							.end(function(progressUpdateErr, progressUpdateRes) {
								// Handle Progress update error
								if (progressUpdateErr) done(progressUpdateErr);

								// Set assertions
								(progressUpdateRes.body._id).should.equal(progressSaveRes.body._id);
								(progressUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Progresses if not signed in', function(done) {
		// Create new Progress model instance
		var progressObj = new Progress(progress);

		// Save the Progress
		progressObj.save(function() {
			// Request Progresses
			request(app).get('/progresses')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Progress if not signed in', function(done) {
		// Create new Progress model instance
		var progressObj = new Progress(progress);

		// Save the Progress
		progressObj.save(function() {
			request(app).get('/progresses/' + progressObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', progress.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Progress instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Progress
				agent.post('/progresses')
					.send(progress)
					.expect(200)
					.end(function(progressSaveErr, progressSaveRes) {
						// Handle Progress save error
						if (progressSaveErr) done(progressSaveErr);

						// Delete existing Progress
						agent.delete('/progresses/' + progressSaveRes.body._id)
							.send(progress)
							.expect(200)
							.end(function(progressDeleteErr, progressDeleteRes) {
								// Handle Progress error error
								if (progressDeleteErr) done(progressDeleteErr);

								// Set assertions
								(progressDeleteRes.body._id).should.equal(progressSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Progress instance if not signed in', function(done) {
		// Set Progress user 
		progress.user = user;

		// Create new Progress model instance
		var progressObj = new Progress(progress);

		// Save the Progress
		progressObj.save(function() {
			// Try deleting Progress
			request(app).delete('/progresses/' + progressObj._id)
			.expect(401)
			.end(function(progressDeleteErr, progressDeleteRes) {
				// Set message assertion
				(progressDeleteRes.body.message).should.match('User is not logged in');

				// Handle Progress error error
				done(progressDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Progress.remove().exec();
		done();
	});
});