'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    PayHistory = mongoose.model('PayHistory');

exports.addDays = function(days, startDate) {
    var dat = new Date();
	if(startDate !== undefined)
		dat = startDate;
    dat.setDate(dat.getDate() + parseInt(days));
    return dat;
};

var getPayHistories = function(centerId) {
    return new Promise(function(resolve, reject) {
        PayHistory.find({
            'center' : centerId,
            'start_date' : {$lt : Date.now()},
            'expired_date' : {$gt : Date.now()},
            approved : true
        }, function(err, payHistories) {
            if(err) reject(err);
            else resolve(payHistories);
        });
    });
};

var getActiveUsers = function(centerId) {
    return new Promise(function(resolve, reject) {
        User.find( {
            center : centerId,
            roles : 'patient',
            expired_date : {$gt : Date.now()},
            has_key : true
        }, function(err, activeUsers) {
            if(err) reject(err);
            else resolve(activeUsers);
        })
    });
};



exports.getkeynum = function(centerId) {
    return new Promise(function(resolve, reject) {
        var maxNum = 0;
        getPayHistories(centerId)
            .then(function(payHistories) {
                maxNum = payHistories.map(p => p.key_num).reduce((a,b) => a + b, 0);
                //console.log(maxNum);
                return getActiveUsers(centerId)
            })
            .then(function(users) {
                if(users === undefined)
                    var activeUserNum = 0;
                else
                    var activeUserNum = users.length;
                resolve({
                    'max_key_num' : maxNum,
                    'active_key_num' : activeUserNum,
                    'left_key_num' : maxNum-activeUserNum
                });
            })
            .catch(function(err) {
                reject(err);
            });
    });
}
