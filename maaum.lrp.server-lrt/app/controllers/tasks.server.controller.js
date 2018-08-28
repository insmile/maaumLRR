'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Task = mongoose.model('Task'),
    Problem = mongoose.model('Problem'),
    async = require('async'),
    MyTaskCategory = mongoose.model('MyTaskCategory'),
    _ = require('lodash');

/**
 * Create a Task
 */
exports.create = function(req, res) {
    
    
    var task = new Task(req.body);
    
    // console.log("task create = "+ req.body);
    // console.log("task create2 = " + JSON.stringify(req.body));

    task.user = req.user;
    
    if (req.user.center !== undefined)
        task.center = req.user.center;

    task.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(task);
        }
    });
};

exports.DT = function getData(req, res) {
    // console.log("gogogogo11"+req.query);

    // console.log("gogogogo1222"+JSON.stringify(req.query));
    // console.log("gogogogo param ="+JSON.stringify(req.params));

    getTaskList(req, res, getData2);
}

//2
function getData2(req, res, taskList) {
    
    console.log("task list 조회 2차 시작");
    // console.log("task list 조회 시작 req.query="+JSON.stringify(req.query) );
    
    var conditions = {};

    var taskSelectType = req.query.taskTypeSearch;
    console.log("task list 조회 2차 시작, taskSelectType="+taskSelectType);

    if(taskSelectType =="ALL" || taskSelectType=="all" || taskSelectType=="" || taskSelectType==null) {
        
    }else {
        conditions.taskType= taskSelectType;
    }

    conditions.$or = [{ 'isOpen': null }, { 'isOpen': true }];
    if (req.user.center !== undefined) {
        conditions.$or.push({ 'isOpen': false, 'center': req.user.center });
    }

    Task.dataTable(req.query, { 'conditions': conditions }, function(err, data) {
        
       console.log("list result55 ===" +JSON.stringify(data) );

       for(var i = 0; i < data.data.length;i++) {
           if(data.data[i].category !== undefined) {

                for(var j = 0; j < taskList.length; j++) {

                    // console.log("비교 시작. data.data[i].category ="+data.data[i].category+", taskList[j]._id="+taskList[j]._id);
                    
                    var com1 = data.data[i].category + ""; // 스트링으로 인식 안대서 replace하면 에러뜸. 가끔 공백 붙어있어서 같아도 같다고 인식 안함. 그래서 그냥 화면에 아이디 뜸. 그래서 일부러 "" 붙여줌.
                    var com2 = taskList[j]._id + "";
                    
                    if(com1 !==null && com1 !==undefined){
                        com1 = com1.replace(/^\s*|\s*$/g,''); 

                    }

                    if(com2 !==null && com2 !==undefined){
                        com2 = com2.replace(/^\s*|\s*$/g,''); 

                    }
                    /*
                    if(data.data[i].category === taskList[j]._id) {
                        console.log("비교 매치!" + taskList[j].categoryName);
                        data.data[i].category = taskList[j].categoryName;
                    }
                    */                    
                    
                    if(com1 == com2) {
                        console.log("비교 매치!" + taskList[j].categoryName);
                        data.data[i].category = taskList[j].categoryName;
                    }                    
                }
            }
       }              
       // console.log("list result777 ===" +JSON.stringify(data) );

        if (err) console.log(err);
        res.send(data);
    });
}


//1
function getTaskList(req, res, callback) {
    
    MyTaskCategory.find().exec(function(err, taskCategory) {
        if (taskCategory === null) return [];
        if (taskCategory === undefined) return [];

        console.log("task 조회 1차 = 카테고리 먼저 조회.");
        console.log("task 조회 1차 result = "+JSON.stringify(taskCategory));

        callback(req, res, taskCategory);
    });
}


