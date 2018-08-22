'use strict';

(function() {
	// Protocols Controller Spec
	describe('Protocols Controller Tests', function() {
		// Initialize global variables
		var ProtocolsController,
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

			// Initialize the Protocols controller.
			ProtocolsController = $controller('ProtocolsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Protocol object fetched from XHR', inject(function(Protocols) {
			// Create sample Protocol using the Protocols service
			var sampleProtocol = new Protocols({
				name: 'New Protocol'
			});

			// Create a sample Protocols array that includes the new Protocol
			var sampleProtocols = [sampleProtocol];

			// Set GET response
			$httpBackend.expectGET('protocols').respond(sampleProtocols);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.protocols).toEqualData(sampleProtocols);
		}));

		it('$scope.findOne() should create an array with one Protocol object fetched from XHR using a protocolId URL parameter', inject(function(Protocols) {
			// Define a sample Protocol object
			var sampleProtocol = new Protocols({
				name: 'New Protocol'
			});

			// Set the URL parameter
			$stateParams.protocolId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/protocols\/([0-9a-fA-F]{24})$/).respond(sampleProtocol);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.protocol).toEqualData(sampleProtocol);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Protocols) {
			// Create a sample Protocol object
			var sampleProtocolPostData = new Protocols({
				name: 'New Protocol'
			});

			// Create a sample Protocol response
			var sampleProtocolResponse = new Protocols({
				_id: '525cf20451979dea2c000001',
				name: 'New Protocol'
			});

			// Fixture mock form input values
			scope.name = 'New Protocol';

			// Set POST response
			$httpBackend.expectPOST('protocols', sampleProtocolPostData).respond(sampleProtocolResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Protocol was created
			expect($location.path()).toBe('/protocols/' + sampleProtocolResponse._id);
		}));

		it('$scope.update() should update a valid Protocol', inject(function(Protocols) {
			// Define a sample Protocol put data
			var sampleProtocolPutData = new Protocols({
				_id: '525cf20451979dea2c000001',
				name: 'New Protocol'
			});

			// Mock Protocol in scope
			scope.protocol = sampleProtocolPutData;

			// Set PUT response
			$httpBackend.expectPUT(/protocols\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/protocols/' + sampleProtocolPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid protocolId and remove the Protocol from the scope', inject(function(Protocols) {
			// Create new Protocol object
			var sampleProtocol = new Protocols({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Protocols array and include the Protocol
			scope.protocols = [sampleProtocol];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/protocols\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleProtocol);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.protocols.length).toBe(0);
		}));
	});
}());