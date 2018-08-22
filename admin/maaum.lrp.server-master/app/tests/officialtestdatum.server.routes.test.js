'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Officialtestdatum = mongoose.model('Officialtestdatum'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, officialtestdatum;

/**
 * Officialtestdatum routes tests
 */
describe('Officialtestdatum CRUD tests', function() {
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

		// Save a user to the test db and create new Officialtestdatum
		user.save(function() {
			officialtestdatum = {
				name: 'Officialtestdatum Name'
			};

			done();
		});
	});

	it('should be able to save Officialtestdatum instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Officialtestdatum
				agent.post('/officialtestdata')
					.send(officialtestdatum)
					.expect(200)
					.end(function(officialtestdatumSaveErr, officialtestdatumSaveRes) {
						// Handle Officialtestdatum save error
						if (officialtestdatumSaveErr) done(officialtestdatumSaveErr);

						// Get a list of Officialtestdata
						agent.get('/officialtestdata')
							.end(function(officialtestdataGetErr, officialtestdataGetRes) {
								// Handle Officialtestdatum save error
								if (officialtestdataGetErr) done(officialtestdataGetErr);

								// Get Officialtestdata list
								var officialtestdata = officialtestdataGetRes.body;

								// Set assertions
								(officialtestdata[0].user._id).should.equal(userId);
								(officialtestdata[0].name).should.match('Officialtestdatum Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Officialtestdatum instance if not logged in', function(done) {
		agent.post('/officialtestdata')
			.send(officialtestdatum)
			.expect(401)
			.end(function(officialtestdatumSaveErr, officialtestdatumSaveRes) {
				// Call the assertion callback
				done(officialtestdatumSaveErr);
			});
	});

	it('should not be able to save Officialtestdatum instance if no name is provided', function(done) {
		// Invalidate name field
		officialtestdatum.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Officialtestdatum
				agent.post('/officialtestdata')
					.send(officialtestdatum)
					.expect(400)
					.end(function(officialtestdatumSaveErr, officialtestdatumSaveRes) {
						// Set message assertion
						(officialtestdatumSaveRes.body.message).should.match('Please fill Officialtestdatum name');
						
						// Handle Officialtestdatum save error
						done(officialtestdatumSaveErr);
					});
			});
	});

	it('should be able to update Officialtestdatum instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Officialtestdatum
				agent.post('/officialtestdata')
					.send(officialtestdatum)
					.expect(200)
					.end(function(officialtestdatumSaveErr, officialtestdatumSaveRes) {
						// Handle Officialtestdatum save error
						if (officialtestdatumSaveErr) done(officialtestdatumSaveErr);

						// Update Officialtestdatum name
						officialtestdatum.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Officialtestdatum
						agent.put('/officialtestdata/' + officialtestdatumSaveRes.body._id)
							.send(officialtestdatum)
							.expect(200)
							.end(function(officialtestdatumUpdateErr, officialtestdatumUpdateRes) {
								// Handle Officialtestdatum update error
								if (officialtestdatumUpdateErr) done(officialtestdatumUpdateErr);

								// Set assertions
								(officialtestdatumUpdateRes.body._id).should.equal(officialtestdatumSaveRes.body._id);
								(officialtestdatumUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Officialtestdata if not signed in', function(done) {
		// Create new Officialtestdatum model instance
		var officialtestdatumObj = new Officialtestdatum(officialtestdatum);

		// Save the Officialtestdatum
		officialtestdatumObj.save(function() {
			// Request Officialtestdata
			request(app).get('/officialtestdata')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Officialtestdatum if not signed in', function(done) {
		// Create new Officialtestdatum model instance
		var officialtestdatumObj = new Officialtestdatum(officialtestdatum);

		// Save the Officialtestdatum
		officialtestdatumObj.save(function() {
			request(app).get('/officialtestdata/' + officialtestdatumObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', officialtestdatum.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Officialtestdatum instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Officialtestdatum
				agent.post('/officialtestdata')
					.send(officialtestdatum)
					.expect(200)
					.end(function(officialtestdatumSaveErr, officialtestdatumSaveRes) {
						// Handle Officialtestdatum save error
						if (officialtestdatumSaveErr) done(officialtestdatumSaveErr);

						// Delete existing Officialtestdatum
						agent.delete('/officialtestdata/' + officialtestdatumSaveRes.body._id)
							.send(officialtestdatum)
							.expect(200)
							.end(function(officialtestdatumDeleteErr, officialtestdatumDeleteRes) {
								// Handle Officialtestdatum error error
								if (officialtestdatumDeleteErr) done(officialtestdatumDeleteErr);

								// Set assertions
								(officialtestdatumDeleteRes.body._id).should.equal(officialtestdatumSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Officialtestdatum instance if not signed in', function(done) {
		// Set Officialtestdatum user 
		officialtestdatum.user = user;

		// Create new Officialtestdatum model instance
		var officialtestdatumObj = new Officialtestdatum(officialtestdatum);

		// Save the Officialtestdatum
		officialtestdatumObj.save(function() {
			// Try deleting Officialtestdatum
			request(app).delete('/officialtestdata/' + officialtestdatumObj._id)
			.expect(401)
			.end(function(officialtestdatumDeleteErr, officialtestdatumDeleteRes) {
				// Set message assertion
				(officialtestdatumDeleteRes.body.message).should.match('User is not logged in');

				// Handle Officialtestdatum error error
				done(officialtestdatumDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Officialtestdatum.remove().exec();
		done();
	});
});