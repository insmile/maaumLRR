'use strict';

(function() {
	// Takehomes Controller Spec
	describe('Takehomes Controller Tests', function() {
		// Initialize global variables
		var TakehomesController,
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

			// Initialize the Takehomes controller.
			TakehomesController = $controller('TakehomesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Takehome object fetched from XHR', inject(function(Takehomes) {
			// Create sample Takehome using the Takehomes service
			var sampleTakehome = new Takehomes({
				name: 'New Takehome'
			});

			// Create a sample Takehomes array that includes the new Takehome
			var sampleTakehomes = [sampleTakehome];

			// Set GET response
			$httpBackend.expectGET('takehomes').respond(sampleTakehomes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.takehomes).toEqualData(sampleTakehomes);
		}));

		it('$scope.findOne() should create an array with one Takehome object fetched from XHR using a takehomeId URL parameter', inject(function(Takehomes) {
			// Define a sample Takehome object
			var sampleTakehome = new Takehomes({
				name: 'New Takehome'
			});

			// Set the URL parameter
			$stateParams.takehomeId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/takehomes\/([0-9a-fA-F]{24})$/).respond(sampleTakehome);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.takehome).toEqualData(sampleTakehome);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Takehomes) {
			// Create a sample Takehome object
			var sampleTakehomePostData = new Takehomes({
				name: 'New Takehome'
			});

			// Create a sample Takehome response
			var sampleTakehomeResponse = new Takehomes({
				_id: '525cf20451979dea2c000001',
				name: 'New Takehome'
			});

			// Fixture mock form input values
			scope.name = 'New Takehome';

			// Set POST response
			$httpBackend.expectPOST('takehomes', sampleTakehomePostData).respond(sampleTakehomeResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Takehome was created
			expect($location.path()).toBe('/takehomes/' + sampleTakehomeResponse._id);
		}));

		it('$scope.update() should update a valid Takehome', inject(function(Takehomes) {
			// Define a sample Takehome put data
			var sampleTakehomePutData = new Takehomes({
				_id: '525cf20451979dea2c000001',
				name: 'New Takehome'
			});

			// Mock Takehome in scope
			scope.takehome = sampleTakehomePutData;

			// Set PUT response
			$httpBackend.expectPUT(/takehomes\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/takehomes/' + sampleTakehomePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid takehomeId and remove the Takehome from the scope', inject(function(Takehomes) {
			// Create new Takehome object
			var sampleTakehome = new Takehomes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Takehomes array and include the Takehome
			scope.takehomes = [sampleTakehome];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/takehomes\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTakehome);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.takehomes.length).toBe(0);
		}));
	});
}());