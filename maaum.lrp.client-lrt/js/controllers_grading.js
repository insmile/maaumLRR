angular.module('LRProject.controllers.grading', ['LRProject.services'])
    .controller('Ctrl_PlayGrading', function($scope, $ionicSideMenuDelegate, $http, $state, $ionicPopup, $ionicPopover, drawingPadUtil, problemUtil, customUtil) {
        var recordeWebPath = '';
        $scope.lrpRecordMedia = null;

        $scope.stage = -1; //zeroindex

        $scope.selectFlag = true;
        $scope.endFlag = false;
        $scope.recordFlag = false;
        $scope.customFlag = customUtil.GetCustomFlagResult($scope);
        $scope.selectImg = -1; //zeroindex

        $scope.selectGrade = '';

        $scope.labels = [];
        $scope.graphData = [];

        $scope.lrpModel.taskPivot = -1;

        $scope.playLock = false;

        var orignalScoreModel = [];

        var setTemplate = function(url) {
            $scope.scoringFlag = true;
            return url;
        }

        $scope.loadScoring = function() {
            $scope.scoringFlag = false;
            var template = '';
            if ($scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].scoreType !== undefined) {
                switch ($scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].scoreType) {
                    case "01clock":
                        template = setTemplate('./templates/Popover_01Clock.html');
                        break;
                    case "02cube":
                        template = setTemplate('./templates/Popover_02Cube.html');
                        break;
                    case "05ray":
                        template = setTemplate('./templates/Popover_05Ray.html');
                        break;
                    case "10trail":
                        template = setTemplate('./templates/Popover_10Trail.html');
                        break;
                    case "11trail":
                        template = setTemplate('./templates/Popover_11Trail.html');
                        break;
                    case "12trail":
                        template = setTemplate('./templates/Popover_12Trail.html');
                        break;
                    case "13trail":
                        template = setTemplate('./templates/Popover_13Trail.html');
                        break;
                    default:
                        $scope.scoringFlag = false;
                }
            }
            if ($scope.scoringFlag) {
                if ($scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].formJson === undefined) {
                    $scope.scoreModel = {};
                    $scope.scoreModel.q = [];
                } else {
                    $scope.scoreModel = JSON.parse($scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].formJson);
                }
                originalScoreModel = $scope.scoreModel;
                $ionicPopover.fromTemplateUrl(template, {
                    scope: $scope
                }).then(function(popover) {
                    $scope.scorePopover = popover;
                });
            }
        }

        // CUSTOM 04 START

        $scope.custom04positives = [];
        $scope.custom04list = [];
        $scope.custom04sel = [];

        $scope.Custom04Ready = function() {
            $scope.custom04mode = "stage2";
            $scope.Custom04NextText = "확인";
            Custom04Load();
            $scope.$apply();
        }

        function Custom04Load() {
            var json = JSON.parse($scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].formJson);
            json.custom04positives.map((x) => $scope.custom04positives[x] = true);
            $scope.custom04list = json.custom04list;
            $scope.custom04sel = json.custom04response;
        }

        $scope.Custom04Done = function() {
            $scope.stageEnd();
        }

        // CUSTOM 04 END

        // CUSTOM 08 START

        $scope.custom08positives = [];
        $scope.custom08sel = [];

        $scope.Custom08Ready = function() {
            $scope.Custom04NextText = "확인";
            Custom08Load();
            $scope.$apply();
        }

        function Custom08Load() {
            var json = JSON.parse($scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].formJson);
            $scope.custom08positives = json.custom08positives;
            $scope.custom08sel = json.custom08response;
        }

        $scope.Custom08Done = function() {
            $scope.stageEnd();
        }

        // CUSTOM 08 END

        // CUSTOM 35 START

        var custom35scenario = [];
        var custom35response = [];
        var audios;
        var isPlaying = false;

        $scope.Custom35Play = function() {
            if (isPlaying) return;
            isPlaying = true;
            audios = $scope.problem.map((x) => new Audio('/sound/35_' + x.toString() + '.m4a'));
            audios[0].onended = function() {
                setTimeout(() => {
                    audios[1].play();
                    isPlaying = false;
                }, 1500);
            }
            audios[1].onended = function() {
                $scope.startTime = Date.now();
            }
            audios[0].play();
        }

        $scope.Custom35SoundReady = function() {
            custom35idx = 0;
            var custom35times = [];
            $scope.custom35check = true;
            Custom35Load();
            Custom35Next($scope.stage);
        }

        function Custom35Next(idx) {
            if (audios !== undefined && audios[1] !== undefined) {
                audios[1].pause();
                audios[1].currentTime = 0;
            }
            $scope.problem = custom35scenario[idx];
            $scope.tp = false;
            $scope.tn = false;
            $scope.fp = false;
            $scope.fn = false;
            var same = $scope.problem[0] === $scope.problem[1];
            var userResponse = custom35response[idx] === 1 ? true : false;
            if (same === true && userResponse === true)
                $scope.tp = true;
            if (same === true && userResponse === false)
                $scope.tn = true;
            if (same === false && userResponse === false)
                $scope.fn = true;
            if (same === false && userResponse === true)
                $scope.fp = true;
            if (same === userResponse) {
                $scope.custom35result = "정답여부 : 정답";
            } else {
                $scope.custom35result = "정답여부 : 오답";
            }
            $scope.$apply();
        }

        function Custom35Load() {
            var json = JSON.parse($scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].formJson);
            custom35response = json.custom35response;
            custom35scenario = json.custom35scenario;
        }

        // CUSTOM 35 END

        $scope.openScoring = function() {
            try {
                if ($scope.scoringFlag)
                    $scope.scorePopover.show(window.event);
            } catch (error) {
                console.log(error);
            }
        }

        $scope.saveScoring = function() {
            try {
                if ($scope.scoringFlag) {
                    var confirmPopup = $ionicPopup.confirm({
                        title: '확인',
                        template: '채점표를 저장하시겠습니까?'
                    });
                    confirmPopup.then(function(res) {
                        if (res) { //저장
                            $scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].formJson = JSON.stringify($scope.scoreModel);
                            $scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].totalScore = problemUtil.getScore($scope.scoreModel);
                            $scope.lrpModel.selectedResult.isChecked = true;
                            $scope.scorePopover.hide();
                        } else { //취소
                            $scope.scorePopover.hide();
                        }
                    });
                }
            } catch (error) {
                console.log(error);
            }
        }

        $scope.loadJsonForm = function() {
            $scope.scoringFlag = true;
            $scope.scoreModel = JSON.parse($scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].formJson);
        }

        $scope.saveJsonForm = function() {
            $scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].formJson = JSON.stringify($scope.scoreModel);
            $scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].totalScore = problemUtil.getScore($scope.scoreModel);
        }

        $scope.initStage = function() {
            debugger;
            try {
                $scope.lrpModel.taskPivot++;

                if ($scope.lrpModel.taskPivot < $scope.lrpModel.selectedResult.tasks.length) {

                    $scope.stage = -1;

                    if ($scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].answerType === 'visual30') {
                        $scope.stage = 9999;
                    } else if ($scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].answerType === 'visual34') {
                        $scope.stage = 9999;
                    }

                    $scope.labels.push([]);
                    $scope.graphData.push([]);
                    $scope.graphData[$scope.lrpModel.taskPivot].push([]);

                    $scope.lrpModel.numOfPractice = problemUtil.countGradePractice($scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].problems);

                    $scope.loadScoring();
                    if ($scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].answerType == 'forms') {
                        $scope.loadJsonForm();
                    }
                    $scope.stageNext();
                } else {
                    $scope.lrpModel.taskPivot = 0;
                    $scope.endFlag = true;
                }
            } catch (error) {
                return;
            }
        };

        $scope.stageNextForm = function(score, idx = 0) {
            $scope.scoreModel.q[idx].s = score;
            $scope.stageNext();
        }

        function DrawNext() {
            try {
                if ($scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].answerType === 'draw-one') {
                    //$scope.pad.clear();
                    $scope.pad.loadJSON(JSON.parse($scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].drawJson));
                    drawingPadUtil.loadBackgroundGrading($scope);
                }
                if ($scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].answerType === 'draw-two') {
                    //$scope.pad.clear();
                    $scope.pad.loadJSON(JSON.parse($scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].drawJson));
                }
            } catch (error) {
                console.log(error);
            }
        }

        function CustomNext() {
            if ($scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].answerType === 'sound') {
                Custom35Next($scope.stage);
            }
        }

        $scope.stageNext = function(totalScore) {
            $scope.stage++;

            if (totalScore !== undefined) {
                $scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].totalScore = totalScore;
            }

            //console.log($scope.stage);

            DrawNext();

            console.log($scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot]);


            if ($scope.stage < $scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].numOfProblem) {
                CustomNext();

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
                $scope.stageEnd();
            }

            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };

        $scope.stageEnd = function() {
            if ($scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].answerType == 'forms') {
                $scope.saveJsonForm();
            }
            $scope.initStage();
        }

        $scope.reportResult = function() {
            if ($scope.lrpModel.userData.roles === 'patient') {
                $scope.endExercise();
                return;
            }
            $scope.lrpModel.selectedResult.isChecked = true;
            $scope.lrpModel.selectedResult.checkUserID = $scope.lrpModel.userData._id;
            $scope.lrpModel.selectedResult.checkDate = new Date();

            var vParam = {
                json: JSON.stringify($scope.lrpModel.selectedResult),
                patientID: $scope.lrpModel.selectedPatient._id
            };

            //console.log($scope.lrpModel.selectedResult);

            $scope.loadDataPost({
                url: 'results/' + $scope.lrpModel.selectedResult._id,
                vParam: vParam,
                callback: $scope.endExercise
            });
        };

        /**/
        //var fileName = cordova.file.externalApplicationStorageDirectory + "LRPRecord_.3gp";

        $scope.recordPlay = function() {
            //$scope.playLock = true;

            console.log($scope.lrpServer + 'uploads/' + $scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].recordFile);

            var audio = new Audio();
            audio.src = $scope.lrpServer + 'uploads/' + $scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].recordFile;
            audio.controls = false;

            audio.onended = function() {
                audio.pause();

                //$scope.playLock = false;
            };

            if (audio.paused) audio.play();

            /*
            console.log($scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage]);

            var ft = new FileTransfer();
            ft.download($scope.lrpServer + 'uploads/' + $scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].recordFile, fileName,
                function(success) {
                    play();
                },
                function(error) {
                    alert("녹음 파일을 불러오지 못했습니다. 계속해서 문제가 발생한다면 종료 후 재시도 해주십시오.");
                }, true);
                */
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

.controller('Ctrl_Page_Report', function($scope) {

    $scope.reportPrint = function() {
        window.print();
    }

    $scope.endReport = function() {
        $scope.lrpModel.isMenuOff = true;
        $scope.menuActivate($scope.lrpModel.backState);
    };

});