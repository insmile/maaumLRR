'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),

    MyTaskCategory = mongoose.model('MyTaskCategory'),

    async = require('async'),
    _ = require('lodash');

/**
 * Create a Task
 */
exports.create = function(req, res) {

    console.log("TASK Category server.controller 등록1");

    var myTaskCategory = new MyTaskCategory(req.body);
    
    console.log("TASK Category server.controller 등록2="+req.body);
    console.log("TASK Category server.controller 등록3="+JSON.stringify(req.body));
    
    
    myTaskCategory.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(myTaskCategory);
        }
    });
};

 
exports.read1 = function(req, res) {
    console.log("Task Category read1====");  
    // 
};

exports.readList = function(req, res){

    // var where = {};
    // where._id = req.params.categoryId;
    
    
    MyTaskCategory.find()
    // .where(where)
    //.sort('-name')
    .exec(function(err, obj) {
        
        if (err) {
            res.status(400).send("error" + err);
    
        } else if (!obj) {
            // res.jsonp(req.task);
            res.send(obj);

        } else {                        

            console.log("겟 리스트 req.task111:" + JSON.stringify(obj));

            res.send( obj);
        }
        
        
    });        
    
    
    
    // var data = [ {"efd33":"efdf"},{"1efd33":"e22fdf"} ]
    // res.send(data);

    

}


exports.update = function(req, res) {

    console.log("Task Category Update====");

    console.log("Task Category Update1 ==== "+JSON.stringify(req.params));
    console.log("Task Category Update2 ==== "+JSON.stringify(req.params.categoryId));

    var data =  req.params.categoryId;

    var id= data.split(":")[0];
    var name = data.split(":")[1];
    
    console.log("update id=== "+id);
    console.log("update name === "+name);
    
    // var setData = "{'categoryName' :'" + name +  "'}";
    var setData ={};
    setData.categoryName = name;

    console.log("update setData === "+setData);

    MyTaskCategory.update({ _id: id }, { $set: setData }, function(err, output){
                
        res.json( { message: 'updated' } );
    })

        
    

};



exports.test123 = function(req, res) {
    console.log("Task Category GET test123====");
}


exports.test124 = function(req, res) {
    console.log("Task Category POST test124====");
}


//dddddddddd
exports.read2 = function(req, res) {
    
    console.log("Task Category GET read2_1  ====");

    console.log("Task Category GET read2_2 res ===="+res);
    
    /*
    console.log("Task Category GET read2_1  ==== req.categoryReadData="+JSON.stringify(req.categoryReadData) );
    console.log("Task Category GET read2_2  ==== req.categoryReadData="+JSON.stringify(req.task) );
    console.log("Task Category GET read2_3  ==== req.categoryReadData="+JSON.stringify(req.categoryRR) );
    console.log("Task Category GET read2_4  ==== req.categoryReadData="+JSON.stringify(req) );
    */
    
    
    var where = {};
    where._id = req.params.categoryId;
    
    MyTaskCategory.findOne()
        .where(where)
        //.sort('-name')
        .exec(function(err, obj) {
            if (err) {
                res.status(400).send("error" + err);
            } else if (!obj) {

                console.log("gggggg1!!");
                // console.log("겟 테스크 req.task:" + req.task);
                res.jsonp(req.task);

            } else {

                console.log("겟 카테고리 성공 :" + JSON.stringify(obj));

                console.log("겟 테스크 req.task1:" + res.jsonp(req.task));

                console.log("겟 테스크 req.task2:" + JSON.stringify(req.task));

                var ed={"ff":"ef"};

                res.jsonp(req.task);

            }
        });
}

exports.readTest2 = function(req, res) {
    console.log("Task Category POST readTest2  ====");
}


exports.delete = function(req, res) {
    
};
 
exports.readTest1 = function(req, res) {
    console.log("cocococ readTest1__");
   
};




exports.categoryByID = function(req, res, next, id) {
    console.log("cocococ middle카테고리 미들웨어");
   next();
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