/*
    

    exports.DT = function getData(req, res) {

    console.log("task list 조회 시작");
    console.log("task list 조회 시작 req.query="+req.query);
    console.log("task list 조회 시작 req.query="+JSON.stringify(req.query) );

    var conditions = {};

    conditions.$or = [{ 'isOpen': null }, { 'isOpen': true }];
    if (req.user.center !== undefined) {
        conditions.$or.push({ 'isOpen': false, 'center': req.user.center });
    }

    
    Task.dataTable(req.query, { 'conditions': conditions }, function(err, data) {
        
        // console.log("list result ===" +data);
        console.log("list result 원본 ===" +JSON.stringify(data) );

        var result = data.data;

        for(var i = 0; i<result.length; i++) {
            var dd = result[i];

            var where2 = {};
            where2._id = dd.category;

            // 조회된 값으로 카테고리 네임 조회
            MyTaskCategory.findOne()
            .where(where2)
            .exec(function(err, obj) {
                if (err) {
                                    
                } else if (!obj) {                    
                    
                } else {
                    console.log("list task 조회1 =  ===" +obj.categoryName);
                    dd.category = obj.categoryName;
                    console.log("list task 조회22 =  ===" +dd.category);

                    data.data[i] = dd;
                }
            });

            console.log("list result for ===" +JSON.stringify(dd));            
        }//end for


        console.log("list result55 ===" +JSON.stringify(data) );

        if (err) console.log(err);
        res.send(data);
    });
};
*/



/**
 * Show the current Task
 */
exports.read = function(req, res) {
    if (req.profile !== undefined) {
        console.log(req.profile);
    }
    var where = {};
    where.refTask = req.task._id;
    where.$or = [];
    where.$or.push({ 'isOpen': null });
    where.$or.push({ 'isOpen': true });

    console.log(req);
    if (req.user.center !== undefined)
        where.$or.push({ 'isOpen': false }, { 'center': req.user.center });

    Problem.findOne()
        .where(where)
        .sort('-name')
        .exec(function(err, obj) {
            if (err) {
                res.status(400).send("error" + err);
            } else if (!obj) {
                res.jsonp(req.task);
            } else {
                var max = obj.name;
                req.task.setSize = max;
                res.jsonp(req.task);

            }
        });
    //Problem.find({'refTask' : req.task._id}).max('name')
};

/**
 * Update a Task
 */
exports.update = function(req, res) {

    console.log(req);
    var task = req.task;

    console.log("task update"+req);

    task = _.extend(task, req.body);

    Problem.find({ 'refTask': task._id }, function(err, tasks) {
        tasks.forEach(function(problem, index) {
            problem.taskName = task.name;
            problem.taskCategory = task.category;
            problem.taskType = task.taskType;
            console.log(problem);
            problem.save();
        })
    });

    //task._id

    task.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(task);
        }
    });
};

/**
 * Delete an Task
 */
exports.delete = function(req, res) {
    var task = req.task;

    task.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(task);
        }
    });
};

/**
 * List of Tasks
 */
exports.list = function(req, res) {

    console.log("list START:::"  );
    console.log("list:::"+JSON.stringify(req.params) );

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

    Task.find(query).sort('-created').populate('user', 'displayName').exec(function(err, tasks) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            var t2 = [];
            async.eachSeries(tasks, function iterator(task, callback) {
                Problem.findOne()
                    .where({ refTask: task._id })
                    .sort('-name')
                    .exec(function(err, obj) {
                        if (err) {
                            res.status(400).send("error" + err);
                            callback();
                        } else if (!obj) {
                            t2.push(task);
                            callback();
                        } else {
                            var max = obj.name;
                            task.setSize = max;
                            t2.push(task);
                            callback();
                        }
                    });
            }, function done(err) {
                if (err) return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
                else {
                    res.jsonp(t2);
                }
            });
        }
    });
};

exports.category = function(req, res) {
    Task.find().distinct('category').exec(function(err, tasks) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(tasks);
        }
    });
};

exports.name = function(req, res) {
    Task.find().distinct('name').exec(function(err, tasks) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(tasks);
        }
    });
};

/*
exports.list_a = function(req, res) {

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

    Task.find(query, { _id: 1, category: 1, name: 1 }).sort('sortOrder').exec(function(err, tasks) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            var c = [];
            var t = [];
            var cc;
            tasks.forEach(function(x, index) {
                //console.log(t.indexOf(x.category));
                if (c[x.category] === undefined) {
                    c[x.category] = [];
                    cc = { category: x.category, tasks: [] };
                    t.push(cc);
                }
                cc.tasks.push({ name: x.name, _id: x._id });
            });
            //console.log(t);
            //console.log(JSON.stringify(t));
            res.jsonp(t);
        }
    });
};
*/



//////////////////

