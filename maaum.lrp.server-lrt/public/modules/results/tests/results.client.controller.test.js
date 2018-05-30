'use strict';

(function() {
	// Results Controller Spec
	describe('Results Controller Tests', function() {
		// Initialize global variables
		var ResultsController,
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

			// Initialize the Results controller.
			ResultsController = $controller('ResultsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Result object fetched from XHR', inject(function(Results) {
			// Create sample Result using the Results service
			var sampleResult = new Results({
				name: 'New Result'
			});

			// Create a sample Results array that includes the new Result
			var sampleResults = [sampleResult];

			// Set GET response
			$httpBackend.expectGET('results').respond(sampleResults);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.results).toEqualData(sampleResults);
		}));

		it('$scope.findOne() should create an array with one Result object fetched from XHR using a resultId URL parameter', inject(function(Results) {
			// Define a sample Result object
			var sampleResult = new Results({
				name: 'New Result'
			});

			// Set the URL parameter
			$stateParams.resultId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/results\/([0-9a-fA-F]{24})$/).respond(sampleResult);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.result).toEqualData(sampleResult);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Results) {
			// Create a sample Result object
			var sampleResultPostData = new Results({
				name: 'New Result'
			});

			// Create a sample Result response
			var sampleResultResponse = new Results({
				_id: '525cf20451979dea2c000001',
				name: 'New Result'
			});

			// Fixture mock form input values
			scope.name = 'New Result';

			// Set POST response
			$httpBackend.expectPOST('results', sampleResultPostData).respond(sampleResultResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Result was created
			expect($location.path()).toBe('/results/' + sampleResultResponse._id);
		}));

		it('$scope.update() should update a valid Result', inject(function(Results) {
			// Define a sample Result put data
			var sampleResultPutData = new Results({
				_id: '525cf20451979dea2c000001',
				name: 'New Result'
			});

			// Mock Result in scope
			scope.result = sampleResultPutData;

			// Set PUT response
			$httpBackend.expectPUT(/results\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/results/' + sampleResultPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid resultId and remove the Result from the scope', inject(function(Results) {
			// Create new Result object
			var sampleResult = new Results({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Results array and include the Result
			scope.results = [sampleResult];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/results\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleResult);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.results.length).toBe(0);
		}));
	});
}());