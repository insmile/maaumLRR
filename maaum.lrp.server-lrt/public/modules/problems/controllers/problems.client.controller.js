'use strict';

// Problems controller
angular.module('problems').controller('ProblemsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Problems', 'Tasks', '$upload', '$timeout', '$http',
    function($scope, $stateParams, $location, Authentication, Problems, Tasks, $upload, $timeout, $http) {
        $scope.fileReaderSupported = window.FileReader !== null;

        $scope.authentication = Authentication;

        $scope.imageOrientation = [{
            id: 'default',
            label: '기본'
        }, {
            id: 'left',
            label: '좌측'
        }, {
            id: 'right',
            label: '우측'
        }, {
            id: 'center',
            label: '중앙'
        }];

        $scope.tasks = Tasks.query();

        $scope.task = new Tasks();

        $scope.toggle = false;

        $http.get('/tasks/category').success(function(data, status, headers, config) {
            $scope.category = data;
        }).error(function(data, status, headers, config) {
            $scope.error = data.message;
        });

        $http.get('/tasks/name').success(function(data, status, headers, config) {
            $scope.name = data;
        }).error(function(data, status, headers, config) {
            $scope.error = data.message;
        });

        $scope.change = function() {
            console.log($scope.task);
            $scope.problem.resources = [];
        };

        $scope.toggleTask = function() {
            $scope.toggle = !$scope.toggle;
        };

        $scope.changeTask = function() {
            $scope.problem.resources = [];

            $scope.problem.refTask = $scope.task._id;
            $scope.problem.taskName = $scope.task.name;
            $scope.problem.taskCategory = $scope.task.category;

            var skip = false;

            for (var i = 0; i < $scope.task.resources.length; i++) {
                $scope.problem.resources.push($scope.task.resources[i]);
                $scope.problem.resources[i].name = $scope.task.resources[i].name;
                $scope.problem.resources[i].isDefinition = $scope.task.resources[i].isDefinition;
                $scope.problem.resources[i].resType = $scope.task.resources[i].resType;
                $scope.problem.resources[i].strType = $scope.task.resources[i].strType;
                if ($scope.problem.resources[i].resType === "file") {
                    $scope.problem.resources[i].files[0].dataUrl = "";
                }
            }

            console.log($scope.problem);
        };

        // Define global instance we'll use to destroy later
        var dtInstance;

        $scope.initDatatable = function() {

            if (!$.fn.dataTable) return;

            dtInstance = $('#dt').dataTable({
                processing: true,
                serverSide: true,
                ajax: { url: "/problems/DT" },
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
                aoColumns: [
                    { mData: 'taskCategory', sTitle: "범주", defaultContent: "" },
                    { mData: 'taskName', sTitle: "과제명", defaultContent: "" },
                    { mData: 'name', sTitle: "문제 세트 ID" },
                    { mData: 'seq', sTitle: "문제 순서" },
                    { mData: 'created', sTitle: "생성일" },
                    {
                        "mData": null,
                        sTitle: "기능",
                        "bSortable": false,
                        "mRender": function(data, type, full) {
                            return '<a class="btn btn-info btn-sm" target="_self" href=#!/problems/' + full._id + '>' + '상세보기' + '</a>';
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
            $scope.problem = new Problems();
        };

        $scope.upload = function(resource) {
            var files = resource.files;
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    this.generateThumb(file);
                    $upload.upload({
                        url: 'uploads/',
                        file: file
                    }).progress(function(evt) {
                        resource.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        //var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        //console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                    }).success(function(data, status, headers, config) {
                        resource.value = data.file.name;
                        //console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                    });
                }
            }
        };

        $scope.generateThumb = function(file) {
            if (file !== null) {
                if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
                    $timeout(function() {
                        var fileReader = new FileReader();
                        fileReader.readAsDataURL(file);
                        fileReader.onload = function(e) {
                            $timeout(function() {
                                console.log(file);
                                file.dataUrl = e.target.result;
                            });
                        };
                    });
                }
            }
        };

        // Create new Problem
        $scope.create = function() {
            // Create new Problem object

            $scope.problem.refTask = $scope.task._id;
            $scope.problem.taskName = $scope.task.name;
            $scope.problem.taskCategory = $scope.task.category;

            var skip = false;

            for (var i = 0; i < $scope.task.resources.length; i++) {
                if ($scope.problem.resources[i] === undefined) {
                    //console.log($scope.task.resources[i]);
                    var str = $scope.task.resources[i].name + "항목이 입력되지 않았습니다. 계속 진행하시겠습니까?";
                    if (confirm(str) === false) {
                        return;
                    } else {
                        $scope.problem.resources[i] = $scope.task.resources[i];
                        $scope.problem.value = undefined;
                        skip = true;
                    }

                    if (skip) {
                        $scope.problem.resources[i] = {
                            name: $scope.task.resources[i].name,
                            isDefinition: $scope.task.resources[i].isDefinition,
                            resType: $scope.task.resources[i].resType,
                            strType: $scope.task.resources[i].strType
                        };
                        continue;
                    }
                }
                console.log($scope.problem.resources[i]);
                $scope.problem.resources[i].name = $scope.task.resources[i].name;
                $scope.problem.resources[i].isDefinition = $scope.task.resources[i].isDefinition;
                $scope.problem.resources[i].resType = $scope.task.resources[i].resType;
                $scope.problem.resources[i].strType = $scope.task.resources[i].strType;
                if ($scope.problem.resources[i].resType === "file") {
                    $scope.problem.resources[i].files[0].dataUrl = "";
                }
            }

            /*console.log($scope.problem);
            return;*/

            // Redirect after save
            $scope.problem.$save(function(response) {
                //$location.path('problems/' + response._id);

                var setId = response.name;
                var seq = response.seq + 1;

                //console.log(response);

                // Clear form fields
                $scope.problem = new Problems();
                $scope.problem.resources = [];
                $scope.problem.name = setId;
                $scope.problem.seq = seq;

                alert('정상적으로 입력 되었습니다.');

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Problem
        $scope.remove = function(problem) {
            if (problem) {
                problem.$remove();

                for (var i in $scope.problems) {
                    if ($scope.problems[i] === problem) {
                        $scope.problems.splice(i, 1);
                    }
                }
            } else {
                if (confirm('제거하시겠습니까?')) {
                    $scope.problem.$remove(function() {
                        $location.path('problems');
                    });
                }
            }
        };

        // Update existing Problem
        $scope.update = function() {
            $scope.problem.refTask = $scope.task._id;
            $scope.problem.taskName = $scope.task.name;
            $scope.problem.taskCategory = $scope.task.category;

            var skip = false;

            for (var i = 0; i < $scope.problem.resources.length; i++) {
                if ($scope.problem.resources[i] === undefined) {
                    console.log($scope.problem.resources[i]);
                    var str = $scope.problem.resources[i].name + "항목이 입력되지 않았습니다. 계속 진행하시겠습니까?";
                    if (confirm(str) === false) {
                        return;
                    } else {
                        $scope.problem.resources[i] = $scope.task.resources[i];
                        $scope.problem.value = undefined;
                        skip = true;
                    }

                    if (skip) {
                        $scope.problem.resources[i] = {
                            name: $scope.task.resources[i].name,
                            isDefinition: $scope.task.resources[i].isDefinition,
                            resType: $scope.task.resources[i].resType,
                            strType: $scope.task.resources[i].strType
                        };
                        continue;
                    }
                }
                console.log($scope.problem.resources[i]);
                $scope.problem.resources[i].name = $scope.task.resources[i].name;
                $scope.problem.resources[i].isDefinition = $scope.task.resources[i].isDefinition;
                $scope.problem.resources[i].resType = $scope.task.resources[i].resType;
                $scope.problem.resources[i].strType = $scope.task.resources[i].strType;
                if ($scope.problem.resources[i].resType === "file") {
                    delete $scope.problem.resources[i].files;
                }
            }

            var problem = $scope.problem;

            //console.log(problem);

            problem.$update(function() {
                $location.path('problems/' + problem._id);
                alert('수정되었습니다.');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Problems
        $scope.find = function() {
            $scope.problems = Problems.query();
        };

        // Find existing Problem
        $scope.findOne = function() {

            $scope.problem = Problems.get({
                problemId: $stateParams.problemId
            }, function() {
                console.log($scope.problem);
                //console.log($scope.problem.refTask._id);
                $scope.task = Tasks.get({
                    taskId: $scope.problem.refTask._id
                }, function() {
                    //console.log($scope.task22);
                });
            });
        };
    }
]);