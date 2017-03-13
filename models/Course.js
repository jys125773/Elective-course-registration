var mongoose = require("mongoose");
var courseSchema = mongoose.Schema({
	"order": Number,
  	"name": String,
  	"teacher": String,
  	"week": Number,
  	"maxcount": Number,
  	"grade": [Number],
  	"intro": String,
  	"students":[Number] 
});
courseSchema.statics.addOneCourse = function(courseJson,callback){
	this.create(courseJson,function(err,r){
		callback(err,r);
	});
};
courseSchema.statics.getAllCourse = function(callback){
	this.find({},function(err,r){
		callback(err,r);
	});
};
courseSchema.statics.renew = function(_id,newJson,callback){//更新一个课程
	delete newJson._id;//主键不能作为更新项
	this.update({"_id":_id},newJson,function(err,r){
		callback(err,r);
	});
};
courseSchema.statics.deleteCourses = function(course_idArr,callback){
	var courseArr = [];
	course_idArr.forEach(function(id){
		courseArr.push({"_id":id})
	});
	this.remove({$or:courseArr},function(err,r){
		callback(err,r);
	});
};
courseSchema.statics.findByOrder = function(order,callback){
	this.find({"order":order},function(err,r){
		callback(err,r);
	});
}
var Course = mongoose.model("Course",courseSchema);
module.exports = Course;