'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Problem = mongoose.model('Problem'),
    Center = mongoose.model('Center'),
    Task = mongoose.model('Task'),
<<<<<<< HEAD
    MyTaskCategory = mongoose.model('MyTaskCategory'),
=======
>>>>>>> 45e3dfab886cba0e59c30f547b6998c89a9f0cc9
    _ = require('lodash');

/**
 * Create a Problem
 */
exports.create = function(req, res) {
    var problem = new Problem(req.body);
    problem.user = req.user;

    Task.findById(problem.refTask).exec(function(err, task) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            problem.taskCategory = task.category;
            problem.taskName = task.name;

            problem.save(function(err) {
                if (err) {
                    console.log(err);
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(problem);
                    return;
                }
            });
        }
    });
};

<<<<<<< HEAD

=======
>>>>>>> 45e3dfab886cba0e59c30f547b6998c89a9f0cc9
exports.DT = function getData(req, res) {
    getTaskList(req, res, getData2);
};

<<<<<<< HEAD

// 업무 가테고리 조회.
function getData2(req, res, taskList) {

    MyTaskCategory.find().exec(function(err, taskCategory) {
        if (taskCategory === null) return [];
        if (taskCategory === undefined) return [];

        console.log("problem 조회 2차 = 카테고리 먼저 조회.");
        // console.log("task 조회 1차 result = "+JSON.stringify(taskCategory));

        // callback(req, res, taskCategory);
        getData3(req, res, taskList, taskCategory);
    });
}


function getData3(req, res, taskList, taskCategory) {
    // 3
    console.log("3차 get problem DATA====");
    // console.log("3차 get taskCategory DATA===="+JSON.stringify(taskCategory));
    
    var conditions = {};
    conditions.refTask = { $in: taskList };

    // console.log("getData2====req.taskTypeSearch = "+ req.query.taskTypeSearch);

    if (req.query.taskTypeSearch != null && req.query.taskTypeSearch != undefined && req.query.taskTypeSearch != 'ALL') {
        //console.log("getData3====req.taskTypeSearch 세팅. = "+ req.query.taskTypeSearch);
        conditions.taskType = req.query.taskTypeSearch;    
    }

    // console.log("getData4==== conditions.type = "+ conditions.taskType);


    Problem.dataTable(req.query, { 'conditions': conditions }, function(err, data) {
        if (err) console.log(err);
        
        console.log( "문제 조회 결과 : "+ JSON.stringify(data) );
        
        // taskCategory
        // console.log( "문제 조회 결과 :data.data.length "+ data.data.length );        

        for(var i = 0; i < data.data.length;i++) {
            if(data.data[i].taskCategory !== undefined) {
 
                 for(var j = 0; j < taskCategory.length; j++) {
 
                     // console.log("비교 시작. data.data[i].category ="+data.data[i].category+", taskList[j]._id="+taskList[j]._id);
                     
                     var com1 = data.data[i].taskCategory + ""; // 스트링으로 인식 안대서 replace하면 에러뜸. 가끔 공백 붙어있어서 같아도 같다고 인식 안함. 그래서 그냥 화면에 아이디 뜸. 그래서 일부러 "" 붙여줌.
                     var com2 = taskCategory[j]._id + "";
                     
                     if(com1 !==null && com1 !==undefined){
                         com1 = com1.replace(/^\s*|\s*$/g,''); 
 
                     }
 
                     if(com2 !==null && com2 !==undefined){
                         com2 = com2.replace(/^\s*|\s*$/g,'');  
                     }
                     // console.log( "비교"+ com1+":::"+com2 );
                    
                     // 이름 바꾸기.
                     if(com1 == com2) {
                         console.log("비교 매치!" + taskCategory[j].categoryName);
                         data.data[i].taskCategory = taskCategory[j].categoryName;
                     }                    
                 }
             }
        }   
=======
function getData2(req, res, taskList) {
    var conditions = {};
    conditions.refTask = { $in: taskList };

    Problem.dataTable(req.query, { 'conditions': conditions }, function(err, data) {
        if (err) console.log(err);
        console.log(data);
>>>>>>> 45e3dfab886cba0e59c30f547b6998c89a9f0cc9
        res.send(data);
    });
}

<<<<<<< HEAD

function getTaskList(req, res, callback) {
    // 1
    console.log("1차 getTaskList ====");

    // console.log("problem req.query ===="+JSON.stringify(req.query));
    // console.log("problem req.params ===="+JSON.stringify(req.params));
=======
function getTaskList(req, res, callback) {

    console.log(req.user);
>>>>>>> 45e3dfab886cba0e59c30f547b6998c89a9f0cc9

    var query = {};
    if (req.user.roles !== 'admin') {
        query = {
            $or: [
                { 'isOpen': null },
                { 'isOpen': true },
                { 'isOpen': false, 'center': new mongoose.Types.ObjectId(req.user.center) }
            ]
        };
    }

    Task.find(query, { _id: 1 }).exec(function(err, tasks) {
        if (tasks === null) return [];
        if (tasks === undefined) return [];

        callback(req, res, tasks.map(function(task) {
            return task._id;
        }));
    });
}
<<<<<<< HEAD


=======
>>>>>>> 45e3dfab886cba0e59c30f547b6998c89a9f0cc9
/**
 * Show the current Problem
 */
exports.read = function(req, res) {
    res.jsonp(req.problem);
};

/**
 * Update a Problem
 */
exports.update = function(req, res) {
    var problem = req.problem;

    problem = _.extend(problem, req.body);

    Task.findById(problem.refTask).exec(function(err, task) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            problem.taskCategory = task.category;
            problem.taskName = task.name;

            problem.save(function(err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(problem);
                    return;
                }
            });
        }
    });
};

/**
 * Delete an Problem
 */
exports.delete = function(req, res) {
    var problem = req.problem;

    problem.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(problem);
        }
    });
};

