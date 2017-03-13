var path = require("path");
var formidable = require("formidable");
var crypto = require("crypto");
var Admin = require("../models/Amin.js");
var Student = require("../models/Student.js");
exports.showIndex = function(req,res){
    if (req.session.login && req.session.type=="student") {
        res.render("student",{
            "name":req.session.name,
            "sid":req.session.sid,
            "grade":req.session.grade
        });
    }else{
        res.sendFile(path.join(__dirname,"../views/index.html"));//呈递首页
    };
};
exports.checkLogin = function(req,res){
	var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
    	if (err) {
    		res.json({"result":0});//服务器错误0
    	};
    	// console.log(fields);
    	var id = fields.id,
    		psw = fields.psw;

    	if (/^[0-9]+$/.test(id)) {//学号格式，可能是学生
            Student.findBySid(id,function(err,r){
                if (err) {
                   res.json({"result":0});//服务器错误0 
               }else if (r.length == 0) {
                    res.json({"result":-1});//id不存在
               } else{
                   var hash = crypto.createHash("sha256").update(psw).digest("hex");
                   if (hash == r[0].psw) {//密码匹配成功
                        req.session.sid = id;
                        req.session.name = r[0].name;
                        req.session.type = "student";
                        req.session.grade = r[0].grade;
                        req.session.login = true;
                        res.json({"result":2});//来了一个可以登陆的学生
                   }else{
                        res.json({"result":-2});//密码错误
                   };
               };
            });
    	}else if(/^[a-zA-Z]+$/.test(id)){//英文字母格式，可能是管理员
    		Admin.findAdminById(id,function(err,r){
    			if (err) {
    				res.json({"result":0});//服务器错误0
    			}else if (r.length == 0) {
    				res.json({"result":-1});
    			}else{
    				var hash = crypto.createHash("sha256").update(psw).digest("hex");
    				if (r[0].psw == hash) {
    					//登陆成功，下发session
    					req.session.user = id;
                    	req.session.type = "admin";
                    	req.session.login = true;
                        res.json({"result":1});
    				}else{
    					res.json({"result":-2});//密码错误
    				};
    			};
    		});
    	}else{
    		res.json({"result":-1});//id不存在
    	};
    });
};
exports.show404 = function(req,res){
	res.status("404").send("404，没有资源！");
}
