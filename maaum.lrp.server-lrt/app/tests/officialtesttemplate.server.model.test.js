'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Officialtesttemplate = mongoose.model('Officialtesttemplate');

/**
 * Globals
 */
var user, officialtesttemplate;

/**
 * Unit tests
 */
describe('Officialtesttemplate Model Unit Tests:', function() {
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
			officialtesttemplate = new Officialtesttemplate({
				name: 'Officialtesttemplate Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return officialtesttemplate.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			officialtesttemplate.name = '';

			return officialtesttemplate.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Officialtesttemplate.remove().exec();
		User.remove().exec();

		done();
	});
});