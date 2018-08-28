'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Protocol = mongoose.model('Protocol'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, protocol;

/**
 * Protocol routes tests
 */
describe('Protocol CRUD tests', function() {
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

		// Save a user to the test db and create new Protocol
		user.save(function() {
			protocol = {
				name: 'Protocol Name'
			};

			done();
		});
	});

	it('should be able to save Protocol instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Protocol
				agent.post('/protocols')
					.send(protocol)
					.expect(200)
					.end(function(protocolSaveErr, protocolSaveRes) {
						// Handle Protocol save error
						if (protocolSaveErr) done(protocolSaveErr);

						// Get a list of Protocols
						agent.get('/protocols')
							.end(function(protocolsGetErr, protocolsGetRes) {
								// Handle Protocol save error
								if (protocolsGetErr) done(protocolsGetErr);

								// Get Protocols list
								var protocols = protocolsGetRes.body;

								// Set assertions
								(protocols[0].user._id).should.equal(userId);
								(protocols[0].name).should.match('Protocol Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Protocol instance if not logged in', function(done) {
		agent.post('/protocols')
			.send(protocol)
			.expect(401)
			.end(function(protocolSaveErr, protocolSaveRes) {
				// Call the assertion callback
				done(protocolSaveErr);
			});
	});

	it('should not be able to save Protocol instance if no name is provided', function(done) {
		// Invalidate name field
		protocol.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Protocol
				agent.post('/protocols')
					.send(protocol)
					.expect(400)
					.end(function(protocolSaveErr, protocolSaveRes) {
						// Set message assertion
						(protocolSaveRes.body.message).should.match('Please fill Protocol name');
						
						// Handle Protocol save error
						done(protocolSaveErr);
					});
			});
	});

	it('should be able to update Protocol instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Protocol
				agent.post('/protocols')
					.send(protocol)
					.expect(200)
					.end(function(protocolSaveErr, protocolSaveRes) {
						// Handle Protocol save error
						if (protocolSaveErr) done(protocolSaveErr);

						// Update Protocol name
						protocol.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Protocol
						agent.put('/protocols/' + protocolSaveRes.body._id)
							.send(protocol)
							.expect(200)
							.end(function(protocolUpdateErr, protocolUpdateRes) {
								// Handle Protocol update error
								if (protocolUpdateErr) done(protocolUpdateErr);

								// Set assertions
								(protocolUpdateRes.body._id).should.equal(protocolSaveRes.body._id);
								(protocolUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Protocols if not signed in', function(done) {
		// Create new Protocol model instance
		var protocolObj = new Protocol(protocol);

		// Save the Protocol
		protocolObj.save(function() {
			// Request Protocols
			request(app).get('/protocols')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Protocol if not signed in', function(done) {
		// Create new Protocol model instance
		var protocolObj = new Protocol(protocol);

		// Save the Protocol
		protocolObj.save(function() {
			request(app).get('/protocols/' + protocolObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', protocol.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Protocol instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Protocol
				agent.post('/protocols')
					.send(protocol)
					.expect(200)
					.end(function(protocolSaveErr, protocolSaveRes) {
						// Handle Protocol save error
						if (protocolSaveErr) done(protocolSaveErr);

						// Delete existing Protocol
						agent.delete('/protocols/' + protocolSaveRes.body._id)
							.send(protocol)
							.expect(200)
							.end(function(protocolDeleteErr, protocolDeleteRes) {
								// Handle Protocol error error
								if (protocolDeleteErr) done(protocolDeleteErr);

								// Set assertions
								(protocolDeleteRes.body._id).should.equal(protocolSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Protocol instance if not signed in', function(done) {
		// Set Protocol user 
		protocol.user = user;

		// Create new Protocol model instance
		var protocolObj = new Protocol(protocol);

		// Save the Protocol
		protocolObj.save(function() {
			// Try deleting Protocol
			request(app).delete('/protocols/' + protocolObj._id)
			.expect(401)
			.end(function(protocolDeleteErr, protocolDeleteRes) {
				// Set message assertion
				(protocolDeleteRes.body.message).should.match('User is not logged in');

				// Handle Protocol error error
				done(protocolDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Protocol.remove().exec();
		done();
	});
});