/**
 * List of Problems
 */
exports.list = function(req, res) {
<<<<<<< HEAD
    
    console.log("pppppp: list1");
    console.log("pppppp: req"+JSON.stringify(req.params));


=======
>>>>>>> 45e3dfab886cba0e59c30f547b6998c89a9f0cc9
    Problem.find().sort('-created').populate('user', 'name').populate('refTask', 'center isOpen').exec(function(err, problems) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(problems.filter(function(problem) {
                if (problem.refTask.center === undefined) return true;
                else if (problem.refTask.isOpen === true) return true;
                else if (problem.refTask.isOpen === false && req.user.center.equals(problem.refTask.center)) return true;
                return false;
            }));
        }
    });
};

<<<<<<< HEAD
=======
// 문제 조회
>>>>>>> 45e3dfab886cba0e59c30f547b6998c89a9f0cc9
exports.listByTask = function(req, res) {
    if (req.body.taskID === undefined) {
        return res.status(400).send({
            message: "taskID가 필요합니다."
        });
    }
    if (req.body.setNum === undefined) {
        return res.status(400).send({
            message: "setNO가 필요합니다."
        });
    }
    var taskID = req.body.taskID;
    var setNO = req.body.setNum;

<<<<<<< HEAD
=======
    console.log("ddd _ Problem.find_1::taskID="+taskID);

>>>>>>> 45e3dfab886cba0e59c30f547b6998c89a9f0cc9
    Problem.find({
        'refTask': taskID,
        'name': setNO
    }).populate('refTask', 'center isOpen').sort('seq').exec(function(err, problems) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
<<<<<<< HEAD
            
=======
>>>>>>> 45e3dfab886cba0e59c30f547b6998c89a9f0cc9
        } else {
            var rst = [];
            problems = problems.filter(function(problem) {
                if (problem.refTask.center === undefined) return true;
                else if (problem.refTask.isOpen === true) return true;
                else if (problem.refTask.isOpen === false && req.user.center.equals(problem.refTask.center)) return true;
                return false;
            });
            problems.forEach(function(x, index) {
                var p = {};
                p._id = x._id;
                if (x.practice !== undefined)
                    p.practice = x.practice;
                p.seq = x.seq;
                p.def = [];
                p.res = [];
<<<<<<< HEAD
                x.resources.forEach(function(x, index) {
=======

                x.resources.forEach(function(x, index) {

                    console.log("ddd _ Problem.find_2::x._id="+x._id);

>>>>>>> 45e3dfab886cba0e59c30f547b6998c89a9f0cc9
                    var r = {};
                    r._id = x._id;
                    r.value = x.value;
                    r.name = x.name;
                    r.resType = x.resType;
<<<<<<< HEAD
=======
                    r.note = x.note;

                    console.log("ddd _ Problem.find_2::x.note = "+x.note);

>>>>>>> 45e3dfab886cba0e59c30f547b6998c89a9f0cc9
                    if (x.isDefinition === true) {
                        p.def.push(r);
                    } else {
                        r.isAnswer = x.isAnswer;
                        p.res.push(r);
                    }
                });
                rst.push(p);
            });
            res.jsonp(rst);
            //res.jsonp(problems);
        }
    });
};

/**
 * Problem middleware
 */
exports.problemByID = function(req, res, next, id) {
<<<<<<< HEAD
    console.log("in");
=======
    
    console.log("ddd _ problemByID::"+id);

>>>>>>> 45e3dfab886cba0e59c30f547b6998c89a9f0cc9
    Problem.findById(id).populate('user', 'name').populate('refTask', 'name center isOpen').exec(function(err, problem) {
        if (err) return next(err);
        if (!problem) return next(new Error('Failed to load Problem ' + id));

        if (problem.refTask.isOpen === false && req.user.center.equals(problem.refTask.center) === false) {
            return res.status(400).send("has no permission");
        } else {
<<<<<<< HEAD
=======

            console.log("ddd _ problemByID2::"+problem);

>>>>>>> 45e3dfab886cba0e59c30f547b6998c89a9f0cc9
            req.problem = problem;
            next();
        }
    });
};

/**
 * Problem authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    /*if (req.problem.user.id !== req.user.id) {
     return res.status(403).send('User is not authorized');
     }*/
    next();
};


exports.updatedb = function(req, res) {

    Problem.find({ 'name': { $type: 2 } }, function(err, problems) {
        problems.forEach(function(x, index) {
            delete x.name;
            var intName = parseInt(x.name);
            x.name = new Number();
            x.name = intName; // convert field to string
            console.log(x.seq);
            if (x.seq === undefined) {
                x.seq = x.level;
            }
            console.log(x.seq);
            x.save();
        });
    });

    return res.send("ok");
};