'use strict';

// Pays controller
angular.module('pay').controller('PayController', ['$scope', '$stateParams', '$location', 'Authentication', 'Pay', 'Centers', 'Products', '$upload', '$timeout', '$http',
    function($scope, $stateParams, $location, Authentication, Pay, Centers, Products, $upload, $timeout, $http) {
        $scope.fileReaderSupported = window.FileReader !== null;

        $scope.authentication = Authentication;

        $scope.change = function() {
            $scope.pay.resources = [];
        };

        var isAdmin = Authentication.user.roles === 'admin';

        if (isAdmin) {
            $scope.centers = Centers.query();
        } else {
            $scope.center = Authentication.user.center;
            $scope.center_name = Authentication.user.center_name;
        }
        $scope.products = Products.query();

        $scope.$watch('pay.product', function(newVal, oldVal) {
            $scope.selectedProduct = $scope.products.find(p => p._id === newVal);
            console.log($scope.selectedProduct);
        });

        // Define global instance we'll use to destroy later
        var dtInstance;

        $scope.initDatatable = function() {

            console.log("pay.initDatatable");

            if (!$.fn.dataTable) return;

            dtInstance = $('#dt').dataTable({
                processing: true,
                serverSide: true,
                ajax: { url: "/pay/DT" },
                "autoWidth": false,
                /*tableTools: {
                 sSwfPath : '/lib/datatables-tabletools/swf/copy_csv_xls_pdf.swf'
                 },*/
                responsive: true,
                language: {
                    "emptyTable": "레코드가 없습니다.",
                    "info": "(_START_ ~ _END_) / _TOTAL_",
                    "infoEmpty": "",
                    "infoFiltered": "(_MAX_ 중에서 검색됨)",
                    "infoPostFix": "",
                    "thousands": ",",
                    "lengthMenu": "표시 레코드 수 : _MENU_",
                    "loadingRecords": "로딩...",
                    "processing": "처리중...",
                    "search": "검색: ",
                    "zeroRecords": "검색 결과 없음",
                    "paginate": {
                        "first": "처음",
                        "last": "마지막",
                        "next": "다음",
                        "previous": "이전"
                    },
                    "aria": {
                        "sortAscending": ": 오름차순으로 정렬",
                        "sortDescending": ": 내림차순으로 정렬"
                    }
                },
                //sDom: '<"top"i>t<"bottom"flpr><"clear">', //T
                sDom: '<"top"iflpr>t<"bottom"flpr><"clear">', //T
                order: [
                    [2, "desc"]
                ],
                aoColumns: [
                    { mData: 'center_id', sTitle: "기관ID", defaultContent: "NONE" },
                    { mData: 'center_name', sTitle: "기관명" },
                    { mData: 'product_name', sTitle: "상품명" },
                    { mData: 'request_date', sTitle: "구매일" },
                    { mData: 'approved_date', sTitle: "승인일", defaultContent: "" },
                    { mData: 'start_date', sTitle: "시작일" },
                    { mData: 'expired_date', sTitle: "만료일", defaultContent: "" },
                    {
                        "mData": 'approved',
                        "sTitle": "승인여부",
                        "bSortable": false,
                        "mRender": function(data, type, full) {
                            if (data)
                                return '<button class="btn btn-square btn-success" href="" onclick="angular.element(this).scope().activation(\'' + data + '\', \'' + full._id + '\')">승인</button>';
                            else
                                return '<button class="btn btn-square btn-danger" href="" onclick="angular.element(this).scope().activation(\'' + data + '\', \'' + full._id + '\')">비승인</button>';
                        }
                    },
                    {
                        "mData": null,
                        sTitle: "기능",
                        "bSortable": false,
                        "mRender": function(data, type, full) {
                            return '<a class="btn btn-info btn-sm" target="_self" href=#!/pay/' + full._id + '>' + '상세보기' + '</a>';
                        }
                    }
                ]
            });

            var inputSearchClass = 'datatable_input_col_search';
            var columnInputs = $('tfoot .' + inputSearchClass);

            // On input keyup trigger filtering
            columnInputs
                .keyup(function() {
                    dtInstance.fnFilter(this.value, columnInputs.index(this));
                });

        };

        $scope.init = function() {
            $scope.pay = new Pay();
            $scope.pay.start_date = new Date();
            $scope.pay.start_date.setHours(0);
            $scope.pay.start_date.setMinutes(0);
            $scope.pay.start_date.setSeconds(0);
            $scope.pay.start_date.setMilliseconds(0);
            console.log("init");
            console.log(Authentication);
        };

        $scope.activation = function(currentState, id) {
            $http.get('/pay/activation/' + id).success(function() {
                dtInstance.fnReloadAjax();
            }).error(function(response) {
                console.log(response.message);
                $scope.error = response.message;
            });
        };

        // Create new Pay
        $scope.create = function() {
            // Create new Pay object
            if ($scope.center !== undefined) {
                $scope.pay.center = $scope.center;
            }
            $scope.pay.$save(function(response) {
                // Clear form fields
                $scope.pay = new Pay();
                alert('상품 구매가 완료되었습니다. 금액 입금 후 승인 절차가 진행됩니다.');
                $location.path('pay/list');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Pay
        $scope.remove = function(pay) {
            if (confirm('제거하시겠습니까?')) {
                $scope.pay.$remove(function() {
                    $location.path('pay/list');
                });
            }
        };

        // Update existing Pay
        $scope.update = function() {
            $scope.pay.$update(function() {
                $location.path('pay/list');
                alert('수정되었습니다.');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Pay
        $scope.find = function() {
            $scope.pays = Pay.query();
        };

        // Find existing Pay
        $scope.findOne = function() {
            $scope.pay = Pay.get({
                payId: $stateParams.payId
            }, function() {
                console.log($scope.pay);
            });
        };
    }
]);