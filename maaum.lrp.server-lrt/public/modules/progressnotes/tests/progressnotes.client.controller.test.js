'use strict';

(function() {
	// Progressnotes Controller Spec
	describe('Progressnotes Controller Tests', function() {
		// Initialize global variables
		var ProgressnotesController,
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

			// Initialize the Progressnotes controller.
			ProgressnotesController = $controller('ProgressnotesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Progressnote object fetched from XHR', inject(function(Progressnotes) {
			// Create sample Progressnote using the Progressnotes service
			var sampleProgressnote = new Progressnotes({
				name: 'New Progressnote'
			});

			// Create a sample Progressnotes array that includes the new Progressnote
			var sampleProgressnotes = [sampleProgressnote];

			// Set GET response
			$httpBackend.expectGET('progressnotes').respond(sampleProgressnotes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.progressnotes).toEqualData(sampleProgressnotes);
		}));

		it('$scope.findOne() should create an array with one Progressnote object fetched from XHR using a progressnoteId URL parameter', inject(function(Progressnotes) {
			// Define a sample Progressnote object
			var sampleProgressnote = new Progressnotes({
				name: 'New Progressnote'
			});

			// Set the URL parameter
			$stateParams.progressnoteId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/progressnotes\/([0-9a-fA-F]{24})$/).respond(sampleProgressnote);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.progressnote).toEqualData(sampleProgressnote);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Progressnotes) {
			// Create a sample Progressnote object
			var sampleProgressnotePostData = new Progressnotes({
				name: 'New Progressnote'
			});

			// Create a sample Progressnote response
			var sampleProgressnoteResponse = new Progressnotes({
				_id: '525cf20451979dea2c000001',
				name: 'New Progressnote'
			});

			// Fixture mock form input values
			scope.name = 'New Progressnote';

			// Set POST response
			$httpBackend.expectPOST('progressnotes', sampleProgressnotePostData).respond(sampleProgressnoteResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Progressnote was created
			expect($location.path()).toBe('/progressnotes/' + sampleProgressnoteResponse._id);
		}));

		it('$scope.update() should update a valid Progressnote', inject(function(Progressnotes) {
			// Define a sample Progressnote put data
			var sampleProgressnotePutData = new Progressnotes({
				_id: '525cf20451979dea2c000001',
				name: 'New Progressnote'
			});

			// Mock Progressnote in scope
			scope.progressnote = sampleProgressnotePutData;

			// Set PUT response
			$httpBackend.expectPUT(/progressnotes\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/progressnotes/' + sampleProgressnotePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid progressnoteId and remove the Progressnote from the scope', inject(function(Progressnotes) {
			// Create new Progressnote object
			var sampleProgressnote = new Progressnotes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Progressnotes array and include the Progressnote
			scope.progressnotes = [sampleProgressnote];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/progressnotes\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleProgressnote);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.progressnotes.length).toBe(0);
		}));
	});
}());