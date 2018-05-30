angular.module('LRProject.controllers.offline', ['LRProject.services'])

.controller('Ctrl_PlayExerciseOffline', function($scope) {
        $scope.stage = 0;
        $scope.percent = 0;

        $scope.selectImg = -1; //zeroindex

        $scope.selectFlag = false;
        $scope.recordFlag = false;
        $scope.onRecordFlag = false;
        $scope.saveLock = false;

        $scope.endFlag = false;

        $scope.lrpRecordMedia = null;

        $scope.startTime = null;
        $scope.selectTime = null;

        $scope.taskName = [];

        //for Result Graph
        $scope.labels = [];
        $scope.labelMaxIdx = 0;
        $scope.graphData = [];

        //$scope.fsURL = cordova.file.externalDataDirectory + $scope.lrpModel.selectedProtocol._id + '/';

        $scope.resultSchema = {
            name: '',
            trainingType: ($scope.lrpModel.selectedProtocol.tasks.length > 1) ? 'protocol' : 'single',
            created: new Date(),
            updated: new Date(),
            patientID: $scope.lrpModel.selectedPatient._id,
            startDate: new Date(),
            endDate: null,
            totalTime: 0,
            meanTime: 0,
            stdTime: 0,
            numOfProblem: 0,
            numOfCorrect: 0,
            numOfResponse: 0,
            isChecked: false,
            checkDate: null,
            checkUserID: null,
            tasks: []
        };

        if ($scope.lrpModel.selectedProtocol.tasks.length > 1) $scope.resultSchema.refProtocol = $scope.lrpModel.selectedProtocol._id;
        /*else if ($scope.lrpModel.selectedProtocol.tasks.length > 1) {
         $scope.resultSchema.refTask = $scope.lrpModel.selectedTask._id;
         $scope.resultSchema.setNum = $scope.lrpModel.selectedTask.setNum;
         }*/

        if ($scope.lrpModel.selectedProtocol.refTakehome !== null) $scope.resultSchema.refTakehome = $scope.lrpModel.selectedProtocol.refTakehome;

        function start() {
            console.log("tasks : " + $scope.lrpModel.selectedProtocol.tasks);

            $scope.lrpModel.selectedProblemSet = $scope.lrpModel.selectedProtocol.tasks[$scope.lrpModel.taskPivot].problems;

            taskInit();
        }

        function taskInit() {
            $scope.stage = 0;

            $scope.labels.push([]);
            $scope.graphData.push([]);
            $scope.graphData[$scope.lrpModel.taskPivot] = [];
            $scope.graphData[$scope.lrpModel.taskPivot].push([]);

            $scope.taskName.push($scope.lrpModel.selectedProtocol.tasks[$scope.lrpModel.taskPivot].taskID.name);

            $scope.resultSchema.tasks.push({
                refTask: $scope.lrpModel.selectedProtocol.tasks[$scope.lrpModel.taskPivot].taskID._id,
                answerType: $scope.lrpModel.selectedProtocol.tasks[$scope.lrpModel.taskPivot].taskID.answer,
                setID: $scope.lrpModel.selectedProtocol.tasks[$scope.lrpModel.taskPivot].setNum,

                startDate: new Date(),
                endDate: null,
                totalTime: 0,
                meanTime: 0,
                stdTime: 0,

                numOfProblem: $scope.lrpModel.selectedProblemSet.length,
                numOfCorrect: 0,
                numOfResponse: 0,
                problems: []
            });

            //$scope.lrpModel.selectedProtocol.tasks[$scope.lrpModel.taskPivot].problems = $scope.lrpModel.selectedProblemSet;

            $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].problems.push({
                refProblem: $scope.lrpModel.selectedProblemSet[$scope.stage]._id,
                recordFile: null,
                darwJson: null,
                answerIdx: -1,
                selectTime: null,
                endTime: null,
                isCorrect: false,
                wrongType: 0, //레코드 일때?
                isChecked: false
            });

            $scope.selectImg = -1;

            $scope.selectFlag = false;
            $scope.recordFlag = false;
            $scope.onRecordFlag = false;
            $scope.savelock = false;

            $scope.startTime = Date.now();

            $scope.$apply();
        }

        $scope.stageNext = function(totalScore) {
            if (totalScore !== undefined) {
                $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].totalScore = totalScore;
            }
            $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].endTime = Date.now() - $scope.startTime;
            $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].totalTime += $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].selectTime;

            if ($scope.resultSchema.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].selectTime !== null) {
                $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].numOfResponse++;
                if ($scope.resultSchema.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].isCorrect) $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].numOfCorrect++;
            }

            $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].recordFile = fileName;

            if ($scope.resultSchema.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].isCorrect) {
                $scope.labels[$scope.lrpModel.taskPivot].push($scope.stage + 1);
            } else {
                $scope.labels[$scope.lrpModel.taskPivot].push('<' + ($scope.stage + 1) + '>');
            }

            $scope.graphData[$scope.lrpModel.taskPivot][0].push($scope.resultSchema.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].selectTime);

            $scope.stage++;

            if ($scope.stage < $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].numOfProblem) {
                $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].problems.push({
                    refProblem: $scope.lrpModel.selectedProblemSet[$scope.stage]._id,
                    recordFile: null,
                    drawJson: null,
                    answerIdx: -1,
                    selectTime: null,
                    endTime: null,
                    isCorrect: false,
                    wrongType: null, //레코드 일때?
                    isChecked: false
                });

                $scope.selectImg = -1;

                $scope.selectFlag = false;
                $scope.recordFlag = false;
                $scope.onRecordFlag = false;

                $scope.startTime = Date.now();
            } else {
                $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].endDate = new Date();
                $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].meanTime = $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].totalTime / $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].numOfResponse;

                $scope.stage--;

                var temp = 0;
                for (var i = 0; i < $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].numOfProblem; i++) {
                    if ($scope.resultSchema.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].selectTime !== null) {
                        temp = $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].problems[i].selectTime - $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].meanTime;
                        $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].stdTime += temp * temp;
                    }
                }

                $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].stdTime = Math.sqrt($scope.resultSchema.tasks[$scope.lrpModel.taskPivot].stdTime / $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].numOfResponse);

                $scope.resultSchema.totalTime += $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].totalTime;
                $scope.resultSchema.numOfProblem += $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].numOfProblem;
                $scope.resultSchema.numOfCorrect += $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].numOfCorrect;
                $scope.resultSchema.numOfResponse += $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].numOfResponse;

                if ($scope.labels[$scope.lrpModel.taskPivot].length > $scope.labels[$scope.labelMaxIdx].length) $scope.labelMaxIdx = $scope.lrpModel.taskPivot;

                $scope.lrpModel.taskPivot++;

                if ($scope.lrpModel.taskPivot < $scope.lrpModel.selectedProtocol.tasks.length) {
                    start(); //taskInit();
                } else {
                    $scope.resultSchema.endDate = new Date();
                    $scope.resultSchema.updated = new Date();
                    $scope.resultSchema.name = $scope.lrpModel.selectedPatient.name + ' ' + $scope.lrpModel.selectedProtocol.name + ' ' + $scope.resultSchema.endDate.getFullYear() + '-' + ($scope.resultSchema.endDate.getMonth() + 1) + '-' + ($scope.resultSchema.endDate.getDate()) + ' (' + $scope.resultSchema.created.getHours() + ':' + $scope.resultSchema.endDate.getMinutes() + ')';

                    $scope.resultSchema.name += '- 오프라인';

                    $scope.resultSchema.meanTime = $scope.resultSchema.totalTime / $scope.resultSchema.numOfResponse;

                    var j = 0;
                    for (i = 0; i < $scope.resultSchema.tasks.length; i++) {
                        for (j = 0; j < $scope.resultSchema.tasks[i].numOfProblem; j++) {
                            if ($scope.resultSchema.tasks[i].problems[j].selectTime !== null) {
                                temp = $scope.resultSchema.tasks[i].problems[j].selectTime - $scope.resultSchema.meanTime;
                                $scope.resultSchema.stdTime += temp * temp;
                            }
                        }
                    }
                    $scope.resultSchema.stdTime = Math.sqrt($scope.resultSchema.stdTime / $scope.resultSchema.numOfResponse);

                    $scope.endFlag = true;

                    $scope.lrpModel.selectedProtocol.isDone = true;

                    $scope.lrpModel.taskPivot = 0;
                    $scope.percent = $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].numOfCorrect / $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].numOfResponse;
                }
            }

            $scope.saveLock = false;
        };

        $scope.selectAnswer = function(idx) {
            if ($scope.selectFlag && $scope.lrpRecordMedia.userData.roles === 'patient') return;

            $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].selectTime = Date.now() - $scope.startTime;

            $scope.selectImg = idx;
            $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].answerIdx = idx;

            if ($scope.lrpModel.selectedProblemSet[$scope.stage].res.length === 1 && $scope.lrpModel.selectedProblemSet[$scope.stage].res[0].resType === 'bool') {
                $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].isCorrect = ($scope.lrpModel.selectedProblemSet[$scope.stage].res[0].isAnswer ? idx === 1 : idx === 2);
            } else {
                $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].isCorrect = $scope.lrpModel.selectedProblemSet[$scope.stage].res[idx].isAnswer;
            }
        };

        $scope.showAnswer = function() {
            //$scope.selectFlag = !$scope.selectFlag;
            $scope.selectFlag = true;
        };

        $scope.reportResult = function() {
            //window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, onGetDirForResult, onFail);
        };

        function onFail(error) {
            console.log(error);
        }

        function onGetDirForResult(dir) {
            dir.getDirectory($scope.lrpModel.selectedProtocol._id, { create: false }, onGetDirForResultNext, onFail);
        }

        function onGetDirForResultNext(dir) {
            dir.getFile($scope.lrpModel.selectedProtocol._id + ".txt", { create: true, exclusive: false }, onGetFileHomework, onFail);
            dir.getFile($scope.lrpModel.selectedProtocol._id + "_result.txt", { create: true, exclusive: false }, onGetFileResult, onFail);
        }

        function onGetFileHomework(file) {
            file.createWriter(function(fileWriter) {
                fileWriter.write(JSON.stringify($scope.lrpModel.selectedProtocol));
            }, onFail);
        }

        function onGetFileResult(file) {
            file.createWriter(function(fileWriter) {
                fileWriter.write(JSON.stringify($scope.resultSchema));
                $scope.endExercise();
            }, onFail);
        }

        /**/
        //for Record
        //var fileName = cordova.file.externalApplicationStorageDirectory + "LRPRecord.3gp";
        $scope.recordStart = function() {
            if ($scope.onRecordFlag) { return; }

            $scope.onRecordFlag = true;

            /*
            fileName = $scope.fsURL + $scope.lrpModel.selectedProtocol.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage]._id + '.mp3';
            $scope.lrpRecordMedia = new Media(fileName,
                // success callback
                function() {
                    console.log("playAudio():Audio Success");
                },
                // error callback
                function(err) {
                    console.log("playAudio():Audio Error: "+err);
                });

            $scope.lrpRecordMedia.setVolume('1.0');
            $scope.lrpRecordMedia.startRecord();
            */
        };

        $scope.recordStop = function() {
            if (!$scope.onRecordFlag) { return; }

            $scope.onRecordFlag = false;

            //$scope.lrpRecordMedia.stopRecord();

            $scope.recordFlag = true;

            $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].selectTime = Date.now() - $scope.startTime;
        };

        $scope.recordPlay = function() {
            if ($scope.onRecordFlag) { return; }

            $scope.onRecordFlag = true;

            /*
            $scope.lrpRecordMedia = new Media(fileName,
                // success callback
                function() {
                    console.log("playAudio():Audio Success");
                },
                // error callback
                function(err) {
                    console.log("playAudio():Audio Error: "+err);
                });

            $scope.lrpRecordMedia.setVolume('1.0');
            $scope.lrpRecordMedia.play();
            */

            $scope.onRecordFlag = false;
        };

        start(); //start
    })
    .filter('sum', function() {
        return function(data) {
            if (angular.isUndefined(data))
                return 0;
            var sum = 0;

            angular.forEach(data, function(v) {
                sum = sum + parseFloat(v);
            });
            return sum;
        }
    })
    .filter('sumOfValue', function() {
        return function(data, key) {
            if (angular.isUndefined(data) || angular.isUndefined(key))
                return 0;
            var sum = 0;

            angular.forEach(data, function(v, k) {
                if (v !== null)
                    sum = sum + parseFloat(v[key]);
            });
            return sum;
        }
    }).filter('totalSumPriceQty', function() {
        return function(data, key1, key2) {
            if (angular.isUndefined(data) || angular.isUndefined(key1) || angular.isUndefined(key2))
                return 0;

            var sum = 0;
            angular.forEach(data, function(v, k) {
                sum = sum + (parseInt(v[key1]) * parseInt(v[key2]));
            });
            return sum;
        }
    })

