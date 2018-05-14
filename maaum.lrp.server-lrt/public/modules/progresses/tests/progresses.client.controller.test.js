'use strict';

(function() {
	// Progresses Controller Spec
	describe('Progresses Controller Tests', function() {
		// Initialize global variables
		var ProgressesController,
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

			// Initialize the Progresses controller.
			ProgressesController = $controller('ProgressesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Progress object fetched from XHR', inject(function(Progresses) {
			// Create sample Progress using the Progresses service
			var sampleProgress = new Progresses({
				name: 'New Progress'
			});

			// Create a sample Progresses array that includes the new Progress
			var sampleProgresses = [sampleProgress];

			// Set GET response
			$httpBackend.expectGET('progresses').respond(sampleProgresses);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.progresses).toEqualData(sampleProgresses);
		}));

		it('$scope.findOne() should create an array with one Progress object fetched from XHR using a progressId URL parameter', inject(function(Progresses) {
			// Define a sample Progress object
			var sampleProgress = new Progresses({
				name: 'New Progress'
			});

			// Set the URL parameter
			$stateParams.progressId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/progresses\/([0-9a-fA-F]{24})$/).respond(sampleProgress);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.progress).toEqualData(sampleProgress);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Progresses) {
			// Create a sample Progress object
			var sampleProgressPostData = new Progresses({
				name: 'New Progress'
			});

			// Create a sample Progress response
			var sampleProgressResponse = new Progresses({
				_id: '525cf20451979dea2c000001',
				name: 'New Progress'
			});

			// Fixture mock form input values
			scope.name = 'New Progress';

			// Set POST response
			$httpBackend.expectPOST('progresses', sampleProgressPostData).respond(sampleProgressResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Progress was created
			expect($location.path()).toBe('/progresses/' + sampleProgressResponse._id);
		}));

		it('$scope.update() should update a valid Progress', inject(function(Progresses) {
			// Define a sample Progress put data
			var sampleProgressPutData = new Progresses({
				_id: '525cf20451979dea2c000001',
				name: 'New Progress'
			});

			// Mock Progress in scope
			scope.progress = sampleProgressPutData;

			// Set PUT response
			$httpBackend.expectPUT(/progresses\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/progresses/' + sampleProgressPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid progressId and remove the Progress from the scope', inject(function(Progresses) {
			// Create new Progress object
			var sampleProgress = new Progresses({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Progresses array and include the Progress
			scope.progresses = [sampleProgress];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/progresses\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleProgress);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.progresses.length).toBe(0);
		}));
	});
}());