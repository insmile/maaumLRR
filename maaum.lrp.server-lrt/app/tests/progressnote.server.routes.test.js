'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Progressnote = mongoose.model('Progressnote'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, progressnote;

/**
 * Progressnote routes tests
 */
describe('Progressnote CRUD tests', function() {
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

		// Save a user to the test db and create new Progressnote
		user.save(function() {
			progressnote = {
				name: 'Progressnote Name'
			};

			done();
		});
	});

	it('should be able to save Progressnote instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Progressnote
				agent.post('/progressnotes')
					.send(progressnote)
					.expect(200)
					.end(function(progressnoteSaveErr, progressnoteSaveRes) {
						// Handle Progressnote save error
						if (progressnoteSaveErr) done(progressnoteSaveErr);

						// Get a list of Progressnotes
						agent.get('/progressnotes')
							.end(function(progressnotesGetErr, progressnotesGetRes) {
								// Handle Progressnote save error
								if (progressnotesGetErr) done(progressnotesGetErr);

								// Get Progressnotes list
								var progressnotes = progressnotesGetRes.body;

								// Set assertions
								(progressnotes[0].user._id).should.equal(userId);
								(progressnotes[0].name).should.match('Progressnote Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Progressnote instance if not logged in', function(done) {
		agent.post('/progressnotes')
			.send(progressnote)
			.expect(401)
			.end(function(progressnoteSaveErr, progressnoteSaveRes) {
				// Call the assertion callback
				done(progressnoteSaveErr);
			});
	});

	it('should not be able to save Progressnote instance if no name is provided', function(done) {
		// Invalidate name field
		progressnote.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Progressnote
				agent.post('/progressnotes')
					.send(progressnote)
					.expect(400)
					.end(function(progressnoteSaveErr, progressnoteSaveRes) {
						// Set message assertion
						(progressnoteSaveRes.body.message).should.match('Please fill Progressnote name');
						
						// Handle Progressnote save error
						done(progressnoteSaveErr);
					});
			});
	});

	it('should be able to update Progressnote instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Progressnote
				agent.post('/progressnotes')
					.send(progressnote)
					.expect(200)
					.end(function(progressnoteSaveErr, progressnoteSaveRes) {
						// Handle Progressnote save error
						if (progressnoteSaveErr) done(progressnoteSaveErr);

						// Update Progressnote name
						progressnote.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Progressnote
						agent.put('/progressnotes/' + progressnoteSaveRes.body._id)
							.send(progressnote)
							.expect(200)
							.end(function(progressnoteUpdateErr, progressnoteUpdateRes) {
								// Handle Progressnote update error
								if (progressnoteUpdateErr) done(progressnoteUpdateErr);

								// Set assertions
								(progressnoteUpdateRes.body._id).should.equal(progressnoteSaveRes.body._id);
								(progressnoteUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Progressnotes if not signed in', function(done) {
		// Create new Progressnote model instance
		var progressnoteObj = new Progressnote(progressnote);

		// Save the Progressnote
		progressnoteObj.save(function() {
			// Request Progressnotes
			request(app).get('/progressnotes')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Progressnote if not signed in', function(done) {
		// Create new Progressnote model instance
		var progressnoteObj = new Progressnote(progressnote);

		// Save the Progressnote
		progressnoteObj.save(function() {
			request(app).get('/progressnotes/' + progressnoteObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', progressnote.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Progressnote instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Progressnote
				agent.post('/progressnotes')
					.send(progressnote)
					.expect(200)
					.end(function(progressnoteSaveErr, progressnoteSaveRes) {
						// Handle Progressnote save error
						if (progressnoteSaveErr) done(progressnoteSaveErr);

						// Delete existing Progressnote
						agent.delete('/progressnotes/' + progressnoteSaveRes.body._id)
							.send(progressnote)
							.expect(200)
							.end(function(progressnoteDeleteErr, progressnoteDeleteRes) {
								// Handle Progressnote error error
								if (progressnoteDeleteErr) done(progressnoteDeleteErr);

								// Set assertions
								(progressnoteDeleteRes.body._id).should.equal(progressnoteSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Progressnote instance if not signed in', function(done) {
		// Set Progressnote user 
		progressnote.user = user;

		// Create new Progressnote model instance
		var progressnoteObj = new Progressnote(progressnote);

		// Save the Progressnote
		progressnoteObj.save(function() {
			// Try deleting Progressnote
			request(app).delete('/progressnotes/' + progressnoteObj._id)
			.expect(401)
			.end(function(progressnoteDeleteErr, progressnoteDeleteRes) {
				// Set message assertion
				(progressnoteDeleteRes.body.message).should.match('User is not logged in');

				// Handle Progressnote error error
				done(progressnoteDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Progressnote.remove().exec();
		done();
	});
});