var app = angular.module('LRProject.services', []);

app.service('problemUtil', function() {
    this.countPractice = function(problemSet) {
        return problemSet.filter(function(p) {
            return p.practice;
        }).length;
    };
    this.countGradePractice = function(problemSet) {
        return problemSet.filter(function(p) {
            return p.refProblem.practice;
        }).length;
    };
    this.getScore = function(scoreModel) {
        var sum = 0;
        angular.forEach(scoreModel.q, function(v, k) {
            if (v !== null)
                sum = sum + parseFloat(v.s);
        });
        return sum;
    }
})

app.service('customUtil', function() {
    this.GetCustomFlagResult = function(scope) {
        if (scope.lrpModel.selectedResult.tasks[0].answerType === 'sound') {
            return true;
        } else if (scope.lrpModel.selectedResult.tasks[0].answerType === 'pick15') {
            return true;
        } else if (scope.lrpModel.selectedResult.tasks[0].answerType === 'visual30') {
            return true;
        } else if (scope.lrpModel.selectedResult.tasks[0].answerType === 'visual34') {
            return true;
        } else if (scope.lrpModel.selectedResult.tasks[0].answerType === 'pick08') {
            return true;
        }
        return false;
    }
})

app.service('drawingPadUtil', function() {
    this.isDrawing = function(scope) {
        if (scope.resultSchema.tasks[scope.lrpModel.taskPivot].answerType === 'draw-one' || scope.resultSchema.tasks[scope.lrpModel.taskPivot].answerType === 'draw-two'|| scope.resultSchema.tasks[scope.lrpModel.taskPivot].answerType === 'draw-one2')
            return true;
        else
            return false;
    }
    this.loadBackground = function(scope) {
        if (scope.pad !== undefined) {
            // debugger;
            // alert("setBackground1");
            if (scope.lrpModel.selectedTask.answer == 'draw-one') {
                if (scope.lrpModel.selectedProblemSet[scope.stage].res.length > 0) {
                    scope.pad.setBackground(scope.lrpServer + 'uploads/' + scope.lrpModel.selectedProblemSet[scope.stage].res[0].value, 0);
                }
            }

            // alert("make pad background");

            if (scope.lrpModel.selectedTask.answer == 'draw-one2') {
                
                var note = scope.lrpModel.selectedProblemSet[scope.stage].res[0].note;
                
                var noteJson = JSON.parse(note);

                scope.shape_count = note.shapeCount; // 도형 개수.

                if (scope.lrpModel.selectedProblemSet[scope.stage].res.length > 0) {
                    scope.pad.setBackground(scope.lrpServer + 'uploads/' + scope.lrpModel.selectedProblemSet[scope.stage].res[0].value, 0);
                    scope.pad.makeDraw2(noteJson);
                }
            }

        }
    };
    this.loadBackgroundGrading = function(scope, init = false) {
        //alert("setBackground2");

        if (init) {
            if (scope.lrpModel.selectedResult.tasks[scope.lrpModel.taskPivot].problems[0].refProblem.res.length > 0) {
                scope.pad.setBackground(scope.lrpServer + 'uploads/' + scope.lrpModel.selectedResult.tasks[scope.lrpModel.taskPivot].problems[0].refProblem.res[0].value, 0);
            }
        } else {
            if (scope.lrpModel.selectedResult.tasks[scope.lrpModel.taskPivot].problems[0].refProblem.res.length > 0) {
                scope.pad.setBackground(scope.lrpServer + 'uploads/' + scope.lrpModel.selectedResult.tasks[scope.lrpModel.taskPivot].problems[scope.stage].refProblem.res[0].value, 0);
            }
        }
    };
})