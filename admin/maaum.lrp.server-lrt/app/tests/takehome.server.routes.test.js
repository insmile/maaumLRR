'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Takehome = mongoose.model('Takehome'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, takehome;

/**
 * Takehome routes tests
 */
describe('Takehome CRUD tests', function() {
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

		// Save a user to the test db and create new Takehome
		user.save(function() {
			takehome = {
				name: 'Takehome Name'
			};

			done();
		});
	});

	it('should be able to save Takehome instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Takehome
				agent.post('/takehomes')
					.send(takehome)
					.expect(200)
					.end(function(takehomeSaveErr, takehomeSaveRes) {
						// Handle Takehome save error
						if (takehomeSaveErr) done(takehomeSaveErr);

						// Get a list of Takehomes
						agent.get('/takehomes')
							.end(function(takehomesGetErr, takehomesGetRes) {
								// Handle Takehome save error
								if (takehomesGetErr) done(takehomesGetErr);

								// Get Takehomes list
								var takehomes = takehomesGetRes.body;

								// Set assertions
								(takehomes[0].user._id).should.equal(userId);
								(takehomes[0].name).should.match('Takehome Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Takehome instance if not logged in', function(done) {
		agent.post('/takehomes')
			.send(takehome)
			.expect(401)
			.end(function(takehomeSaveErr, takehomeSaveRes) {
				// Call the assertion callback
				done(takehomeSaveErr);
			});
	});

	it('should not be able to save Takehome instance if no name is provided', function(done) {
		// Invalidate name field
		takehome.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Takehome
				agent.post('/takehomes')
					.send(takehome)
					.expect(400)
					.end(function(takehomeSaveErr, takehomeSaveRes) {
						// Set message assertion
						(takehomeSaveRes.body.message).should.match('Please fill Takehome name');
						
						// Handle Takehome save error
						done(takehomeSaveErr);
					});
			});
	});

	it('should be able to update Takehome instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Takehome
				agent.post('/takehomes')
					.send(takehome)
					.expect(200)
					.end(function(takehomeSaveErr, takehomeSaveRes) {
						// Handle Takehome save error
						if (takehomeSaveErr) done(takehomeSaveErr);

						// Update Takehome name
						takehome.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Takehome
						agent.put('/takehomes/' + takehomeSaveRes.body._id)
							.send(takehome)
							.expect(200)
							.end(function(takehomeUpdateErr, takehomeUpdateRes) {
								// Handle Takehome update error
								if (takehomeUpdateErr) done(takehomeUpdateErr);

								// Set assertions
								(takehomeUpdateRes.body._id).should.equal(takehomeSaveRes.body._id);
								(takehomeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Takehomes if not signed in', function(done) {
		// Create new Takehome model instance
		var takehomeObj = new Takehome(takehome);

		// Save the Takehome
		takehomeObj.save(function() {
			// Request Takehomes
			request(app).get('/takehomes')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Takehome if not signed in', function(done) {
		// Create new Takehome model instance
		var takehomeObj = new Takehome(takehome);

		// Save the Takehome
		takehomeObj.save(function() {
			request(app).get('/takehomes/' + takehomeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', takehome.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Takehome instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Takehome
				agent.post('/takehomes')
					.send(takehome)
					.expect(200)
					.end(function(takehomeSaveErr, takehomeSaveRes) {
						// Handle Takehome save error
						if (takehomeSaveErr) done(takehomeSaveErr);

						// Delete existing Takehome
						agent.delete('/takehomes/' + takehomeSaveRes.body._id)
							.send(takehome)
							.expect(200)
							.end(function(takehomeDeleteErr, takehomeDeleteRes) {
								// Handle Takehome error error
								if (takehomeDeleteErr) done(takehomeDeleteErr);

								// Set assertions
								(takehomeDeleteRes.body._id).should.equal(takehomeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Takehome instance if not signed in', function(done) {
		// Set Takehome user 
		takehome.user = user;

		// Create new Takehome model instance
		var takehomeObj = new Takehome(takehome);

		// Save the Takehome
		takehomeObj.save(function() {
			// Try deleting Takehome
			request(app).delete('/takehomes/' + takehomeObj._id)
			.expect(401)
			.end(function(takehomeDeleteErr, takehomeDeleteRes) {
				// Set message assertion
				(takehomeDeleteRes.body.message).should.match('User is not logged in');

				// Handle Takehome error error
				done(takehomeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Takehome.remove().exec();
		done();
	});
});