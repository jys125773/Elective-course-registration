## Elective-course-registration
> 一个nodejs练手的小demo，中学选修课报名系统。
> nodejs+ejs+mongodb+moogose+jQuery：
> 另外用到了excel-export（解析Excel表格转化为json数据），node-xlsx（将json转换为Excel文件）
## 简要说明
  登录分为管理员登录与学生登录，管理员登陆后，可以将特定格式的学生信息excel表格上传到后端，nodejs得到学生信息的数据后为每一个学生随机产生6位字符串，然生成一个带有密码的Excel表格返回浏览器，管理员可以下载，记载着每个学生的密码。
> 每个学生拿到密码后就可以登录选择自己的课程，具体选课逻辑见下图。
## 这是需求文档
> 
<div align=center><img src="https://github.com/jys125773/Elective-course-registration/blob/master/screenshot/0.png" width="80%"></div>
## 系统界面
<div align=center><img src="https://github.com/jys125773/Elective-course-registration/blob/master/screenshot/1.png" width="80%"></div>
<div align=center><img src="https://github.com/jys125773/Elective-course-registration/blob/master/screenshot/2.png" width="80%"></div>
<div align=center><img src="https://github.com/jys125773/Elective-course-registration/blob/master/screenshot/3.png" width="80%"></div>
<div align=center><img src="https://github.com/jys125773/Elective-course-registration/blob/master/screenshot/4.png" width="80%"></div>
