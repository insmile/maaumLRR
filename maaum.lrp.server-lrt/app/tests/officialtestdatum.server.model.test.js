'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Officialtestdatum = mongoose.model('Officialtestdatum');

/**
 * Globals
 */
var user, officialtestdatum;

/**
 * Unit tests
 */
describe('Officialtestdatum Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			officialtestdatum = new Officialtestdatum({
				name: 'Officialtestdatum Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return officialtestdatum.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			officialtestdatum.name = '';

			return officialtestdatum.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Officialtestdatum.remove().exec();
		User.remove().exec();

		done();
	});
});