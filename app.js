var express = require("express");
var session = require('express-session');
var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/xxk');
var common_router = require("./router/common-router.js");
var admin_router = require("./router/admin-router.js");
var student_router = require("./router/student-router.js");
var Admin = require("./models/Amin.js");
var crypto = require("crypto");

var initPsw = "1";//管理员初始密码
var hash = crypto.createHash("sha256").update(initPsw).digest("hex");
var adminit = new Admin({"aid":"admin","psw":hash});
adminit.save();

var app = express();
app.set("view engine","ejs");
app.set("views","views");
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'kaolala', //加密字符串，我们下发的随机乱码都是依靠这个字符串加密的
    resave: false,
    saveUninitialized: true
}));

app.get("/",						common_router.showIndex);
app.post("/login",					common_router.checkLogin);
app.get("/admin",					admin_router.showAdmin);
app.get("/admin-student",			admin_router.showAdminStudent);
app.get("/admin-course",			admin_router.showAdminCourse);
app.post("/admin-addcourse",		admin_router.addCourse);
app.post("/admin-postExcel",		admin_router.postExcel);//提交excel文件
app.get("/admin-resetAllStudentPsw",admin_router.resetAllStudentPsw);
app.post("/admin-changeOnePsw",		admin_router.adminChangeOnePsw);
app.get("/admin-getallCourse",		admin_router.getallCourse);
app.post("/admin-renewTable",		admin_router.renewTable);
app.post("/admin-deleteCourse",		admin_router.deleteCourse);

app.get("/student/:sid",student_router.getRegistedCourse);
app.get("/student-regist",student_router.regist);
app.get("/student-unRegist",student_router.unRegist);
app.use("/public",express.static("public"));
app.get("/*",common_router.show404);
app.listen(3800);
