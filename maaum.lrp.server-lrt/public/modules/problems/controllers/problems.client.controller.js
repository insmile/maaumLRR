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


        $scope.taskTypeSelect_problem = [{
            id: 'ALL',
            label: 'ALL'
        }, {
            id: 'LRE',
            label: 'LRE(언어인지기능평가)'
        }, {
            id: 'LT',
            label: 'LT(언어기능훈련)'
        }, {
            id: 'RT',
            label: 'RT(인지기능훈련)'
        }];


        // 검사 목록 가져오기.        
        // app.route('/tasks/list3/:gubun').get(users.requiresLogin, tasks.list_5);
        // $scope.tasks = Tasks.query();
        
        // $scope.tasks = Tasks.query();
        getTaskListWithCategory("ALL"); // 디폴트. 태스크  다 가져오기.
        
        function getTaskListWithCategory(categoryName) {
            // alert(categoryName);
            $http.get('/tasks/list4/'+categoryName).success(function(data, status, headers, config) {
                $scope.tasks = data;
                // alert(JSON.stringify($scope.tasks));
            }).error(function(data, status, headers, config) {
                $scope.error = data.message;
            });
        }

        // 2018.08.18 추가
        // 프라블럼 등록시 검사 카테고리 바꾸기.
        $scope.changeType = function(index) {
            // alert($scope.task.selectTaskType);
            getTaskListWithCategory($scope.task.selectTaskType);
        }

        

        $scope.task = new Tasks();

        $scope.toggle = false;

        $http.get('/tasks/category').success(function(data, status, headers, config) {
            $scope.category = data;
        }).error(function(data, status, headers, config) {
            $scope.error = data.message;
        });


        $http.get('/tasks/name').success(function(data, status, headers, config) {
            // alert("get name1");            
            $scope.name = data;
            // alert("get name"+JSON.stringify(data));            

        }).error(function(data, status, headers, config) {
            $scope.error = data.message;
        });


        $scope.change = function() {
            // alert("change!!!!");
            // console.log("change~!!!"+$scope.task);
            $scope.problem.resources = [];
        };

        $scope.toggleTask = function() {
            $scope.toggle = !$scope.toggle;
        };

        // 2018.08.07 카테고리별 검색 추가.
        $scope.task.selectTaskType = "ALL";

        $scope.changeCategory = function() {            
            // alert("ed2f"+ $scope.task.selectTaskType);
            $scope.initDatatable ();            
        }

        $scope.checkShowDraw = function() {
            // console.log("dpdpdpdpdpdpdp = "+JSON.stringify($scope.task));            
            // 그리기2
            if($scope.task.answer == "draw-one2"){
                return true;
            }            
            return false;
        }

        $scope.draw2_selectShape = function(type) {

            if(type=="1"){ // 삼각형, 사각형, 원 선택
                document.getElementById("sstt4").checked = false;
                document.getElementById("sstt5").checked = false;

                document.getElementById("sstt4").disabled = true;
                document.getElementById("sstt5").disabled = true;

                document.getElementById("sstt1").disabled = false;
                document.getElementById("sstt2").disabled = false;
                document.getElementById("sstt3").disabled = false;
                            
            }else { // 가나다, 숫자 선택.
                document.getElementById("sstt1").checked = false;
                document.getElementById("sstt2").checked = false;
                document.getElementById("sstt3").checked = false;

                document.getElementById("sstt4").disabled = false;
                document.getElementById("sstt5").disabled = false;

                document.getElementById("sstt1").disabled = true;
                document.getElementById("sstt2").disabled = true;
                document.getElementById("sstt3").disabled = true;
            }
        }
        
        $scope.shape_count = "4"; // 그릴 수.

        $scope.shape_countDD = function(flag) {
            // alert(333);
            $scope.shape_count = Number($scope.shape_count);

            if(flag=="up"){                
                $scope.shape_count++;
            }else {
                $scope.shape_count--;

            }

            // alert($scope.shape_count);

            return false; 
        }

        
        


        $scope.changeTask = function() {
            alert("changeTask");
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
            
            $("#list_Table").empty();

            if (!$.fn.dataTable) return;
            
            var tableHtml = "<table id='dt' class='table table-striped table-hover'>";
            tableHtml += "<thead></thead><tbody></tbody><tfoot>";
            tableHtml += "<tr><th><input type='text' name='filter_taskCategory' placeholder='범주' class='datatable_input_col_search'>";
            tableHtml += "</th><th><input type='text' name='filter_taskNamer' placeholder='과제명' class='datatable_input_col_search'>";
            tableHtml += "</th><th><input type='text' name='filter_seq' placeholder='문제 세트 ID' class='datatable_input_col_search'>";
            tableHtml += "</th><th><input type='text' name='filter_name' placeholder='문제 순서' class='datatable_input_col_search'>";
            tableHtml += "</th><th></th><th></th></tr></tfoot></table>";
                        
            $("#list_Table").append(tableHtml);
            
            dtInstance = $('#dt').dataTable({
                processing: true,
                serverSide: true,
                
                // ajax: { url: "/problems/DT" },

                ajax: { url: "/problems/DT" , data:{taskTypeSearch: $scope.task.selectTaskType } }, // 조건 추가.
                
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
                    { mData: 'taskType', sTitle: "업무타입" },
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

        //ddddd1
        function draw2Check() {
            var allUnCheck = true;

            for(var j = 1; j<6; j++){                        
                if( document.getElementById("sstt"+j).checked) {
                    allUnCheck = false;
                    break;
                }                        
            }
            return allUnCheck;
        }

        //ddddd2 그리기 2 관련 데이터 형성
        function draw2MakeData(index) {
            var drawData={};
                    
            for(var j = 1; j<6; j++) {
                var key = "sstt"+j;
                
                if(document.getElementById(key).checked){
                    drawData[key]="on";
                }else {
                    drawData[key]="off";
                }
            }

            drawData["shapeCount"] = $scope.shape_count;

            var resultData = {
                name: $scope.task.resources[index].name,
                isDefinition: $scope.task.resources[index].isDefinition,
                resType: $scope.task.resources[index].resType,
                strType: $scope.task.resources[index].strType,
                note : JSON.stringify(drawData),
                value : "partial/draw22.html"
            };

            return resultData;            
        }

        // 문제 만들기!!!!!!
        // Create new Problem
        $scope.create = function() {
            // Create new Problem object
            
            // 그리기2
            if($scope.task.answer == "draw-one2"){
                if(draw2Check()) {
                    alert("하나 이상 선택하셔야합니다.");
                    return;
                }
            }
            
            $scope.problem.refTask = $scope.task._id;
            $scope.problem.taskName = $scope.task.name;
            $scope.problem.taskCategory = $scope.task.category;
            $scope.problem.taskType = $scope.task.taskType;

            // alert("$scope.problem.taskType : :"+$scope.problem.taskType);

            var skip = false;

            for (var i = 0; i < $scope.task.resources.length; i++) {

                // 그리기2
                if($scope.task.answer == "draw-one2"){
                    
                    $scope.problem.resources[i] = draw2MakeData(i);
                    console.log("ddddd:"+JSON.stringify($scope.problem.resources[i]));
                    
                    /*
                    "name":"asdf",
                    "isDefinition":false,"resType":"str","strType":"text","note":{"sstt1":"on","sstt2":"off","sstt3":"off","sstt4":"off","sstt5":"off","shapeCount":"4"}}
                    */

                    continue;
                }

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

                // 
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

            // 그리기2
            if($scope.task.answer == "draw-one2"){
                if(draw2Check()) {
                    alert("하나 이상 선택하셔야합니다.");
                    return;
                }
            }

            for (var i = 0; i < $scope.problem.resources.length; i++) {

                 // 그리기2
                 if($scope.task.answer == "draw-one2"){                    
                    $scope.problem.resources[i] = draw2MakeData(i);
                    console.log("draw2 update DATA:"+JSON.stringify($scope.problem.resources[i]));
                    continue;
                }


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