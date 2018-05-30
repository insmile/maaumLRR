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
        if (scope.resultSchema.tasks[scope.lrpModel.taskPivot].answerType === 'draw-one' || scope.resultSchema.tasks[scope.lrpModel.taskPivot].answerType === 'draw-two')
            return true;
        else
            return false;
    }
    this.loadBackground = function(scope) {
        if (scope.pad !== undefined) {
            debugger;
            if (scope.lrpModel.selectedTask.answer == 'draw-one') {
                if (scope.lrpModel.selectedProblemSet[scope.stage].res.length > 0) {
                    scope.pad.setBackground(scope.lrpServer + 'uploads/' + scope.lrpModel.selectedProblemSet[scope.stage].res[0].value, 0);
                }
            }
        }
    };
    this.loadBackgroundGrading = function(scope, init = false) {
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