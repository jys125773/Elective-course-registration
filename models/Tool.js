var Course = require("./Course.js");
var Student = require("./Student.js");
var _ = require("underscore");

Course.getAllCourse(function(err,allCourse){
	exports.regist = function(sid,order,callback){
		Course.findByOrder(order,function(err,r1){
			Student.findBySid(sid,function(err,r2){
				if (r1.length == 0 || r2.length == 0) {
					callback("0");//没有找到课或者学生
					return;
				};
				var course = r1[0];
				var student = r2[0];
				//五步走验证学生能否报名
				if (_.indexOf(course.students,sid) != -1) {
					//已经报了这个课程
					callback("-5");
					return;
				};
				if (student.course.length >= 2) {
					//报了两个及以上课程
					callback("-2");
					return;
				};
				var occupied = false;
				student.course.forEach(function(registedCourse){//得到学生已经报名的课程的order
					allCourse.forEach(function(item){
						//遍历所有课程，如果先前已经报名的课程的星期，
						//和这次请求要报名的星期冲突，就不能报名了
						if (item.week == course.week && registedCourse==item.order) {
							occupied = true;
						};
					});
				});
				if (occupied) {//如果日期冲突
					callback("-1");
					return;
				};
				if (course.students.length >= course.maxcount) {
					//人数超限
					callback("-3");
					return;
				};
				if (_.indexOf(course.grade,student._grade)==-1) {
					//不在报名年级范围内
					callback("-4");
					return;
				};
				student.course.push(order);
				course.students.push(sid);
				student.save();
				course.save();
				callback("1");//报名成功
			});
		});
	};
});
exports.unRegist = function(sid,order,callback){
	Course.findByOrder(order,function(err1,r1){
			Student.findBySid(sid,function(err2,r2){
				if (err1 || err2 || r1.length == 0 || r2.length == 0) {
					callback("0");//退定失败
				}else{
					var course = r1[0];
					var student = r2[0];
					student.course = _.without(student.course,course.order);
					for(var i = 0 ; i < course.students.length ; i++){
						if (course.students[i] == student.sid) {
							course.students.splice(i,1);//underscore抽风
						};
					};
					student.save();
					course.save();
					callback("1");//退订成功
				};
			});
		});
};