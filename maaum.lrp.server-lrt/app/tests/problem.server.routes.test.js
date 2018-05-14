'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Problem = mongoose.model('Problem'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, problem;

/**
 * Problem routes tests
 */
describe('Problem CRUD tests', function() {
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

		// Save a user to the test db and create new Problem
		user.save(function() {
			problem = {
				name: 'Problem Name'
			};

			done();
		});
	});

	it('should be able to save Problem instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Problem
				agent.post('/problems')
					.send(problem)
					.expect(200)
					.end(function(problemSaveErr, problemSaveRes) {
						// Handle Problem save error
						if (problemSaveErr) done(problemSaveErr);

						// Get a list of Problems
						agent.get('/problems')
							.end(function(problemsGetErr, problemsGetRes) {
								// Handle Problem save error
								if (problemsGetErr) done(problemsGetErr);

								// Get Problems list
								var problems = problemsGetRes.body;

								// Set assertions
								(problems[0].user._id).should.equal(userId);
								(problems[0].name).should.match('Problem Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Problem instance if not logged in', function(done) {
		agent.post('/problems')
			.send(problem)
			.expect(401)
			.end(function(problemSaveErr, problemSaveRes) {
				// Call the assertion callback
				done(problemSaveErr);
			});
	});

	it('should not be able to save Problem instance if no name is provided', function(done) {
		// Invalidate name field
		problem.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Problem
				agent.post('/problems')
					.send(problem)
					.expect(400)
					.end(function(problemSaveErr, problemSaveRes) {
						// Set message assertion
						(problemSaveRes.body.message).should.match('Please fill Problem name');
						
						// Handle Problem save error
						done(problemSaveErr);
					});
			});
	});

	it('should be able to update Problem instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Problem
				agent.post('/problems')
					.send(problem)
					.expect(200)
					.end(function(problemSaveErr, problemSaveRes) {
						// Handle Problem save error
						if (problemSaveErr) done(problemSaveErr);

						// Update Problem name
						problem.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Problem
						agent.put('/problems/' + problemSaveRes.body._id)
							.send(problem)
							.expect(200)
							.end(function(problemUpdateErr, problemUpdateRes) {
								// Handle Problem update error
								if (problemUpdateErr) done(problemUpdateErr);

								// Set assertions
								(problemUpdateRes.body._id).should.equal(problemSaveRes.body._id);
								(problemUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Problems if not signed in', function(done) {
		// Create new Problem model instance
		var problemObj = new Problem(problem);

		// Save the Problem
		problemObj.save(function() {
			// Request Problems
			request(app).get('/problems')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Problem if not signed in', function(done) {
		// Create new Problem model instance
		var problemObj = new Problem(problem);

		// Save the Problem
		problemObj.save(function() {
			request(app).get('/problems/' + problemObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', problem.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Problem instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Problem
				agent.post('/problems')
					.send(problem)
					.expect(200)
					.end(function(problemSaveErr, problemSaveRes) {
						// Handle Problem save error
						if (problemSaveErr) done(problemSaveErr);

						// Delete existing Problem
						agent.delete('/problems/' + problemSaveRes.body._id)
							.send(problem)
							.expect(200)
							.end(function(problemDeleteErr, problemDeleteRes) {
								// Handle Problem error error
								if (problemDeleteErr) done(problemDeleteErr);

								// Set assertions
								(problemDeleteRes.body._id).should.equal(problemSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Problem instance if not signed in', function(done) {
		// Set Problem user 
		problem.user = user;

		// Create new Problem model instance
		var problemObj = new Problem(problem);

		// Save the Problem
		problemObj.save(function() {
			// Try deleting Problem
			request(app).delete('/problems/' + problemObj._id)
			.expect(401)
			.end(function(problemDeleteErr, problemDeleteRes) {
				// Set message assertion
				(problemDeleteRes.body.message).should.match('User is not logged in');

				// Handle Problem error error
				done(problemDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Problem.remove().exec();
		done();
	});
});