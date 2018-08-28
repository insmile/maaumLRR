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
        }, {
            id: 'same',
            label: '문항 일치 검사'
        }, {
            id: 'pick15',
            label: '15 그림 선택'
        }, {
            id: 'ray',
            label: 'Ray 평가'
        }, {
            id: 'forms',
            label: '설문조사'
        }, {
            id: 'visual30',
            label: '시각주의력[30]'
        }, {
            id: 'visual34',
            label: '시각적지속수행검사[34]'
        }, {
            id: 'sound',
            label: '청지각검사[35]'
        }, {
            id: 'pick08',
            label: 'Rey 복합도형 재인 [08]'
<<<<<<< HEAD
        }
        , {
            id: 'draw-one2',
            label: '그리기2'
        }];
        
        // 2018.08.07 타입 추가.
        $scope.taskTypeSelect = [{
            id: 'LT',
            label: 'LT'
        }, {
            id: 'RT',
            label: 'RT'
        }, {
            id: 'LRE',
            label: 'LRE'
        }    
        ];
        
=======
        }, {
            id: 'draw-one2',
            label: '그리기2'
        }];

        $scope.type_ = [{
            id: 'LT',
            label: 'LT'
        }, {
            id: 'LRT',
            label: 'LRT'
        }];
>>>>>>> 45e3dfab886cba0e59c30f547b6998c89a9f0cc9

        $scope.scoreType = [{
            id: 'n/a',
            label: '평가 유형 없음'
        }, {
            id: '01clock',
            label: '시계 그리기 채점표'
        }, {
            id: '02cube',
            label: '직육면체 그리기'
        }, {
            id: '05ray',
            label: 'Ray 복합도형 따라 그리기'
        }, {
            id: 'sfna',
            label: 'S / F / NA [10-13]'
        }, {
            id: 'nbab',
            label: 'N / B / AB [31-33]'
        }, {
            id: 'ndp',
            label: 'N / D / P [38-39]'
        }, {
            id: '정반응/오반응',
            label: '정반응/오반응 [37]'
        }, , {
            id: '시각주의력',
            label: '시각주의력 [30]'
        }];

