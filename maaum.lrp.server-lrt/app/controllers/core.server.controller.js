'use strict';

/**
 * Module dependencies.
 */
exports.index = function(req, res) {
	res.render('index', {
		user: req.user || null,
		request: req
	});
};

exports.remapping = function(req, res) {
	var mongoose = require('mongoose'),
		Problem = mongoose.model('Problem');

	Problem.find().exec(function(err, problems) {
		problems.forEach(function (problem) {
		});
	});
}

exports.recoverImage = function(req, res) {
	var mongoose = require('mongoose'),
		Problem = mongoose.model('Problem'),
		fs       = require('fs'),
		path = require('path'),
		gm = require('gm');

	var exts = ['png', 'PNG', 'jpg', 'JPG', 'bmp', 'BMP', 'tif', 'TIF', 'gif', 'GIF'];

	var uploadPath = path.resolve(__dirname + '../../../public/uploads/');

	Problem.find().exec(function(err, problems) {
		problems.forEach(function(problem) {
			var process = false;
			problem.resources.forEach(function(resource,i) {
				if(resource.resType === 'file') {
					var image = resource.value;
					console.log(image);
					if(image !== undefined && image.indexOf('_trim') >= 0)
					{
						console.log("IN");
						image = path.basename(image, path.extname(image)).replace('_trim','');

						exts.forEach(function(ext){
							var rawImage = image + "." + ext;
							var rawPath = uploadPath + '/' + rawImage;
							console.log(rawPath);
							if(fs.existsSync(rawPath)) {
								problem.resources[i].value = rawImage;
								process = true;
							}
						});
					}
				}
			});
			if(process) {
				console.log(problem);
				problem.save();
			}
		})
	});

	res.send("ok");
};

exports.trimImage = function (req, res) {
	var mongoose = require('mongoose'),
		Problem = mongoose.model('Problem'),
		fs       = require('fs'),
		path = require('path'),
		gm = require('gm');

	var uploadPath = path.resolve(__dirname + '../../../public/uploads/');

	Problem.find().exec(function(err, problems) {
		problems.forEach(function(problem) {
			var process = false;
			problem.resources.forEach(function(resource,i) {
				//console.log(resource.resType);
				if(resource.resType === 'file') {
					var image = resource.value;

					var imagePath = uploadPath + '/' + image;

					image = path.basename(image, path.extname(image));
					//console.log(image);

					if(image !== undefined && image.indexOf('_trim') < 0) {
						gm(imagePath).setFormat('png').trim().resize(1024,1024, '>').write(uploadPath + '/' + image +'_trim.png', function(err) {
							console.log(err);
						});
						problem.resources[i].value = image + '_trim.png';
						process = true;
						//console.log(image);
					}
				}
			});
			//console.log(problem);
			if(process) {
				problem.save();
			}
		})
	});

	res.send("ok");
};

exports.dashboardManager = function(req, res) {
    var mongoose = require('mongoose'),
        PayHistory = mongoose.model('PayHistory'),
		util = require('./util.server.controller'),
    	_ = require('lodash');

    var user = req.user;
    var args = {};

    var GetRemainDate = function() {
    	return new Promise(function(resolve, reject) {
    		PayHistory.findOne()
                .sort('-expired_date')
                .exec(function(err, doc)
                {
                	if(err) reject(err);
					if(doc === null) reject(null);
                	else resolve(doc.expired_date);
                });
		});
	};

    if(user.center === undefined) {
    	res.send("user has no center");
	} else {
        util.getkeynum(user.center)
			.then(function(keynum) {
				_.extend(args, keynum);
				return GetRemainDate();
			})
			.then(function(expired_date) {
				args.expired_date = expired_date;
                var diff =  Math.floor(( expired_date - Date.now() ) / 86400000);
                args.remainDays = diff;
                res.send(args);
            })
			.catch(function(err) {
                res.send(err);
			});
	}
};

exports.dashboardAdmin = function(req, res) {
    var mongoose = require('mongoose'),
        User = mongoose.model('User'),
        Center = mongoose.model('Center'),
        PayHistory = mongoose.model('PayHistory');

	var args = {};

    var getUser = function() {
    	return new Promise(function (resolve, reject) {
            User.count({roles:'patient'}, function(err, num) {
            	if(err) reject(err);
                resolve(num);
            });
        });
	};
    var getCenter = function() {
        return new Promise(function (resolve, reject) {
            Center.count({}, function(err, num) {
                if(err) reject(err);
                resolve(num);
            });
        });
    };
    var getPay = function() {
    	return new Promise(function(resolve, reject) {
    		PayHistory.count({approved : false}, function(err, num) {
                if(err) reject(err);
                resolve(num);
			})
		})
	};
	getUser()
		.then(function(userNum) {
			args.userNum = userNum;
			return getCenter();
		})
		.then(function(centerNum) {
			args.centerNum = centerNum;
			return getPay();
		})
		.then(function(remainPay) {
            args.remainPay = remainPay;
			res.send(args);
		})
    	.catch(function(err) {
    		res.status(400).send(err);
		});
}

exports.dumpImage = function (req, res) {

	var mongoose = require('mongoose'),
		Problem = mongoose.model('Problem'),
		archiver = require('archiver'),
		archive  = archiver('zip'),
		fs       = require('fs'),
		path = require('path'),
		gm = require('gm');

	var getStream = function(fileName){
		return fs.readFileSync(fileName);
	};

	var uploadPath = path.resolve(__dirname + '../../../public/uploads/');
	var output = fs.createWriteStream(uploadPath + "/dump_image.zip");
	var images = [];

	Problem.find().exec(function(err, problems) {
		problems.forEach(function(problem) {
			problem.resources.forEach(function(resource) {
				console.log(resource.resType);
				if(resource.resType === 'file') {
					var image = resource.value;
					if(image !== undefined && image.indexOf("undefined") < 0) {
						images.push(image);
						console.log(image);
					}
				}
			})
		});

		//console.log(images);

		archive.pipe(output);

		images.forEach(function (item) {
			var path = uploadPath + '/' + item;
			archive.append(getStream(path), { name: item});
		});

		archive.finalize(function(err) {
			console.log("IN FINALIZE");
			res.redirect('/uploads/dump_image.zip');
		});

		res.send("dumping start");
	});

	/*res.download(path.resolve(__dirname + '/../../public/uploads/mocks.zip'), function(err) {
		console.log(err);
	});*/
};
