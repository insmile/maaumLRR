'use strict';

// Centers controller
angular.module('centers').controller('CentersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Centers', '$upload', '$timeout', '$http',
    function($scope, $stateParams, $location, Authentication, Centers, $upload, $timeout, $http) {
        $scope.fileReaderSupported = window.FileReader !== null;

        $scope.authentication = Authentication;

        $scope.change = function() {
            $scope.center.resources = [];
        };

        // Define global instance we'll use to destroy later
        var dtInstance;

        $scope.initDatatable = function() {

            console.log("centers.initDatatable");

            if (!$.fn.dataTable) return;

            dtInstance = $('#dt').dataTable({
                processing: true,
                serverSide: true,
                ajax: { url: "/centers/DT" },
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
                sDom: '<"top"iflpr>t<"bottom"flpr><"clear">', //T
                order: [
                    [4, "desc"]
                ],
                aoColumns: [
                    { mData: 'center_id', sTitle: "기관ID", defaultContent: "NONE" },
                    { mData: 'name', sTitle: "기관명" },
                    { mData: 'tel', sTitle: "전화번호" },
                    { mData: 'officer', sTitle: "담당자", defaultContent: "" },
                    { mData: 'officer_tel', sTitle: "연락처", defaultContent: "" },
                    { mData: 'email', sTitle: "이메일", defaultContent: "" },
                    {
                        "mData": null,
                        sTitle: "기능",
                        "bSortable": false,
                        "mRender": function(data, type, full) {
                            return '<a class="btn btn-info btn-sm" target="_self" href=#!/centers/' + full._id + '>' + '상세보기' + '</a> ' +
                                '<a class="btn btn-info btn-sm" target="_self" href=#!/manager/add/' + full._id + '>' + '관리자 추가' + '</a>';
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
            $scope.center = new Centers();
        };

        // Create new Center
        $scope.create = function() {
            // Create new Center objectg
            $scope.center.$save(function(response) {
                // Clear form fields
                $scope.center = new Centers();
                alert('정상적으로 입력 되었습니다.');
                $location.path('centers/list');

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Center
        $scope.remove = function(center) {
            if (confirm('제거하시겠습니까?')) {
                $scope.center.$remove(function() {
                    $location.path('centers/list');
                });
            }
        };

        // Update existing Center
        $scope.update = function() {

            alert('in');
            $scope.center.$update(function() {
                $location.path('centers/list');
                alert('수정되었습니다.');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Centers
        $scope.find = function() {
            $scope.centers = Centers.query();
        };

        // Find existing Center
        $scope.findOne = function() {
            $scope.center = Centers.get({
                centerId: $stateParams.centerId
            }, function() {
                console.log($scope.center);
            });
        };
    }
]);