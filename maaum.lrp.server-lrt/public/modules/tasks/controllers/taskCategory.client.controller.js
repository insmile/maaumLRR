'use strict';

// Tasks controller
angular.module('tasks').controller('TaskCategoryController', ['$scope', '$stateParams', '$location', 'Authentication', 'TaskCategory', '$upload', '$timeout', '$http',
    function($scope, $stateParams, $location, Authentication, TaskCategory,  $upload, $timeout, $http) {


        $scope.categoryList = [];

        $scope.init = function() {
            
            $scope.categoryBase = new TaskCategory.categoryBase({}); //List, Create
            //$scope.categoryUpdate = new TaskCategory.categoryUpdate({});
            $scope.categoryReadData = new TaskCategory.categoryRead({});
            
            // $scope.categoryBase = Tasks.categoryBase.query();
            // = Tasks.categoryBase.query();
            
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
            // categoryReadList();
        };
        
        
        $scope.updateCategory = function(index, id) {
                        
            // alert("Category update1 = "+index+"=="+id);
            
            var upData = $scope.categoryList[index];

            // alert(JSON.stringify(upData));
                                    
            // var data = {categoryId : JSON.stringify(upData) }

            var data = upData._id+":"+upData.categoryName;
            
            $http.get('/category/update/'+ data)
            .success(function (data, status, headers) {
                alert("수정완료!");
                $location.path('tasks/create');

            })
            .error(function (data, status, header, config) {

                
                }    
            );

            return false;   
        }


        $scope.addCategory = function() {

            // alert($scope.categoryNewName);

            $scope.categoryBase = new TaskCategory.categoryBase({
                categoryIndex: '1',
                categoryName: $scope.categoryNewName
            });

            // 이때 서버 컨트롤러 호출 됨.
            $scope.categoryBase.$save(function(response) {
                alert("등록완료");

                // Clear form fields
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
                alert("등록중 에러"+$scope.error);                
            });

            return false;   
        };


        // Remove existing Task
        $scope.removeCategory = function(index, id) {

            // alert(222);

            $http.post('/category/delete/'+ id)
            .success(function (data, status, headers) {
                
                alert("삭제 완료!");

                // $location.path('/tasks/addCategory');
                $location.path('tasks/create');
            })
            .error(function (data, status, header, config) {
                
                }    
            );
            
        };

          

        // Find a list of Tasks
        $scope.find = function() {
            $scope.tasks = Tasks.query();
        };

        // Find existing Task
        $scope.findOne = function() {
            // 상세랑 에디트 초기화.
            // alert( "상세랑 에디트 초기화.");

            /*
            $scope.task = new Tasks.states1({
                resources: []
            });
            */


            $scope.task = Tasks.states1.get({
            // $scope.task = $scope.task.get({
                taskId: $stateParams.taskId
            });
        };
    }
]);