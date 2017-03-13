var path = require("path");
var formidable = require("formidable");
var crypto = require("crypto");
var xlsx = require('node-xlsx');
var nodeExcel = require('excel-export');
var fs = require("fs");
var Student = require("../models/Student.js");
var Course = require("../models/Course.js");
var Tool = require("../models/Tool.js");
var url = require("url");


exports.getRegistedCourse = function(req,res){//得到sid学生已经报名的的所有课程
	var sid = req.params.sid.slice(1);
	Student.getRegistdCouse(sid,function(err,student){
		res.json({"result":student});
	});
};
exports.regist = function(req,res){//学生报名某个课程
	var queryObj = url.parse(req.url,true).query;
	var order = queryObj.order,//课程序号
		sid = queryObj.sid;//学号
	Tool.regist(sid,order,function(state){
		res.json({"result":state});
	});
};
exports.unRegist = function(req,res){
	var queryObj = url.parse(req.url,true).query;
	var order = queryObj.order,//课程序号
		sid = queryObj.sid;//学号
	Tool.unRegist(sid,order,function(state){
		res.json({"result":state});
	});
};