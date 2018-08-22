'use strict';

// Tasks controller
angular.module('tasks').controller('TasksController', ['$scope', '$stateParams', '$location', 'Authentication', 'Tasks', '$upload', '$timeout', '$http',
    function($scope, $stateParams, $location, Authentication, Tasks, $upload, $timeout, $http) {

        $scope.fileReaderSupported = window.FileReader !== null;
        $scope.authentication = Authentication;

        $scope.answerType = [{
            id: 'select',
            label: '객관식'
        }, {
            id: 'record',
            label: '음성녹음'
        }, {
            id: 'draw-one',
            label: '그림 그리기'
        }, {
            id: 'draw-two',
            label: 'side-by-side 그림 그리기'
        }, {
            id: 'manual',
            label: '수동 채점 (O/X) (완료 후)'
        }, {
            id: 'manual_now',
            label: '수동 채점 (O/X) (즉시)'
        }];

        // Define global instance we'll use to destroy later
        var dt;

        $scope.dt = function() {

            if (!$.fn.dataTable) return;

            dt = $('#dt').dataTable({
                processing: true,
                serverSide: true,
                ajax: { url: "/tasks/DT" },
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
                    [0, "asc"]
                ],
                aoColumns: [
                    { mData: 'category', sTitle: "범주", defaultContent: "" },
                    { mData: 'name', sTitle: "과제명", defaultContent: "" },
                    {
                        "mData": null,
                        sTitle: "기능",
                        "bSortable": false,
                        "mRender": function(data, type, full) {
                            return '<a class="btn btn-info btn-sm" target="_self" href=#!/tasks/' + full._id + '>' + '상세보기' + '</a>';
                        }
                    }
                ],
                columnDefs: [{
                    targets: [0],
                    orderData: [0, 1]
                }]
            });
        };

        $scope.init = function() {

            try {
                $scope.task.preview_file.value = $scope.task.preview;
            } catch (err) {;
            }

            $scope.task = new Tasks({
                resources: []
            });

            $scope.task.isOpen = true;

            $scope.task.resources.push({
                resType: 'str',
                strType: 'text'
            });
        };

        $scope.addResource = function() {
            $scope.task.resources.push({
                resType: 'str',
                strType: 'text'
            });
        };

        $scope.removeResource = function(idx) {
            $scope.task.resources.splice(idx, 1);
        };

        // Create new Task
        $scope.create = function() {
            $scope.task.preview = $scope.task.preview_file.value;
            // Redirect after save
            $scope.task.$save(function(response) {
                console.log($scope.task);

                var newTask = new Tasks({
                    resources: []
                });
                newTask.resources.push({
                    resType: 'str',
                    strType: 'text'
                });
                newTask.category = $scope.task.category;
                newTask.answer = $scope.task.answer;
                newTask.isOpen = $scope.task.isOpen;

                $scope.task = newTask;

                alert('저장되었습니다');

                // Clear form fields
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Task
        $scope.remove = function(task) {
            if (task) {
                task.$remove();

                for (var i in $scope.tasks) {
                    if ($scope.tasks[i] === task) {
                        $scope.tasks.splice(i, 1);
                    }
                }
            } else {
                if (confirm('제거하시겠습니까?')) {
                    $scope.task.$remove(function() {
                        $location.path('tasks');
                    });
                }
            }
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
                        //console.log("DATA" + data);
                        resource.value = data.file.name;
                        $scope.task.preview = data.file.name;
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
                                //$scope.task.preview = e.target.result;
                                file.dataUrl = e.target.result;
                            });
                        };
                    });
                }
            }
        };

        // Update existing Task
        $scope.update = function() {
            var task = $scope.task;

            console.log(task);
            delete task.preview_file;

            task.$update(function() {
                $location.path('tasks/' + task._id);
                alert('수정되었습니다.');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Tasks
        $scope.find = function() {
            $scope.tasks = Tasks.query();
        };

        // Find existing Task
        $scope.findOne = function() {
            $scope.task = Tasks.get({
                taskId: $stateParams.taskId
            });
        };
    }
]);