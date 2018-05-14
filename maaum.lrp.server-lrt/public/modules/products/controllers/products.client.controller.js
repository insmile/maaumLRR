'use strict';

// Products controller
angular.module('products').controller('ProductsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Products','$upload', '$timeout','$http',
	function($scope, $stateParams, $location, Authentication, Products, $upload, $timeout, $http) {
		$scope.fileReaderSupported = window.FileReader !== null;

		$scope.authentication = Authentication;

		$scope.change = function() {
			$scope.product.resources = [];
		};

        $scope.cards = [
            {
                template : "/modules/products/views/partial/card.html",
                tabs : ["home", "work"],
                data : {
                    "position" : "Web Developer",
                    "company" : "Hacker Inc."
                },
                added : 1414871272105,
            },
            {
                template : "/modules/products/views/partial/card.html",
                tabs : ["home", "work"],
                data : {
                    "position" : "Data Scientist",
                    "company" : "Big Data Inc."
                },
                added : 1423871272105,
            },
            {
                template : "/modules/products/views/partial/card.html",
                tabs : ["home", "work"],
                data : {
                    "position" : "Data Scientist",
                    "company" : "Big Data Inc."
                },
                added : 1423871272105,
            },
            {
                template : "/modules/products/views/partial/card.html",
                tabs : ["home", "work"],
                data : {
                    "position" : "Data Scientist",
                    "company" : "Big Data Inc."
                },
                added : 1423871272105,
            },
            {
                template : "/modules/products/views/partial/card.html",
                tabs : ["home", "work"],
                data : {
                    "position" : "Data Scientist",
                    "company" : "Big Data Inc."
                },
                added : 1423871272105,
            },
            {
                template : "/modules/products/views/partial/card.html",
                tabs : ["home", "work"],
                data : {
                    "position" : "Data Scientist",
                    "company" : "Big Data Inc."
                },
                added : 1423871272105,
            },
            {
                template : "/modules/products/views/partial/card.html",
                tabs : ["home", "work"],
                data : {
                    "position" : "Data Scientist",
                    "company" : "Big Data Inc."
                },
                added : 1423871272105,
            },
            {
                template : "/modules/products/views/partial/card.html",
                tabs : ["home", "work"],
                data : {
                    "position" : "Data Scientist",
                    "company" : "Big Data Inc."
                },
                added : 1423871272105,
            },
            {
                template : "/modules/products/views/partial/card.html",
                tabs : ["home", "work"],
                data : {
                    "position" : "Data Scientist",
                    "company" : "Big Data Inc."
                },
                added : 1423871272105,
            }
        ];

		// Define global instance we'll use to destroy later
		var dtInstance;

		$scope.initDatatable = function(){

			console.log("products.initDatatable");

			if ( ! $.fn.dataTable ) return;

			dtInstance = $('#dt').dataTable({
				processing: true,
				serverSide: true,
				ajax: { url: "/products/DT" },
				"autoWidth": false,
				/*tableTools: {
				 sSwfPath : '/lib/datatables-tabletools/swf/copy_csv_xls_pdf.swf'
				 },*/
				responsive: true,
				language: {
					"emptyTable":     "레코드가 없습니다.",
					"info":           "(_START_ ~ _END_) / _TOTAL_",
					"infoEmpty":      "",
					"infoFiltered":   "(_MAX_ 중에서 검색됨)",
					"infoPostFix":    "",
					"thousands":      ",",
					"lengthMenu":     "표시 레코드 수 : _MENU_",
					"loadingRecords": "로딩...",
					"processing":     "처리중...",
					"search":         "검색: ",
					"zeroRecords":    "검색 결과 없음",
					"paginate": {
						"first":      "처음",
						"last":       "마지막",
						"next":       "다음",
						"previous":   "이전"
					},
					"aria": {
						"sortAscending":  ": 오름차순으로 정렬",
						"sortDescending": ": 내림차순으로 정렬"
					}
				},
				//sDom: '<"top"i>t<"bottom"flpr><"clear">', //T
                sDom: '<"top"iflpr>t<"bottom"flpr><"clear">', //T
				order: [[4, "desc"]],
				aoColumns: [
					{ mData: 'name', sTitle: "상품명" },
					{ mData: 'keys', sTitle: "허용 키 개수" },
					{ mData: 'period', sTitle: "상품지속일" },
					{ mData: 'price', sTitle:"가격"},
					{
						"mData": null,
						sTitle: "기능",
						"bSortable": false,
						"mRender": function(data, type, full) {
							return '<a class="btn btn-info btn-sm" target="_self" href=#!/products/' + full._id + '>' + '상세보기' + '</a>';
						}
					}
				]
			});

			var inputSearchClass = 'datatable_input_col_search';
			var columnInputs = $('tfoot .'+inputSearchClass);

			// On input keyup trigger filtering
			columnInputs
				.keyup(function () {
					dtInstance.fnFilter(this.value, columnInputs.index(this));
				});

		};

		$scope.init = function() {
			$scope.product = new Products();
		};

		// Create new Product
		$scope.create = function() {
			// Create new Product objectg
			$scope.product.$save(function(response) {
				// Clear form fields
				$scope.product = new Products();
				alert('정상적으로 입력 되었습니다.');
                $location.path('products/list');

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Product
		$scope.remove = function(product) {
			if(confirm('제거하시겠습니까?')) {
				$scope.product.$remove(function () {
					$location.path('products/list');
				});
			}
		};

		// Update existing Product
		$scope.update = function() {
			var product = $scope.product;

			product.$update(function() {
				$location.path('products/list');
				alert('수정되었습니다.');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Products
		$scope.find = function() {
			$scope.products = Products.query();
		};

		// Find existing Product
		$scope.findOne = function() {
			$scope.product = Products.get({
				productId: $stateParams.productId
			});
		};
	}
]);