exports.list_a = function(req, res) {

    console.log("list_a::: START");
    console.log("list_a::: " + JSON.stringify(req.params)  );
    
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
    
    query = { taskType: 'LRE' };
    
    Task.find(query, { _id: 1, category: 1, name: 1 }).sort('sortOrder').exec(function(err, tasks) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            var c = [];
            var t = [];
            var cc;
            tasks.forEach(function(x, index) {
                //console.log(t.indexOf(x.category));
                if (c[x.category] === undefined) {
                    c[x.category] = [];
                    cc = { category: x.category, tasks: [] };
                    t.push(cc);
                }
                cc.tasks.push({ name: x.name, _id: x._id });
            });
            //console.log(t);
            //console.log(JSON.stringify(t));
            res.jsonp(t);
        }
    });
};


/** lt, rt, LRE. 클라이언트에서 조회. */
exports.list3 = function(req, res) {
    console.log("task list3 START::" );        
    console.log("list_CCCC1:::" + JSON.stringify(req.params));
    
    // 카테고리 먼저 가져오기.
    getTaskList(req, res, getTaskList3);
}

function getTaskList3 (req, res, taskCategory){
    var where = {};

    if(req.params.gubun !="all" && req.params.gubun !="ALL" ) {
        console.log("task list3 조건 붙이기." );        
        where.taskType =  req.params.gubun;
    }

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
    


    
    Task.find(query, { _id: 1, category: 1, name: 1 }).where(where).sort('sortOrder').exec(function(err, tasks) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            var c = [];
            var t = [];
            var cc;
            tasks.forEach(function(x, index) {
                //console.log(t.indexOf(x.category));
                if (c[x.category] === undefined) {
                    c[x.category] = [];
                    cc = { category: x.category, tasks: [] };

                    t.push(cc);
                }
                cc.tasks.push({ name: x.name, _id: x._id });
            });

            for(var i = 0; i < t.length;i++) {
                
                for(var j = 0; j < taskCategory.length; j++) {

                    // 비교해서 이름 바꾸기.                    
                    var com1 = t[i].category + ""; // 스트링으로 인식 안대서 replace하면 에러뜸. 가끔 공백 붙어있어서 같아도 같다고 인식 안함. 그래서 그냥 화면에 아이디 뜸. 그래서 일부러 "" 붙여줌.
                    var com2 = taskCategory[j]._id + "";
                    
                    if(com1 !==null && com1 !==undefined){
                        com1 = com1.replace(/^\s*|\s*$/g,''); 
                    }

                    if(com2 !==null && com2 !==undefined){
                        com2 = com2.replace(/^\s*|\s*$/g,''); 
                    }

                    if(com1 == com2) {
                        t[i].categoryName =  taskCategory[j].categoryName;                      
                    }                    
                }            
            }    

            //console.log(t);
            console.log("클라이언트 조회="+JSON.stringify(t));
            res.jsonp(t);
        }
    });
}





exports.list4 = function(req, res) {

    console.log("task list4 START:::"  );
    console.log("list:::"+JSON.stringify(req.params) );

    var where = {};

    if(req.params.gubun !="all" && req.params.gubun !="ALL" ) {
        console.log("task list4 조건 붙이기." );        
        where.taskType =  req.params.gubun;
    }


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

    Task.find(query).where(where).sort('-created').populate('user', 'displayName').exec(function(err, tasks) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            var t2 = [];
            async.eachSeries(tasks, function iterator(task, callback) {
                Problem.findOne()
                    .where({ refTask: task._id })
                    .sort('-name')
                    .exec(function(err, obj) {
                        if (err) {
                            res.status(400).send("error" + err);
                            callback();
                        } else if (!obj) {
                            t2.push(task);
                            callback();
                        } else {
                            var max = obj.name;
                            task.setSize = max;
                            t2.push(task);
                            callback();
                        }
                    });
            }, function done(err) {
                if (err) return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
                else {
                    res.jsonp(t2);
                }
            });
        }
    });
};


////////////////////
exports.info = function(req, res) {
    var taskInfo = {};
    taskInfo.answer = req.task.answer;
    taskInfo.resources = req.task.resources;
    res.jsonp(taskInfo);
};

/**
 * Task middleware
 */
exports.taskByID = function(req, res, next, id) {
    Task.findById(id).populate('user', 'displayName').exec(function(err, task) {
        if (err) return next(err);
        if (!task) return next(new Error('Failed to load Task ' + id));
        if (req.user.roles !== 'admin' && req.user.center !== undefined) {
            if (task.isOpen == false && req.user.center.equals(task.center) == false) {
                return res.status(400).send("has no permission");
            }
        }
        req.task = task;
        next();
    });
};

/**
 * Task authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    /*if (req.task.user.id !== req.user.id) {
    	return res.status(403).send('User is not authorized');
    }*/
    next();
};