.controller('Ctrl_PlayGradingOffline', function($scope) {
    var recordeWebPath = '';
    $scope.lrpRecordMedia = null;

    $scope.stage = -1; //zeroindex

    $scope.selectFlag = true;
    $scope.endFlag = false;
    $scope.recordFlag = false;
    $scope.selectImg = -1; //zeroindex

    $scope.selectGrade = '';

    $scope.labels = [];
    $scope.graphData = [];

    $scope.lrpModel.taskPivot = -1;

    $scope.playLock = false;

    //$scope.fsURL = cordova.file.externalDataDirectory + $scope.lrpModel.selectedProtocol._id + '/';

    $scope.initStage = function() {
        $scope.lrpModel.taskPivot++;

        console.log($scope.lrpModel.selectedProtocol);
        console.log($scope.lrpModel.selectedResult);

        if ($scope.lrpModel.taskPivot < $scope.lrpModel.selectedResult.tasks.length) {

            $scope.stage = -1;
            $scope.labels.push([]);
            $scope.graphData.push([]);
            $scope.graphData[$scope.lrpModel.taskPivot].push([]);

            $scope.stageNext();
        } else {
            $scope.lrpModel.taskPivot = 0;
            $scope.endFlag = true;
        }
    };

    $scope.stageNext = function() {
        $scope.stage++;

        if ($scope.stage < $scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].numOfProblem) {
            $scope.selectImg = $scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].answerIdx;

            if ($scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].isCorrect) {
                $scope.labels[$scope.lrpModel.taskPivot].push($scope.stage + 1);
            } else {
                $scope.labels[$scope.lrpModel.taskPivot].push('<' + ($scope.stage + 1) + '>');
            }
            $scope.graphData[$scope.lrpModel.taskPivot][0].push($scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].selectTime);

            $scope.recordFlag = true;

            if ($scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].answerType === 'record' && !$scope.lrpModel.selectedResult.isChecked) {
                $scope.recordFlag = false;
            } else if ($scope.lrpModel.selectedResult.isChecked && $scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].answerType === 'record' && $scope.lrpModel.selectedResult.isChecked) {
                $scope.setGrade($scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].wrongType, true);
            }
        } else {


            $scope.initStage();
        }

        $scope.$apply();
    };

    $scope.reportResult = function() {
        $scope.endExercise();
    };

    /**/
    var fileName = '';

    $scope.recordPlay = function() {
        //$scope.playLock = true;

        //fileName = $scope.fsURL + $scope.lrpModel.selectedProtocol.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage]._id + '.mp3';
        //fileName = $scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].recordFile;

        //play();
    };

    function play() {
        /*
        $scope.lrpRecordMedia = new Media(fileName,
            // success callback
            function() {
                console.log("playAudio():Audio Success");
            },
            // error callback
            function(err) {
                console.log("playAudio():Audio Error: "+err);
            });

        $scope.lrpRecordMedia.setVolume('1.0');
        $scope.lrpRecordMedia.play();
        */

        $scope.playLock = false;
        $scope.$apply();
    }

    $scope.setGrade = function(grade, tail) {
        if (tail !== undefined && tail === true);
        else {
            if ($scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].isCorrect) {
                $scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].numOfCorrect--;
                $scope.lrpModel.selectedResult.numOfCorrect--;
            }
        }

        $scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].isChecked = true;

        switch (grade) {
            case 0:
                $scope.selectGrade = '정답';
                if (tail !== undefined && tail === true) return;
                $scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].isCorrect = true;
                $scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].wrongType = 0;
                $scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].numOfCorrect++;
                $scope.lrpModel.selectedResult.numOfCorrect++;
                break;

            case 1:
                $scope.selectGrade = '의미 단서';
                if (tail !== undefined && tail === true) return;
                $scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].isCorrect = false;
                $scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].wrongType = 1;
                break;

            case 2:
                $scope.selectGrade = '음절 단서';
                if (tail !== undefined && tail === true) return;
                $scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].isCorrect = false;
                $scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].wrongType = 2;
                break;

            case 3:
                $scope.selectGrade = '오답';
                if (tail !== undefined && tail === true) return;
                $scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].isCorrect = false;
                $scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].wrongType = 3;
                break;

            default:
                $scope.selectGrade = '';
                return;
        }

        $scope.recordFlag = true;

        if ($scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].isCorrect) {
            $scope.labels[$scope.lrpModel.taskPivot][$scope.stage] = $scope.stage + 1;
            $scope.graphData[$scope.lrpModel.taskPivot][1][$scope.stage] = 0;
        } else {
            $scope.labels[$scope.lrpModel.taskPivot][$scope.stage] = ('<' + ($scope.stage + 1) + '>');
            $scope.graphData[$scope.lrpModel.taskPivot][1][$scope.stage] = ($scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].selectTime);
        }
        $scope.graphData[$scope.lrpModel.taskPivot][0][$scope.stage] = ($scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].selectTime);
    };

    $scope.initStage();
})