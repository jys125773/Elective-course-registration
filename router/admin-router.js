var path = require("path");
var formidable = require("formidable");
var crypto = require("crypto");
var xlsx = require('node-xlsx');
var nodeExcel = require('excel-export');
var fs = require("fs");
var Student = require("../models/Student.js");
var Course = require("../models/Course.js");
var url = require("url");


exports.showAdmin = function(req,res){
    if (req.session.login && req.session.type=="admin") {
        res.sendFile(path.join(__dirname,"../views/admin.html"));
    } else{
        res.send("本页面需要登录，请<a href=/>登录</a>");
    };
};
exports.showAdminStudent = function(req,res){
     if (req.session.login && req.session.type=="admin") {
        res.sendFile(path.join(__dirname,"../views/admin-student.html"));
    } else{
        res.send("本页面需要登录，请<a href=/>登录</a>");
    };
};
exports.postExcel = function(req,res){
	var form = new formidable.IncomingForm();
	form.uploadDir = path.join(__dirname , "../uploads");
    form.parse(req, function(err,fields,files) {
    	if (err) {
    		res.json({"result":0});//服务器错误
    	} else{
    		fs.rename(files.file.path,files.file.path+".xlsx",function(err){
    			if (err) {
    				res.json({"result":0});//服务器错误
    			} else{
    				var grades = xlsx.parse(files.file.path+".xlsx");
    				var studentArr = [];
                    var _grade = 0;
    				grades.forEach(function(grade){
    					var gd = grade.name;
                        _grade++;
    					grade.data.forEach(function(student){
    						var infojson = {
    							"sid":student[0],
    							"name":student[1],
    							"sex":student[2],
    							"grade":gd,
                                "_grade":_grade};
    						studentArr.push(infojson);
    					});
    				});
    				Student.removeAllStudent(function(err,r){
    					if (err) {
    						res.json({"result":0});//服务器错误
    					} else{
    						Student.insertAllStudent(studentArr,function(err,r){
    							if (r.length == studentArr.length) {
    								res.json({"result":r.length});
    							};
    						});
    					};
    				});
    			};
    		});
    	};
    });
};
exports.resetAllStudentPsw = function(req,res){
	Student.resetAllStudentPsw(function(err,mingmaStundentArr){
		if (err) {
			res.send("-1");
		} else{
			var conf = {};
	        conf.cols = [
	        	{caption:'年级', type:'string'},
	            {caption:'学号', type:'string'},
	            {caption:'姓名', type:'string'},
	            {caption:'初始密码', type:'string'}
	        ];
	        conf.rows = mingmaStundentArr;
	        var result = nodeExcel.execute(conf);
	        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
	        res.setHeader("Content-Disposition", "attachment; filename=" + "PassWord.xlsx");
	        //命令数据库加密所有明码字符串
	        res.end(result, 'binary');
		};
	});
};
exports.adminChangeOnePsw = function(req,res){
	var form = new formidable.IncomingForm();
    form.parse(req, function(err,fields,files){
    	var sid = fields.sid,
    	   psw = fields.psw;
    	var newpsw = crypto.createHash("sha256").update(psw).digest("hex");
    	 Student.resetOnePsw(sid,newpsw,function(err,r){
    	 	if (err) {
    	 		res.json({"result":0});
    	 	} else if(r.n==1){
    	 		res.json({"result":1});
    	 	};
    	 });
    });
};
exports.showAdminCourse = function(req,res){
     if (req.session.login && req.session.type=="admin") {
        res.sendFile(path.join(__dirname,"../views/admin-course.html"));
    } else{
        res.send("本页面需要登录，请<a href=/>登录</a>");
    };
};
exports.addCourse = function(req,res){
	var form = new formidable.IncomingForm();
    form.parse(req, function(err,fields,files){
    	fields.grade = fields.grade.split("");//数字字符串变数组
    	Course.addOneCourse(fields,function(err,r){
    		if (err) {
    			console.log(err);
    			res.json({"result":0});
    		} else{
    			res.json({"result":1});
    		};
    	});
    });
};
exports.getallCourse = function(req,res){
	Course.getAllCourse(function(err,r){
		res.json({"result":r});
	});
};
exports.renewTable = function(req,res){
	var form = new formidable.IncomingForm();
    form.parse(req, function(err,fields,files){
    	var _id = fields._id;
        fields.grade = fields.grade.split(',');//传过来的是字符串，要转数组
    	Course.renew(_id,fields,function(err,r){
    		
    	});
    });
};
exports.deleteCourse = function(req,res){
	var form = new formidable.IncomingForm();
    form.parse(req, function(err,fields){
    	var arr = JSON.parse(fields.deletes);
    	Course.deleteCourses(arr,function(err,r){
    		res.json({"result":1});
    	});
    });
};