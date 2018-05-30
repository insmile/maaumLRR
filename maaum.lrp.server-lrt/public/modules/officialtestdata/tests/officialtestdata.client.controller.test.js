'use strict';

(function() {
	// Officialtestdata Controller Spec
	describe('Officialtestdata Controller Tests', function() {
		// Initialize global variables
		var OfficialtestdataController,
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

			// Initialize the Officialtestdata controller.
			OfficialtestdataController = $controller('OfficialtestdataController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Officialtestdatum object fetched from XHR', inject(function(Officialtestdata) {
			// Create sample Officialtestdatum using the Officialtestdata service
			var sampleOfficialtestdatum = new Officialtestdata({
				name: 'New Officialtestdatum'
			});

			// Create a sample Officialtestdata array that includes the new Officialtestdatum
			var sampleOfficialtestdata = [sampleOfficialtestdatum];

			// Set GET response
			$httpBackend.expectGET('officialtestdata').respond(sampleOfficialtestdata);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.officialtestdata).toEqualData(sampleOfficialtestdata);
		}));

		it('$scope.findOne() should create an array with one Officialtestdatum object fetched from XHR using a officialtestdatumId URL parameter', inject(function(Officialtestdata) {
			// Define a sample Officialtestdatum object
			var sampleOfficialtestdatum = new Officialtestdata({
				name: 'New Officialtestdatum'
			});

			// Set the URL parameter
			$stateParams.officialtestdatumId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/officialtestdata\/([0-9a-fA-F]{24})$/).respond(sampleOfficialtestdatum);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.officialtestdatum).toEqualData(sampleOfficialtestdatum);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Officialtestdata) {
			// Create a sample Officialtestdatum object
			var sampleOfficialtestdatumPostData = new Officialtestdata({
				name: 'New Officialtestdatum'
			});

			// Create a sample Officialtestdatum response
			var sampleOfficialtestdatumResponse = new Officialtestdata({
				_id: '525cf20451979dea2c000001',
				name: 'New Officialtestdatum'
			});

			// Fixture mock form input values
			scope.name = 'New Officialtestdatum';

			// Set POST response
			$httpBackend.expectPOST('officialtestdata', sampleOfficialtestdatumPostData).respond(sampleOfficialtestdatumResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Officialtestdatum was created
			expect($location.path()).toBe('/officialtestdata/' + sampleOfficialtestdatumResponse._id);
		}));

		it('$scope.update() should update a valid Officialtestdatum', inject(function(Officialtestdata) {
			// Define a sample Officialtestdatum put data
			var sampleOfficialtestdatumPutData = new Officialtestdata({
				_id: '525cf20451979dea2c000001',
				name: 'New Officialtestdatum'
			});

			// Mock Officialtestdatum in scope
			scope.officialtestdatum = sampleOfficialtestdatumPutData;

			// Set PUT response
			$httpBackend.expectPUT(/officialtestdata\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/officialtestdata/' + sampleOfficialtestdatumPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid officialtestdatumId and remove the Officialtestdatum from the scope', inject(function(Officialtestdata) {
			// Create new Officialtestdatum object
			var sampleOfficialtestdatum = new Officialtestdata({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Officialtestdata array and include the Officialtestdatum
			scope.officialtestdata = [sampleOfficialtestdatum];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/officialtestdata\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleOfficialtestdatum);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.officialtestdata.length).toBe(0);
		}));
	});
}());