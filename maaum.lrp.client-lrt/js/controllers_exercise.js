angular.module('LRProject.controllers.exercise', ['LRProject.services'])
    .controller('Ctrl_PlayExercise', function($scope, $http, drawingPadUtil, problemUtil) {
        var trainingType = 'single'

        try {
            if ($scope.lrpModel.selectedProtocol.tasks.length > 1)
                trainingType = 'protocol';
        } catch (error) {
            return;
        }

        var recordeWebPath = '';

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

        $scope.resultSchema = {
            name: '',
            trainingType: trainingType,
            created: new Date(),
            updated: new Date(),
            patientID: $scope.lrpModel.selectedPatient !== undefined && $scope.lrpModel.selectedPatient._id !== undefined ? $scope.lrpModel.selectedPatient._id : undefined,
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
            $scope.loadDataGet({
                url: 'tasks/' + $scope.lrpModel.selectedProtocol.tasks[$scope.lrpModel.taskPivot].taskID._id,
                dataSetter: 'selectedTask',
                callback: $scope.loadDataPost,
                callbackArg: {
                    url: 'problems/list',
                    vParam: {
                        taskID: $scope.lrpModel.selectedProtocol.tasks[$scope.lrpModel.taskPivot].taskID._id,
                        setNum: $scope.lrpModel.selectedProtocol.tasks[$scope.lrpModel.taskPivot].setNum
                    },
                    dataSetter: 'selectedProblemSet',
                    callback: taskInit
                }
            });
        }

        var initEnd = false;

        function taskInit() {
            $scope.stage = 0;

            drawingPadUtil.loadBackground($scope);

            $scope.labels.push([]);
            $scope.graphData.push([]);
            $scope.graphData[$scope.lrpModel.taskPivot] = [];
            $scope.graphData[$scope.lrpModel.taskPivot].push([]);

            $scope.scoreModel = {};
            $scope.scoreModel.q = [];

            console.log("selectedProblemSet :");
            console.log($scope.lrpModel.selectedProblemSet);

            $scope.lrpModel.numOfPractice = problemUtil.countPractice($scope.lrpModel.selectedProblemSet);

            $scope.taskName.push($scope.lrpModel.selectedProtocol.tasks[$scope.lrpModel.taskPivot].taskID.name);

            $scope.resultSchema.tasks.push({
                refTask: $scope.lrpModel.selectedProtocol.tasks[$scope.lrpModel.taskPivot].taskID._id,
                answerType: $scope.lrpModel.selectedTask.answer,
                scoreType: $scope.lrpModel.selectedTask.score_type,
                maxScore: $scope.lrpModel.selectedTask.max_score,
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
                drawJson: null,
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

            if (custom30VisualReady) {
                Custom30Run();
            }
            if (custom34VisualReady) {
                Custom34Run();
            }
            if (custom35SoundReady) {
                Custom35Run();
            }
            if (custom04Ready) {
                Custom04Run();
            }
            if (custom08Ready) {
                Custom08Run();
            }

            initEnd = true;
        }

        $scope.stageNextCap = function() {
            $scope.saveLock = true;

            recordeWebPath = '';

            if ($scope.resultSchema.tasks[$scope.lrpModel.taskPivot].answerType !== 'select' && $scope.recordFlag) {
                upload();
            } else {
                $scope.stageNext();
            }
        };

        // CUSTOM 04 START

        var custom04Ready = false;
        var custom04positives = [];
        $scope.custom04list = [];
        $scope.custom04sel = [];
        var custom04idx = 0;
        var isPlaying = false;
        var audios;

        $scope.Custom04Ready = function() {
            custom04Ready = true;
            $scope.Custom04NextText = "선택 완료";
            custom04idx = 0;
            var custom04times = [];
            if (initEnd)
                Custom04Run();
        }

        $scope.Custom04Click = function(id) {
            if ($scope.custom04sel[id] === undefined)
                $scope.custom04sel[id] = true;
            else
                delete $scope.custom04sel[id];
        }

        function Custom04Run() {
            GenerateCustom04();
            $scope.custom04mode = "stage1";
            $scope.custom04url = "/img/partial/04_0.png"
            $scope.$apply();
            t = 5000;
            $scope.stage = -1;
            custom04positives.forEach(function(idx) {
                t = Custom04Show(idx, t);
            });
            setTimeout(function() {
                $scope.custom04mode = "stage2";
                $scope.$apply();
            }, t);
        }

        function Custom04Show(idx, time) {
            setTimeout(function() {
                $scope.stage++;
                $scope.custom04url = "/img/partial/04_" + idx.toString() + ".png";
                $scope.$apply();
            }, time);
            return time + 1000;
        }

        function Custom04Next(idx) {
            $scope.stage = idx;
            $scope.problem = custom04scenario[idx];
            $scope.startTime = Date.now();
            $scope.$apply();
        }

        $scope.Custom04Done = function() {
            var tp = custom04positives.map((x, i) => $scope.custom04sel[x]).filter((x) => x !== undefined).length;
            $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].numOfResponse = $scope.custom04sel.filter((x) => x).length;
            $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].numOfCorrect = tp;
            $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].numOfProblem = 15;
            $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].isChecked = true;
            $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].checkDate = Date.now();
            // save problem info and user response
            //var custom04positives = [];
            var custom04list = $scope.custom04list;
            var custom04response = $scope.custom04sel;
            $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].formJson = JSON.stringify({ custom04list, custom04positives, custom04response });
            $scope.stageEnd();
        }

        function swap(list, x, y) {
            temp = list[x];
            list[x] = list[y];
            list[y] = temp;
        }

        function shuffling(list, cnt) {
            for (i = 0; i < cnt; i++) {
                xIdx = Math.floor(Math.random() * list.length);
                yIdx = Math.floor(Math.random() * list.length);
                swap(list, xIdx, yIdx);
            }
        }

        function numberRange(start, end) {
            return new Array(end - start).fill().map((d, i) => i + start);
        }

        function pick(list, cnt) {
            return list.slice(0, cnt);
        }

        function GenerateCustom04() {
            $scope.custom04list = numberRange(1, 31);
            shuffling($scope.custom04list, 30);
            custom04positives = pick($scope.custom04list, 15);
            shuffling($scope.custom04list, 30);
        }

        // CUSTOM 04 END

        // CUSTOM 08 START

        var custom08Ready = false;
        var custom08positives = [];
        $scope.custom08sel = [];

        $scope.Custom08Ready = function() {
            $scope.Custom08NextText = "선택 완료";
            custom08Ready = true;
            if (initEnd)
                Custom08Run();
        }

        $scope.Custom08Click = function(id) {
            if ($scope.custom08sel[id] === undefined)
                $scope.custom08sel[id] = true;
            else
                delete $scope.custom08sel[id];
        }

        function Custom08Run() {
            GenerateCustom08();
        }

        $scope.Custom08Done = function() {
            var tp = custom08positives.map((x, i) => $scope.custom08sel[i] == custom08positives[i]).filter((x) => x == true).length
            $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].numOfResponse = 24;
            $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].numOfCorrect = tp;
            $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].numOfProblem = 24;
            $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].isChecked = true;
            $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].checkDate = Date.now();
            // save problem info and user response
            var custom08response = $scope.custom08sel;
            $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].formJson = JSON.stringify({ custom08positives, custom08response });
            $scope.stageEnd();
        }

        function GenerateCustom08() {
            custom08positives = [];
            custom08positives.push(false); //1
            custom08positives.push(true); //2
            custom08positives.push(false); //3
            custom08positives.push(false); //4
            custom08positives.push(true); //5
            custom08positives.push(false); //6
            custom08positives.push(true); //7
            custom08positives.push(true); //8
            custom08positives.push(true); //9
            custom08positives.push(false); //10
            custom08positives.push(false); //11
            custom08positives.push(true); //12
            custom08positives.push(true); //13
            custom08positives.push(false); //14
            custom08positives.push(true); //15
            custom08positives.push(false); //16
            custom08positives.push(false); //17
            custom08positives.push(false); //18
            custom08positives.push(true); //19
            custom08positives.push(true); //20
            custom08positives.push(false); //21
            custom08positives.push(true); //22
            custom08positives.push(false); //23
            custom08positives.push(true); //24
        }

        // CUSTOM 08 END

        // CUSTOM 30 START

        var custom30VisualReady = false;

        $scope.Custom30VisualReady = function() {
            custom30VisualReady = true;
            if (initEnd)
                Custom30Run();
        }

        var custom30Click = [];
        var custom30FalseCount = 0;
        var endFlag = false;

        $scope.Custom30Click = function(num) {
            if (custom30ClickBarrier)
                return;
            custom30Click.push(parseInt(num));
            var stageVal = $scope.lrpModel.selectedProblemSet[$scope.stage].res[0].value;
            var trueClick = stageVal.split(",").map((x) => parseInt(x));
            var a = trueClick;
            var b = custom30Click;
            var accept = b.map((x, i) => a[i] == x).reduce((x, y) => x && y);
            if (accept) {
                if (a.length == b.length) {
                    $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].selectTime = Date.now() - $scope.startTime;
                    $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].isCorrect = true;
                    $scope.stageNext();
                }
            } else {
                custom30FalseCount = custom30FalseCount + 1;
                $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].selectTime = Date.now() - $scope.startTime;
                $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].isCorrect = false;
                if (custom30FalseCount < 2)
                    $scope.stageNext();
                else {
                    endFlag = true;
                    $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].isChecked = true;
                    $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].checkDate = Date.now();
                    $scope.stageNext();
                }

            }
        }

        var custom30ClickBarrier = true;

        function Custom30Run() {
            custom30Click = [];
            custom30ClickBarrier = true;
            t = 200;
            stageVal = $scope.lrpModel.selectedProblemSet[$scope.stage].res[0].value;
            var l = stageVal.split(",").map((x) => "box" + x);
            l.forEach(function(box) {
                t = Blink30Visual(box, t);
            });
            setTimeout(function() {
                var audio = new Audio('/sound/hangout.mp3');
                audio.play();
                $scope.startTime = Date.now();
                custom30ClickBarrier = false;
            }, t);
        }

        function Blink30Visual(box, time) {
            box = document.getElementById(box);
            setTimeout(function() {
                box.style.opacity = 0;
                setTimeout(function() {
                    box.style.opacity = 1;
                }, 500);
            }, time);
            return time + 1000;
        }

        // CUSTOM 30 END

        // CUSTOM 34 START

        var custom34VisualReady = false;
        var custom34times = [];

        $scope.Custom34VisualReady = function() {
            custom34VisualReady = true;
            var custom34times = [];
            if (initEnd)
                Custom34Run();
        }

        $scope.Custom34Click = function() {
            $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].numOfResponse++;
            if ($scope.num == 3) {
                $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].numOfCorrect++;
                custom34times.push(Date.now() - $scope.startTime);
                console.log("OK");
            }
        }

        function Custom34Run() {
            $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].numOfProblem = 15;
            scenario = GenerateCustom34(120, 15);
            t = 1000;
            scenario.forEach((x, i) => {
                t = Custom34Next(x, i, t);
            });
            setTimeout(function() {
                debugger;
                if (custom34times.length > 0) {
                    $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].totalTime = custom34times.reduce((x, y) => x + y);
                    $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].meanTime = custom34times.reduce((x, y) => x + y) / custom34times.length;
                    $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].stdTime = getStdTime(custom34times, $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].meanTime);
                }
                $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].isChecked = true;
                $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].checkDate = Date.now();
                $scope.stageEnd(false);
            }, t + 1000);
        }

        function Custom34Next(num, idx, time) {
            setTimeout(function() {
                $scope.stage = idx;
                $scope.num = num;
                $scope.startTime = Date.now();
                $scope.$apply();
            }, time);
            return time + 500;
        }

        function GenerateCustom34(num, numOfTrue) {
            trueCnt = 0;
            s = [];
            trueIdxs = [];
            while (s.length < num) {
                n = Math.floor(Math.random() * 10 + 1);
                if (n == 3) continue;
                s.push(n);
            }
            while (trueIdxs.length < numOfTrue) {
                idx = Math.floor(Math.random() * 120);
                if (trueIdxs.find((x) => x == idx) === undefined) {
                    trueIdxs.push(idx);
                    s[idx] = 3;
                }
            }
            return s;
        }

        // CUSTOM 34 END

        // CUSTOM 35 START

        var custom35SoundReady = false;
        var custom35times = [];
        var custom35scenario = [];
        var custom35response = [];
        var custom35idx = 0;
        var isPlaying = false;
        var audios;

        $scope.Custom35SoundReady = function() {
            custom35SoundReady = true;
            $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].numOfProblem = 0;
            custom35idx = 0;
            var custom35times = [];
            if (initEnd)
                Custom35Run();
        }

        $scope.Custom35Click = function(same) {
            if (isPlaying) return;
            custom35response.push(same);
            $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].numOfResponse++;
            $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].numOfProblem++;
            var isSame = $scope.problem[0] == $scope.problem[1];
            var userSame = false;
            if (same == 1)
                userSame = true;
            if (isSame == userSame) {
                $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].numOfCorrect++;
            }
            custom35idx = custom35idx + 1;
            Custom35Next(custom35idx);
        }

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
                u
            }
            audios[0].play();
        }

        function Custom35Run() {
            custom35scenario = GenerateCustom35();
            Custom35Next(custom35idx);
        }

        function Custom35Next(idx) {
            if (audios !== undefined && audios[1] !== undefined) {
                audios[1].pause();
                audios[1].currentTime = 0;
            }
            if (idx >= custom35scenario.length) {
                // save problem info and user response
                $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].formJson = JSON.stringify({ custom35scenario, custom35response });
                $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].isChecked = true;
                $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].checkDate = Date.now();
                $scope.stageEnd();
            }
            $scope.stage = idx;
            $scope.problem = custom35scenario[idx];
            $scope.startTime = Date.now();
            $scope.$apply();
        }

        function GenerateCustom35() {
            sameCnt = 0;
            diffCnt = 0;
            problems = [];
            while (sameCnt + diffCnt < 30) {
                idx = Math.floor(Math.random() * 30 + 1);
                if (Math.random() > 0.5) { // same
                    if (sameCnt >= 15) continue;
                    if (problems.find((x) => x.toString() == [idx, idx].toString()) === undefined) {
                        problems.push([idx, idx]);
                        sameCnt = sameCnt + 1;
                    }
                } else { // diff
                    if (diffCnt >= 15) continue;
                    anotherIdx = Math.floor(Math.random() * 30 + 1);
                    if (idx == anotherIdx) continue;
                    idxs = [idx, anotherIdx].sort((x, y) => x - y)
                    if (problems.find((x) => x.toString() == idxs.toString()) === undefined) {
                        problems.push(idxs)
                        diffCnt = diffCnt + 1;
                    }
                }
            }
            return problems;
        }

        // CUSTOM 35 END

        $scope.stageNextForm = function(score, idx = 0) {
            $scope.scoreModel.q[idx] = { 's': score, 'c': 0 };
            $scope.stageNext();
        }

        $scope.stageNext = function(totalScore = undefined) {

            $scope.collectProblemStats(totalScore);

            $scope.stage++;

            if (!endFlag && $scope.stage < $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].numOfProblem) {
                $scope.prepareNextStage();
            } else {
                $scope.collectTaskStats();
                $scope.stageEnd();
            }

            $scope.saveLock = false;
        };

        $scope.prepareNextStage = function() {
            if (drawingPadUtil.isDrawing($scope)) {
                drawingPadUtil.loadBackground($scope);
            }

            if (custom30VisualReady) {
                Custom30Run();
            }

            $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].problems.push({
                refProblem: $scope.lrpModel.selectedProblemSet[$scope.stage]._id,
                recordFile: null,
                answerIdx: -1,
                selectTime: null,
                endTime: null,
                isCorrect: false,
                wrongType: null, //레코드 일때?
                isChecked: false,
                drawJson: null
            });

            $scope.selectImg = -1;

            $scope.selectFlag = false;
            $scope.recordFlag = false;
            $scope.onRecordFlag = false;

            $scope.startTime = Date.now();
        }

        $scope.collectProblemStats = function(totalScore = undefined) {
            if (totalScore !== undefined) {
                $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].totalScore = totalScore;
            }
            $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].endTime = Date.now() - $scope.startTime;
            $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].totalTime += $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].selectTime;

            if ($scope.resultSchema.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].selectTime !== null) {
                $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].numOfResponse++;
                if ($scope.resultSchema.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].isCorrect) $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].numOfCorrect++;
            }

            $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].recordFile = recordeWebPath;

            if (drawingPadUtil.isDrawing($scope)) {
                $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].totalTime += $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].endTime;
                $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].selectTime = $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].endTime;
                $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].numOfResponse++;
                scopeJson = JSON.stringify($scope.pad.toJSON());
                $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].drawJson = scopeJson;
                $scope.pad.clear();
            }

            if ($scope.resultSchema.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].isCorrect) {
                $scope.labels[$scope.lrpModel.taskPivot].push($scope.stage + 1);
            } else {
                $scope.labels[$scope.lrpModel.taskPivot].push('<' + ($scope.stage + 1) + '>');
            }

            $scope.graphData[$scope.lrpModel.taskPivot][0].push($scope.resultSchema.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].selectTime);
        }

        $scope.collectTaskStats = function() {
            $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].endDate = new Date();
            $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].meanTime = $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].totalTime / $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].numOfResponse;

            $scope.stage--;

            var temp = 0;
            $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].problems.forEach((p) => {
                if (p.selectTime !== null) {
                    temp = p.selectTime - $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].meanTime;
                    $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].stdTime += temp * temp;
                }
            });

            $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].stdTime = Math.sqrt($scope.resultSchema.tasks[$scope.lrpModel.taskPivot].stdTime / $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].numOfResponse);

            $scope.resultSchema.totalTime += $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].totalTime;
            $scope.resultSchema.numOfProblem += $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].numOfProblem;
            $scope.resultSchema.numOfCorrect += $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].numOfCorrect;
            $scope.resultSchema.numOfResponse += $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].numOfResponse;
        }

        function getStdTime(selectTimes, meanTime) {
            var temp = 0;
            var stdTime;
            selectTimes.forEach((t) => {
                temp = t - meanTime;
                stdTime += temp * temp;
            })
            return stdTime / selectTimes.length;
        }

        function GetShowPieChart() {
            if ($scope.lrpModel.selectedTask.answer === 'record') return false;
            if ($scope.lrpModel.selectedTask.answer === 'draw-one') return false;
            if ($scope.lrpModel.selectedTask.answer === 'draw-two') return false;
            if ($scope.lrpModel.selectedTask.answer === 'manual') return false;
            if ($scope.lrpModel.selectedTask.answer === 'ray') return false;
            return true;
        }

        function GetScoringFlag() {
            if ($scope.lrpModel.selectedTask.scoreType === '01clock') return true;
            if ($scope.lrpModel.selectedTask.scoreType === '02cube') return true;
            if ($scope.lrpModel.selectedTask.scoreType === '05ray') return true;
            if ($scope.lrpModel.selectedTask.scoreType === '10trail') return true;
            if ($scope.lrpModel.selectedTask.scoreType === '11trail') return true;
            if ($scope.lrpModel.selectedTask.scoreType === '12trail') return true;
            if ($scope.lrpModel.selectedTask.scoreType === '13trail') return true;
            return false;
        }

        function GetIsChecked() {
            return $scope.resultSchema.tasks.map((x) => x.isChecked).reduce((x, y) => x && y);
        }

        function GetCheckDate() {
            return $scope.resultSchema.tasks.map((x) => x.checkDate).reduce((x, y) => x > y ? x : y);
        }

        $scope.stageEnd = function(calcStat = true) {
            if ($scope.lrpModel.selectedTask.answer === 'forms') {
                // 설문조사 유형 저장
                $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].formJson = JSON.stringify($scope.scoreModel);
                $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].totalScore = problemUtil.getScore($scope.scoreModel);
                $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].isChecked = true;
                $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].checkDate = Date.now();
            }

            $scope.lrpModel.selectedTask.showPieChart = GetShowPieChart();
            $scope.scoringFlag = GetScoringFlag();
            $scope.resultSchema.isChecked = GetIsChecked();
            $scope.resultSchema.checkDate = GetCheckDate();

            if ($scope.labels[$scope.lrpModel.taskPivot].length > $scope.labels[$scope.labelMaxIdx].length) $scope.labelMaxIdx = $scope.lrpModel.taskPivot;

            $scope.lrpModel.taskPivot++;

            if ($scope.lrpModel.taskPivot < $scope.lrpModel.selectedProtocol.tasks.length) {
                start(); //taskInit();
            } else {
                if (calcStat) {
                    $scope.resultSchema.meanTime = $scope.resultSchema.totalTime / $scope.resultSchema.numOfResponse;

                    var j = 0;
                    for (i = 0; i < $scope.resultSchema.tasks.length; i++) {
                        $scope.resultSchema.tasks[i].problems.forEach((p) => {
                            if (p.selectTime !== null) {
                                temp = p.selectTime - $scope.resultSchema.meanTime;
                                $scope.resultSchema.stdTime += temp * temp;
                            }
                        });
                    }
                    $scope.resultSchema.stdTime = Math.sqrt($scope.resultSchema.stdTime / $scope.resultSchema.numOfResponse);

                    $scope.percent = $scope.resultSchema.numOfCorrect / $scope.resultSchema.numOfResponse;
                }

                $scope.resultSchema.endDate = new Date();
                $scope.resultSchema.updated = new Date();
                $scope.resultSchema.name = $scope.lrpModel.selectedPatient.name + ' ' + $scope.lrpModel.selectedProtocol.name + ' ' + $scope.resultSchema.endDate.getFullYear() + '-' + ($scope.resultSchema.endDate.getMonth() + 1) + '-' + ($scope.resultSchema.endDate.getDate()) + ' (' + $scope.resultSchema.created.getHours() + ':' + $scope.resultSchema.endDate.getMinutes() + ')';

                if ($scope.lrpModel.selectedHomework !== null) {
                    $scope.resultSchema.name += '- 과제';
                }

                $scope.endFlag = true;

                $scope.lrpModel.taskPivot = 0;

                console.log("result Schema");
                console.log($scope.resultSchema.tasks[$scope.lrpModel.taskPivot]);

                $scope.$apply();
            }
        }

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

            console.log($scope.resultSchema.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].isCorrect);
        };

        $scope.showAnswer = function() {
            //$scope.selectFlag = !$scope.selectFlag;
            $scope.selectFlag = true;
        };

        $scope.reportResult = function() {
            var vParam = {
                json: JSON.stringify($scope.resultSchema),
                patientID: $scope.lrpModel.selectedPatient._id
            };

            $scope.loadDataPost({
                url: 'results/insert/',
                vParam: vParam,
                callback: $scope.endExercise
            });
        };

        /**/
        //for Record
        //var fileName = cordova.file.externalApplicationStorageDirectory + "LRPRecord.3gp";
        var recordObj = {};
        recordObj.recordingPlayer = new Audio();

        function captureUserMedia(mediaConstraints, successCallback, errorCallback) {
            var isBlackBerry = !!(/BB10|BlackBerry/i.test(navigator.userAgent || ''));
            if (isBlackBerry && !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia)) {
                navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
                navigator.getUserMedia(mediaConstraints, successCallback, errorCallback);
                return;
            }

            navigator.mediaDevices.getUserMedia(mediaConstraints).then(successCallback).catch(errorCallback);
        }

        $scope.recordStart = function() {
            if ($scope.onRecordFlag) { return; }

            recordObj.recordingPlayer.pause();

            captureUserMedia({ audio: true }, function(audioStream) {
                recordObj.lrpStream = audioStream;
                //recordObj.recordingPlayer.srcObject = audioStream;

                var options = {
                    type: 'audio',
                    mimeType: 'audio/wav',
                    bufferSize: 0,
                    sampleRate: 44100,
                    leftChannel: false,
                    disableLogs: false,
                    recorderType: webrtcDetectedBrowser === 'edge' ? StereoAudioRecorder : null
                };

                recordObj.recordRTC = RecordRTC(audioStream, options);
                recordObj.recordRTC.startRecording();

                $scope.onRecordFlag = true;
                $scope.$apply();

            }, function(error) {
                console.log(error);
            });
        };

        $scope.recordStop = function() {
            if (!$scope.onRecordFlag) { return; }

            recordObj.recordRTC.stopRecording(function(audioURL) {
                recordObj.lrpStream.stop();

                recordObj.audioURL = audioURL;

                $scope.resultSchema.tasks[$scope.lrpModel.taskPivot].problems[$scope.stage].selectTime = Date.now() - $scope.startTime;

                $scope.onRecordFlag = false;
                $scope.recordFlag = true;
                $scope.$apply();
            });
        };

        $scope.recordPlay = function() {

            var audio = new Audio();
            audio.src = recordObj.audioURL;
            audio.controls = false;

            if (audio.paused) audio.play();

            //if(recordObj.recordingPlayer.paused) recordObj.recordingPlayer.play();
        };

        function win(r) {
            var obj = JSON.parse(r.response);
            recordeWebPath = obj['file']['name'];

            //$window.location.reload(true);
            $scope.stageNext();
            $scope.$apply();
        }

        function fail(error) {
            alert("녹음 내용이 서버에 저장되지 못했습니다. 계속해서 문제가 발생한다면 종료 후 재시도 해주십시오.");
            console.log("upload error source " + error.source);
            console.log("upload error target " + error.target);

            $scope.saveLock = false;
        }

        function upload() {
            var blob = recordObj.recordRTC.getBlob();
            blob.name = 'blob';
            //blob.lastModifiedDate = new Date();

            var fd = new FormData();
            fd.append("file", blob);

            var config = {
                withCredentials: false,
                headers: { 'Content-Type': undefined },
                transformRequest: angular.identity
            };

            config.params = fd;

            $http.post($scope.lrpServer + 'uploads/', fd, config)
                .then(function(r) {
                    recordeWebPath = r.data.file.name;
                    console.log(recordeWebPath);
                    //$window.location.reload(true);
                    $scope.stageNext();
                    //$scope.$apply();
                })
                .catch(function(error) {
                    alert("녹음 내용이 서버에 저장되지 못했습니다. 계속해서 문제가 발생한다면 종료 후 재시도 해주십시오.");
                    console.log(error);

                    $scope.saveLock = false;
                });

            /*
            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = fileName.substr(fileName.lastIndexOf('/') + 1);
            options.mimeType = "audio/3gp";

            //options.chunkedMode = false;
            //options.headers = {
            //    Connection: "close"
            //};

            var ft = new FileTransfer();
            ft.upload(fileName, encodeURI($scope.lrpServer + "uploads/"), win, fail, options, true);
            */

            //win(r)
            //$scope.stageNext();
            //$scope.$apply();
        }

        start(); //start
    });