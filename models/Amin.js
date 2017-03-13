var mongoose = require("mongoose");


var adminSchema = mongoose.Schema({
	"aid":String,
	"psw":String
});
adminSchema.statics.findAdminById = function(id,callback){//数据库匹配管理员
	this.find({"aid":id},function(err,r){
		callback(err,r);
	});
};//匹配管理员
var Admin = mongoose.model("Admin",adminSchema);
module.exports = Admin;