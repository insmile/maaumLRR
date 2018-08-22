'use strict';
angular.module('users').controller('TherapistListController', ['$scope', '$http', '$timeout', '$location', 'Authentication', 'ngDialog', 'Users',
    function($scope, $http, $timeout, $location, Authentication, ngDialog, Users) {

        // Define global instance we'll use to destroy later
        var dtTherapist;

        $timeout(function() {

            if (!$.fn.dataTable) return;

            var cols = []

            if (ApplicationConfiguration.enableCenter) {
                cols = cols.concat([
                    { mData: 'center_id', sTitle: "기관ID", defaultContent: "NONE" },
                    { mData: 'center_name', sTitle: "기관명" }
                ]);
            }
            cols = cols.concat([
                { mData: 'username', sTitle: "ID" },
                { mData: 'name', sTitle: "이름" },
                { mData: 'email', sTitle: "이메일" },
                { mData: 'created', sTitle: "가입일" },
                {
                    "mData": 'certified',
                    "sTitle": "승인여부",
                    "bSortable": false,
                    "mRender": function(data, type, full) {
                        if (data)
                            return '<button class="btn btn-square btn-success" href="" onclick="angular.element(this).scope().certify(\'' + data + '\', \'' + full._id + '\')">승인 OK</button>';
                        else
                            return '<button class="btn btn-square btn-danger" href="" onclick="angular.element(this).scope().certify(\'' + data + '\', \'' + full._id + '\')">승인 NO</button>';
                    }
                },
                {
                    "mData": null,
                    "bSortable": false,
                    "mRender": function(data, type, full) {
                        var links = '<a class="btn btn-info btn-sm" href=#!/therapist/edit/' + full._id + '>' + '수정' + '</a>';
                        links += ' <a class="btn btn-info btn-sm" href=#!/therapist/password/' + full._id + '>' + 'PW변경' + '</a>';
                        return links;
                    }
                }
            ]);

            dtTherapist = $('#dtTherapist').dataTable({
                processing: true,
                serverSide: true,
                ajax: { url: "/therapist/datatable" },
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
                    [4, "desc"]
                ],
                aoColumns: cols
            });
            var inputSearchClass = 'datatable_input_col_search';
            var columnInputs = $('tfoot .' + inputSearchClass);

            // On input keyup trigger filtering
            columnInputs
                .keyup(function() {
                    dtTherapist.fnFilter(this.value, columnInputs.index(this));
                });
        });

        $scope.certify = function(certified, id) {

            var query = {
                'id': id
            };

            $http.post('/users/certify', query).success(function() {
                if (!certified)
                    var str = "승인 되었습니다.";
                else
                    var str = "승인 해제되었습니다.";
                ngDialog.open({
                    template: "<p>" + str + "</p><div><button type=\"button\" class=\"btn btn-primary\" ng-click=\"closeThisDialog(1)\">확인</button></div>",
                    plain: true
                });

                dtTherapist.fnReloadAjax();
            }).error(function(response) {
                console.log(response.message);
                $scope.error = response.message;
            });
        };

        // When scope is destroyed we unload all DT instances
        // Also ColVis requires special attention since it attaches
        // elements to body and will not be removed after unload DT
        $scope.$on('$destroy', function() {
            dtTherapist.fnDestroy();
            $('[class*=ColVis]').remove();
        });

    }
]);

angular.module('users').controller('UserListController', ['$scope', '$http', '$timeout', '$location', 'Authentication', 'ngDialog', 'Users',
    function($scope, $http, $timeout, $location, Authentication, ngDialog, Users) {

        // Define global instance we'll use to destroy later
        var dt;

        $scope.initDatatable = function() {

            if (!$.fn.dataTable) return;

            dt = $('#dt').dataTable({
                processing: true,
                serverSide: true,
                ajax: { url: "/user/datatable" },
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
                    [5, "desc"]
                ],
                aoColumns: [
                    { mData: 'center_id', sTitle: "기관ID", defaultContent: "NONE" },
                    { mData: 'center_name', sTitle: "기관명" },
                    { mData: 'roles', sTitle: "회원등급" },
                    { mData: 'username', sTitle: "ID" },
                    { mData: 'name', sTitle: "이름" },
                    { mData: 'email', sTitle: "이메일" },
                    { mData: 'created', sTitle: "가입일" },
                    {
                        "mData": null,
                        "bSortable": false,
                        "mRender": function(data, type, full) {
                            if (full.roles === 'admin') return "";
                            var links = '<a class="btn btn-info btn-sm" href=#!/' + full.roles + '/edit/' + full._id + '>' + '수정' + '</a>';
                            links += ' <a class="btn btn-info btn-sm" href=#!/' + full.roles + '/password/' + full._id + '>' + 'PW변경' + '</a>';
                            links += ' <a class="btn btn-info btn-sm" href=#!/settings/roles/' + full._id + '>' + '등급 변경' + '</a>';
                            return links;
                        }
                    }
                ]
            });

            var inputSearchClass = 'datatable_input_col_search';
            var columnInputs = $('tfoot .' + inputSearchClass);

            // On input keyup trigger filtering
            columnInputs
                .keyup(function() {
                    dt.fnFilter(this.value, columnInputs.index(this));
                });
        }
    }
]);