<<<<<<< HEAD


        $scope.taskTypeSelect_problem = [{
            id: 'ALL',
            label: 'ALL'
        }, {
            id: 'LRE',
            label: 'LRE'
        }, {
            id: 'LT',
            label: 'LT'
        }, {
            id: 'RT',
            label: 'RT'
        }];

        $scope.task = new Tasks({
            resources: []
        });

        $scope.task.selectTaskType = "ALL"; // 디폴트값.

        $scope.changeCategory = function() {            
            // alert("ed2f"+ $scope.task.selectTaskType);
            $scope.initDatatable ();            
        }


        $scope.initDatatable = function() {
            // alert(9);
            $("#list_Table").empty();

            var tableHtml = "<table id='dt' class='table table-striped table-hover'><thead></thead><tbody></tbody></table>";
            $("#list_Table").append(tableHtml);
            $scope.dt();
        }



        // Define global instance we'll use to destroy later
        var dt;
        
        $scope.dt = function() {

            // alert("122");
=======
        // Define global instance we'll use to destroy later
        var dt;

        $scope.dt = function() {

>>>>>>> 45e3dfab886cba0e59c30f547b6998c89a9f0cc9
            if (!$.fn.dataTable) return;

            dt = $('#dt').dataTable({
                processing: true,
                serverSide: true,
<<<<<<< HEAD
                // ajax: { url: "/tasks/DT" },

                ajax: { url: "/tasks/DT" , data:{taskTypeSearch: $scope.task.selectTaskType } }, // 조건 추가.

                "autoWidth": false,
                
                
=======
                ajax: { url: "/tasks/DT" },
                "autoWidth": false,
                /*tableTools: {
                 sSwfPath : '/lib/datatables-tabletools/swf/copy_csv_xls_pdf.swf'
                 },*/
>>>>>>> 45e3dfab886cba0e59c30f547b6998c89a9f0cc9
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
<<<<<<< HEAD
                    { mData: 'taskType', sTitle: "업무타입", defaultContent: "" },
=======
>>>>>>> 45e3dfab886cba0e59c30f547b6998c89a9f0cc9
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
<<<<<<< HEAD
            
=======

>>>>>>> 45e3dfab886cba0e59c30f547b6998c89a9f0cc9
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
<<<<<<< HEAD

            $scope.categoryList=[];
            getCategoryList();
        };


        function getCategoryList() {

            $http({
                // method: 'POST', //방식
                url: '/category', /* 통신할 URL */
                // data: dataObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
            .success(function(data, status, headers, config) {
                if( data ) {                    
                    $scope.categoryList = data;
                    
                    // alert("TaskCategory GET_1:"+ data);
                    // alert("TaskCategory GET_2:"+JSON.stringify(data));
                    /* 성공적으로 결과 데이터가 넘어 왔을 때 처리 */
                }
                else {
                    alert("노 데이터.");
                    /* 통신한 URL에서 데이터가 넘어오지 않았을 때 처리 */
                }
            })
            .error(function(data, status, headers, config) {
                /* 서버와의 연결이 정상적이지 않을 때 처리 */
                console.log(status);
            });    

        }

=======
        };

>>>>>>> 45e3dfab886cba0e59c30f547b6998c89a9f0cc9
        $scope.addResource = function() {
            $scope.task.resources.push({
                resType: 'str',
                strType: 'text'
            });
        };

        $scope.removeResource = function(idx) {
            $scope.task.resources.splice(idx, 1);
        };

<<<<<<< HEAD
=======

>>>>>>> 45e3dfab886cba0e59c30f547b6998c89a9f0cc9
        // Create new Task
        $scope.create = function() {
            $scope.task.preview = $scope.task.preview_file.value;
            // Redirect after save
<<<<<<< HEAD

            alert("$scope.task.taskType=="+$scope.task.taskType);
            
            $scope.task.$save(function(response) {
                console.log($scope.task);
                /// taskType
=======
            $scope.task.$save(function(response) {
                
                // dddddd
                // Resource {__v: 0, user: "59cbd52af5f8bdff402c46cd", isOpen: true, sortOrder: 1, category: "구성 (Construction)", …}
                console.log("등록1!!!"+$scope.task);
                console.log("등록2!!!"+JSON.stringify($scope.task));

>>>>>>> 45e3dfab886cba0e59c30f547b6998c89a9f0cc9

                var newTask = new Tasks({
                    resources: []
                });
                newTask.resources.push({
                    resType: 'str',
                    strType: 'text'
                });
                newTask.category = $scope.task.category;
                newTask.answer = $scope.task.answer;
<<<<<<< HEAD
=======
                newTask.type = $scope.task.type;
>>>>>>> 45e3dfab886cba0e59c30f547b6998c89a9f0cc9
                newTask.isOpen = $scope.task.isOpen;

                $scope.task = newTask;

                alert('저장되었습니다');

                // Clear form fields
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
<<<<<<< HEAD
=======
                alert("등록중 에러"+$scope.error);
                // 'draw-one2' is not a valid enum value for path `answer`.
>>>>>>> 45e3dfab886cba0e59c30f547b6998c89a9f0cc9
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
<<<<<<< HEAD
            
            var files = resource.files;
            
=======
            var files = resource.files;
>>>>>>> 45e3dfab886cba0e59c30f547b6998c89a9f0cc9
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    this.generateThumb(file);
                    $upload.upload({
                        url: 'uploads/',
                        file: file
<<<<<<< HEAD

=======
>>>>>>> 45e3dfab886cba0e59c30f547b6998c89a9f0cc9
                    }).progress(function(evt) {
                        resource.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        //var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        //console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
<<<<<<< HEAD

=======
>>>>>>> 45e3dfab886cba0e59c30f547b6998c89a9f0cc9
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
<<<<<<< HEAD
            // alert("update init");
            getCategoryList();
=======
>>>>>>> 45e3dfab886cba0e59c30f547b6998c89a9f0cc9
            $scope.task = Tasks.get({
                taskId: $stateParams.taskId
            });
        };
    }
]);