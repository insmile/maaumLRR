'use strict';

(function() {
	// Problems Controller Spec
	describe('Problems Controller Tests', function() {
		// Initialize global variables
		var ProblemsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Problems controller.
			ProblemsController = $controller('ProblemsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Problem object fetched from XHR', inject(function(Problems) {
			// Create sample Problem using the Problems service
			var sampleProblem = new Problems({
				name: 'New Problem'
			});

			// Create a sample Problems array that includes the new Problem
			var sampleProblems = [sampleProblem];

			// Set GET response
			$httpBackend.expectGET('problems').respond(sampleProblems);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.problems).toEqualData(sampleProblems);
		}));

		it('$scope.findOne() should create an array with one Problem object fetched from XHR using a problemId URL parameter', inject(function(Problems) {
			// Define a sample Problem object
			var sampleProblem = new Problems({
				name: 'New Problem'
			});

			// Set the URL parameter
			$stateParams.problemId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/problems\/([0-9a-fA-F]{24})$/).respond(sampleProblem);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.problem).toEqualData(sampleProblem);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Problems) {
			// Create a sample Problem object
			var sampleProblemPostData = new Problems({
				name: 'New Problem'
			});

			// Create a sample Problem response
			var sampleProblemResponse = new Problems({
				_id: '525cf20451979dea2c000001',
				name: 'New Problem'
			});

			// Fixture mock form input values
			scope.name = 'New Problem';

			// Set POST response
			$httpBackend.expectPOST('problems', sampleProblemPostData).respond(sampleProblemResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Problem was created
			expect($location.path()).toBe('/problems/' + sampleProblemResponse._id);
		}));

		it('$scope.update() should update a valid Problem', inject(function(Problems) {
			// Define a sample Problem put data
			var sampleProblemPutData = new Problems({
				_id: '525cf20451979dea2c000001',
				name: 'New Problem'
			});

			// Mock Problem in scope
			scope.problem = sampleProblemPutData;

			// Set PUT response
			$httpBackend.expectPUT(/problems\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/problems/' + sampleProblemPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid problemId and remove the Problem from the scope', inject(function(Problems) {
			// Create new Problem object
			var sampleProblem = new Problems({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Problems array and include the Problem
			scope.problems = [sampleProblem];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/problems\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleProblem);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.problems.length).toBe(0);
		}));
	});
}());