angular.module('users').controller('PatientListController', ['$scope', '$http', '$timeout', '$location', 'Authentication', 'ngDialog', 'Users', 'Patients',
    function($scope, $http, $timeout, $location, Authentication, ngDialog, Users, Patients) {

        // Define global instance we'll use to destroy later
        var dtTherapist;

        var getkeynum = function() {
            console.log("in get key num");
            if (Authentication.user.center !== undefined) {
                $http.get('/pay/key/' + Authentication.user.center).success(function(keyObj) {
                    console.log(keyObj);
                    $scope.keyObj = keyObj;
                });
            }
        };

        $timeout(function() {

            if (!$.fn.dataTable) return;

            getkeynum();

            var cols = Array()

            cols = cols.concat([
                { mData: 'assignedTherapistName', sTitle: "담당 치료사", defaultContent: "<i>미할당</i>" },
                { mData: 'username', sTitle: "ID" },
                { mData: 'name', sTitle: "이름" },
                { mData: 'email', sTitle: "이메일" },
                { mData: 'created', sTitle: "가입일" },
                { mData: 'regNo', sTitle: "등록번호", defaultContent: "" },
            ]);

            if (ApplicationConfiguration.enableCenter) {
                cols = cols.concat([{
                    "mData": null,
                    sTitle: "기능",
                    "bSortable": false,
                    "mRender": function(data, type, full) {
                        var links = '<a class="btn btn-info btn-sm" href=#!/patient/edit/' + full._id + '>' + '수정' + '</a>';
                        links += ' <a class="btn btn-info btn-sm" href=#!/patient/password/' + full._id + '>' + 'PW변경' + '</a>';
                        links += ' <button class="btn btn-square btn-success" href="" onclick="angular.element(this).scope().activationPopup(\'' + full._id + '\')">활성화 기간 재설정</button>';
                        return links;
                    }
                }]);
            }
            cols = cols.concat([{
                "mData": null,
                sTitle: "기능",
                "bSortable": false,
                "mRender": function(data, type, full) {
                    var links = '<a class="btn btn-info btn-sm" href=#!/patient/edit/' + full._id + '>' + '수정' + '</a>';
                    links += ' <a class="btn btn-info btn-sm" href=#!/patient/password/' + full._id + '>' + 'PW변경' + '</a>';
                    links += ' <button class="btn btn-square btn-success" href="" onclick="angular.element(this).scope().activationPopup(\'' + full._id + '\')">활성화 기간 재설정</button>';
                    return links;
                }
            }]);

            $http.get('/therapist/list/').success(function(therapists) {

                dtTherapist = $('#dtTherapist').dataTable({
                    processing: true,
                    serverSide: true,
                    ajax: { url: "/patient/datatable" },
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
                        [4, "desc"]
                    ],
                    aoColumns: cols
                });

            });

            var inputSearchClass = 'datatable_input_col_search';
            var columnInputs = $('tfoot .' + inputSearchClass);

            // On input keyup trigger filtering
            columnInputs
                .keyup(function() {
                    dtTherapist.fnFilter(this.value, columnInputs.index(this));
                });
        });

        $scope.activationPopup = function(id) {
            $scope.test = { val: 30 };
            $scope.opts = [
                { text: "7일", val: 7 },
                { text: "30일", val: 30 },
                { text: "365일", val: 365 },
                { text: "무제한", val: 36500 }
            ];

            ngDialog.openConfirm({
                //template: "<p>"+str+"</p><div><button type=\"button\" class=\"btn btn-primary\" ng-click=\"closeThisDialog(1)\">확인</button></div>",
                scope: $scope,
                template: "<div class='form-group'><label>활성화 기간 설정 (설정 일 수 이후 자동 비활성화됩니다.) : </label>" +
                    "<select data-ng-model='test.val' class='form-control'>" +
                    "<option ng-repeat='opt in opts' ng-value='opt.val' ng-selected='{{opt.val === test.val}}'>{{opt.text}}</option> " +
                    "</select></div>" +
                    "<div class='text-center form-group mt'>" +
                    "<button type=\"button\" class=\"btn btn-primary\" ng-click=\"confirm(test.val)\">확인</button>" +
                    "</div>",
                plain: true
            }).then(function(val) {
                var query = {
                    'userId': id,
                    'has_key': true,
                    'expired_duration': val
                };

                $http.post('/patient/activate', query).success(function() {
                    ngDialog.open({
                        template: "<p>변경되었습니다.</p><div><button type=\"button\" class=\"btn btn-primary\" ng-click=\"closeThisDialog(1)\">확인</button></div>",
                        plain: true
                    });

                    dtTherapist.fnReloadAjax();
                }).error(function(response) {
                    console.log(response.message);
                    $scope.error = response.message;
                });
            });
        };

        $scope.activation = function(currentState, id) {

            var query = {
                'userId': id,
                'has_key': currentState === "false",
                'expired_duration': 30,
            };

            console.log(query);

            $http.post('/patient/activate', query).success(function() {
                getkeynum();
                dtTherapist.fnReloadAjax();
            }).error(function(response) {
                console.log(response.message);
                ngDialog.open({
                    template: "<p>" + response.message + "</p><div><button type=\"button\" class=\"btn btn-primary\" ng-click=\"closeThisDialog(1)\">확인</button></div>",
                    plain: true
                });
                $scope.error = response.message;
            });
        };

        // When scope is destroyed we unload all DT instances
        // Also ColVis requires special attention since it attaches
        // elements to body and will not be removed after unload DT
        $scope.$on('$destroy', function() {
            dtTherapist.fnDestroy();
            $('[class*=ColVis]').remove();
        });

    }
]);