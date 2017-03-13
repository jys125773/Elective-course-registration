var mongoose = require("mongoose");
var crypto = require("crypto");
var url = require("url");

var studentSchema = mongoose.Schema({
	"sid":String,
	"name":String,
	"sex":String,
	"psw":String,
	"grade":String,
	"_grade":Number,
	"course":[Number]
});
studentSchema.statics.findBySid = function(sid,callback){
	this.find({"sid":sid},function(err,r){
		callback(err,r);
	});
};
studentSchema.statics.removeAllStudent = function(callback){
	this.remove({},function(err,r){
		callback(err,r);
	});
};
studentSchema.statics.insertAllStudent = function(studentArr,callback){//插入全部学生
	this.create(studentArr,function(err,r){
		callback(err,r);
	});
};
studentSchema.statics.resetAllStudentPsw = function(callback){
	this.find({},function(err,r){
		var mingmaStundentArr = [];
		r.forEach(function(student){
			var str="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
			var psw = "";
			for(var i = 0 ; i < 6 ; i++){
				psw += str[Math.floor(Math.random()*(str.length))];
			};
			var hash = crypto.createHash("sha256").update(psw).digest("hex");
			student.psw = hash;
			student.save();
			mingmaStundentArr.push([student.grade,student.sid,student.name,psw]);
		});
		callback(err,mingmaStundentArr);
	});
};
studentSchema.statics.resetOnePsw = function(sid,newpsw,callback){
	this.update({"sid":sid},{"psw":newpsw},function(err,r){
		callback(err,r);
	});
};
studentSchema.statics.getRegistdCouse = function(sid,callback){
	this.find({"sid":sid},function(err,r){
		callback(err,r[0]);
	});
};
var Student = mongoose.model("Student",studentSchema);
module.exports = Student;