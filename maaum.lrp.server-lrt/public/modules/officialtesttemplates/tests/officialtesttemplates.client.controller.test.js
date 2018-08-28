'use strict';

(function() {
	// Officialtesttemplates Controller Spec
	describe('Officialtesttemplates Controller Tests', function() {
		// Initialize global variables
		var OfficialtesttemplatesController,
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

			// Initialize the Officialtesttemplates controller.
			OfficialtesttemplatesController = $controller('OfficialtesttemplatesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Officialtesttemplate object fetched from XHR', inject(function(Officialtesttemplates) {
			// Create sample Officialtesttemplate using the Officialtesttemplates service
			var sampleOfficialtesttemplate = new Officialtesttemplates({
				name: 'New Officialtesttemplate'
			});

			// Create a sample Officialtesttemplates array that includes the new Officialtesttemplate
			var sampleOfficialtesttemplates = [sampleOfficialtesttemplate];

			// Set GET response
			$httpBackend.expectGET('officialtesttemplates').respond(sampleOfficialtesttemplates);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.officialtesttemplates).toEqualData(sampleOfficialtesttemplates);
		}));

		it('$scope.findOne() should create an array with one Officialtesttemplate object fetched from XHR using a officialtesttemplateId URL parameter', inject(function(Officialtesttemplates) {
			// Define a sample Officialtesttemplate object
			var sampleOfficialtesttemplate = new Officialtesttemplates({
				name: 'New Officialtesttemplate'
			});

			// Set the URL parameter
			$stateParams.officialtesttemplateId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/officialtesttemplates\/([0-9a-fA-F]{24})$/).respond(sampleOfficialtesttemplate);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.officialtesttemplate).toEqualData(sampleOfficialtesttemplate);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Officialtesttemplates) {
			// Create a sample Officialtesttemplate object
			var sampleOfficialtesttemplatePostData = new Officialtesttemplates({
				name: 'New Officialtesttemplate'
			});

			// Create a sample Officialtesttemplate response
			var sampleOfficialtesttemplateResponse = new Officialtesttemplates({
				_id: '525cf20451979dea2c000001',
				name: 'New Officialtesttemplate'
			});

			// Fixture mock form input values
			scope.name = 'New Officialtesttemplate';

			// Set POST response
			$httpBackend.expectPOST('officialtesttemplates', sampleOfficialtesttemplatePostData).respond(sampleOfficialtesttemplateResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Officialtesttemplate was created
			expect($location.path()).toBe('/officialtesttemplates/' + sampleOfficialtesttemplateResponse._id);
		}));

		it('$scope.update() should update a valid Officialtesttemplate', inject(function(Officialtesttemplates) {
			// Define a sample Officialtesttemplate put data
			var sampleOfficialtesttemplatePutData = new Officialtesttemplates({
				_id: '525cf20451979dea2c000001',
				name: 'New Officialtesttemplate'
			});

			// Mock Officialtesttemplate in scope
			scope.officialtesttemplate = sampleOfficialtesttemplatePutData;

			// Set PUT response
			$httpBackend.expectPUT(/officialtesttemplates\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/officialtesttemplates/' + sampleOfficialtesttemplatePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid officialtesttemplateId and remove the Officialtesttemplate from the scope', inject(function(Officialtesttemplates) {
			// Create new Officialtesttemplate object
			var sampleOfficialtesttemplate = new Officialtesttemplates({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Officialtesttemplates array and include the Officialtesttemplate
			scope.officialtesttemplates = [sampleOfficialtesttemplate];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/officialtesttemplates\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleOfficialtesttemplate);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.officialtesttemplates.length).toBe(0);
		}));
	});
}());