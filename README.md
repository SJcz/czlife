# czlife
一个简单的个人网站
<br>
<br>
## 项目介绍
写这个项目是在参考了 [N-blog](https://github.com/nswbmw/N-blog) 之后才决定自己写一个个人网站的, 也是一个很简单的项目,
基本上都是参照N-blog, 不过自己也是扩展了很多新的功能， 比如分页，图表， 表格等等。主要也是用来写写个人日记，一些技术素材等等
<br>
<br>
## 项目框架
整个项目所用到的模块或者框架主要如下<br>
数据库： MongoDB<br>
服务端： Node.js<br>
服务端web框架： Express 4<br>
服务端mongodb 操作模块：mongolass<br>
前端： Javascript<br>
HTML框架： bootstrap3<br>
JS框架： Jquery<br>

项目所用到js插件<br>
富文本编辑器： [summernote](https://github.com/summernote/summernote)<br>
表单验证： [bootstrapvalidator](https://github.com/nghuuphuoc/bootstrapvalidator)
<br>
<br>

## 项目功能
主页： 分为欢迎页和首页<br>
文章： 标签分类, 可见性, 发布文章, 修改文章, 删除文章<br>
评论： 发布评论<br>
二级评论： 回复某个评论, 发布二级评论<br>
用户： 登陆, 注册, 登出, 记住账号密码, 修改用户信息（包括上传头像）等等<br>
设置界面：<br>
&emsp;用户排行（根据积分, 发布文章数, 评论数）<br>
&emsp;图表分析数据（网站访问量, 文章发布, 评论数等等） <br>
&emsp;界面设置(用户可以根据自己的喜好配置不同的页面主体) <br>
&emsp;文章管理(列出所有发布的文章和所有参与的文章)<br>
&emsp;后台管理（住用管理员可以看见的界面, 可以对所有用户和文章操作）<br>
<br>
<br>

## 项目文件介绍

|文件夹或文件|作用|
--|--|
config|配置文件, 存储了session, cookie的基本设置, mongodb地址等
db|数据库文件, 数据库连接, 表结构及表的创建
log|日志文件, 包括访问日志和错误日志
middleware|中间件, 比如验证登陆, 得到页面主题设置
model|数据库表相关增删改查操作,
public|静态文件, logo图片, 样式文件或者第三方插件
routes|路由
upload|存放用户上传的头像，以用户Id为名创建文件夹存放
views|视图文件
views-js|视图文件对应的js代码
app.js|项目启动文件
installService.js|将项目配置为windows service运行的文件
package.json|项目说明文件, 里面有项目运行所需安装的包

接下来详细介绍几个文件<br>

config/default.js 配置文件<br>
~~~
module.exports = {
	port: 80,
	hostname: '0.0.0.0',
	mongodb: 'mongodb://localhost:27017/czlife',
	session: {
		name: 'czlife',
		secret: 'czlife',
		maxAge: 1000 * 3600 * 2
	},
	cookieTime: 1000 * 3600 * 24 * 30,
	title: 'Life',
	description: 'just a simple website to record my daily life.',
	pageNumber: 15
}
~~~

上面代码中, 我们配置了项目运行的主机, 端口, mongodb地址和数据库名, 以及cookie和session的设置.
pageNumber 是首页文章列表里每一页显示的最大文章数

app.js  启动文件<br>
~~~
onst express = require('express')
const session = require('express-session')
const formidable = require('express-formidable')
const cookieParser = require('cookie-parser')
const config = require('config-lite')(__dirname)
const flash = require('connect-flash')
const path = require('path')
const log4js = require('log4js')

log4js.configure({
	appenders: {
		accessLog: {  //访问日志
			type: 'file',  //类型是文件
			filename: path.join(__dirname, 'log/access.log'), //文件路径
			maxLogSize: 10 * 1024 * 1024, // = 10Mb
			numBackups: 5, // keep five backup files
			encoding: 'utf-8',
			compress: true, // compress the backups， 压缩备份文件
		},
		errLog: { //错误日志
			type: 'dateFile',  //类型是日期文件文件
			filename: path.join(__dirname, '../log/test'),
			pattern: "-yyyy-MM-dd.log",
			encoding : 'utf-8',
			daysTokeep: 180,
			keepFileExt: false,
			alwaysIncludePattern: true
			//filename: path.join(__dirname, 'log/error.log'), //文件路径
			//pattern: '-yyyy-MM-dd',
			//compress: true,  //之前生成的日志文件会被压缩
			//keepFileExt: true //配合pattern使用
		},
		out: { //控制台输出
        	type: 'stdout'
		}
 	},
  	categories: {
  		default: { //必须定义一个默认的category
    		appenders: ['out'], level: 'info' 
 		},
    	access: { 
    		appenders: ['accessLog'], level: 'info' 
    	},
    	error: { 
    		appenders: ['errLog', 'out'], level: 'info' 
    	}
  	}
});

const routes = require('./routes/entrance')

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'views-js')))
app.use(express.static(path.join(__dirname, 'upload')))

app.use(cookieParser())

app.use(session({
	name: config.session.name,
	secret: config.session.secret,
	resave: true,
	saveUninitialized: false,
	cookie: {
		maxAge: config.session.maxAge
	}
}))

//使用这个可以减少前端的modal使用
app.use(flash())

app.use(log4js.connectLogger(log4js.getLogger('access'), { level: 'info' })) //每次请求都会自动记录到日志里面

app.use(formidable({
	uploadDir: path.join(__dirname, 'upload'),
	multiples: false,
	keepExtensions: true 
}))

app.locals.project = {
	title: config.title,
	description: config.description
}

app.use((req, res, next) => {
	res.locals.user = req.session.user
	res.locals.success = req.flash('success')[0]
	res.locals.error = req.flash('error')[0]
	res.locals.activeTab = null //因为每个页面都会有这个固定的
	//导航栏, 导航栏里面必须用到activeTab这个变量, 这里设置是为了解决某些页面不返回这个变量的问题, 比如注册登录等等...

	//帮助用户简化登陆
	res.locals.loginHelp = req.cookies.loginHelp

	next()
})

routes(app)

app.use((err, req, res, next) => {
	//对于我们主动抛出的异常， 一般来说 err.name 就是Error, 
	// 那么我们就可以对于主动抛出的异常和代码错误抛出的异常做出区分
	// 同时对于ajax和非ajax请求也做出区分，一般来说非ajax直接定向到404页面
	// ajax请求异常返回400状态码,
	// 人为抛出的异常返回异常信息
	// 系统异常返回固定的提示语句
	// 主要是懒...

	log4js.getLogger('error').info(err, '\n' + req.url + '\n')
	if (req.xhr) {
		if (err.name == 'Error') {
			res.status(400).end(err.message)
		} else {
			res.status(400).end('服务器异常, 请稍后重试')
		}
	} else {
		res.render('error')
	}
})

app.listen(config.port, config.hostname, function () {
	console.log(`server is running in ${config.hostname}: ${config.port}`)
})
~~~

app.js 里面, 我们设置了cookie, session, 异常处理器, 日志设置, 请求数据的解析设置等等

formidable 通过这个模块, 设置了上传文件的存放目录, 请求数据挂载在req.fields下面, 文件挂载在req.files下面 

我们设置了三个静态文件目录, public, upload, views-js<br>
public 是普通的一个静态文件, 存放样式表, logo等普通文件的
upload 是用来专门存放用户的头像的, 我们在ejs文件里经常要使用, 用绝对路径方便一点
view-js 是专门存放视图文件对应的js文件, 每个页面都会引入不同的js文件, 用绝对路径也是方便一点

错误处理<br>
在错误处理这里, 我们所遇到的所有异常都通过next(error)外下抛, 然后通过异常处理器接收, 在异常处理器里面
我们通过req.xhr来判断这个请求是不是ajax请求, 如果不是ajax请求, 那么我们直接返回错误界面
如果是ajax请求, 那么就判断错误类型, 如果是Error类型, 这个类型的错误都是我主动抛出的(比如用户名不存在, 密码错误等等), 那么把这个错误信息返回给用户,
如果不是Error类型, 那就是系统抛出的错误, 比如(sql 错误, 文件操作失败等等) , 那么就返回固定信息给用户.
<br>
<br>

## 项目运行
下载该项目后, 运行项目需要以下几个条件<br>
1. 安装Node.js 和 npm<br>
2. 安装Mongodb <br>
3. Mongodb服务已经启动<br>
4. 修改配置文件<br>

**安装Node.js 和 npm**<br>
  <font color='red'>注意: 一下所有命令前的 $ 都不要复制, 这只是终端命令的一个标识而已, 为了跟代码区分</font>
  一般来说, 安装Node.js的同时也会安装npm, 安装完成之后， 打开终端, 输入一下命令查看安装的版本
  ~~~
  $ node -v
  $ npm -v
  ~~~
  
  
  我们要安装项目运行所需的模块, 通过npm来安装, 但是npm是从国外的服务器上下载这些模块的, 所以速度会非常慢, 可能会导致安装失败等一系列问题, 所以我们需要使用国内镜像地址来下载.
  打开终端, 输入以下命令设置镜像地址, 
  ~~~
  $ npm config set registry https://registry.npm.taobao.org 
  ~~~
  
  设置完成之后通过以下命令查看npm配置
  ~~~
  $ npm config list
  ~~~
  
  以上设置成功后， 终端进入下载的项目文件目录, 比如下载的所有文件都放在D盘czlife这个文件里 那么
  ~~~
  $ d:
  $ cd czlife
  $ npm install
  ~~~
  
  然后等待所有模块下载即可, 下载安装完毕, czlife文件夹下面会出现一个node_modules文件夹, 里面就是我们所下载的所有模块
  
**安装MongoDB**<br>
  百度下载安装适合自己电脑系统的mongodb即可
  
**Mongodb服务已经启动**<br>
  一般来说, 4.0.0以上版本的mongodb在安装时, 如果不做自定义设置, 那么就会自动配置为windows service启动, 并且mondodb的默认端口为27017, 要查看自己电脑上的mongodb服务是否已经启动, 打开浏览器, 访问 localhost:27017, 
![](https://github.com/SJcz/czlife/blob/master/screenshot/mongodb1.png)
<br>
看到以上文字, 表示mongodb服务已正常启动, 也可以打开任务管理器, 选择服务, 在服务列表里查找MongoDB服务,可以看见正在运行,也表示服务已正常启动.
<br>
![](https://github.com/SJcz/czlife/blob/master/screenshot/mongodb2.png)
<br>

**修改配置文件**<br>
  请将配置文件中的主机名, 端口号, mongodb地址信息进行相应修改, 例如你想运行在在本机的8080端口, 那么port改成8080, mongodb地址如果在本机, 端口号一般不变, 数据库名字改成你自己的配置, 如果mongodb地址指向别的服务器, 那么改成指向的服务器地址即可, 假设配置如下
  ~~~
  module.exports = {
	port: 8080,
	hostname: '0.0.0.0',
	mongodb: 'mongodb://localhost:27017/czlife',
	session: {
		name: 'czlife',
		secret: 'czlife',
		maxAge: 1000 * 3600 * 2
	},
	cookieTime: 1000 * 3600 * 24 * 30,
	title: 'Life',
	description: 'just a simple website to record my daily life.',
	pageNumber: 15
}
  ~~~
  
以上步骤都完成之后, 终端进入czlife文件夹, 命令行输入 node app 启动项目, 
~~~
$ cd czlife
$ node app
~~~
控制台输出server is running in 0.0.0.0: 8080, 浏览器访问 localhost:8080 ,  即可进入项目.

## 项目页面效果

欢迎页面<br>
![](https://github.com/SJcz/czlife/blob/master/screenshot/welcome.png)

首页<br>
![](https://github.com/SJcz/czlife/blob/master/screenshot/index.png)

登陆页面<br>
![](https://github.com/SJcz/czlife/blob/master/screenshot/signin.png)

注册页面<br>
![](https://github.com/SJcz/czlife/blob/master/screenshot/signup.png)

文章创建页面<br>
![](https://github.com/SJcz/czlife/blob/master/screenshot/createArticle.png)

表格排序及图表显示<br>
![](https://github.com/SJcz/czlife/blob/master/screenshot/chartAndTable.png)

模态框提示<br>
![](https://github.com/SJcz/czlife/blob/master/screenshot/modal.png)
  
设置页面-用户信息<br>
![](https://github.com/SJcz/czlife/blob/master/screenshot/setting1.png)

设置页面-修改密码<br>
![](https://github.com/SJcz/czlife/blob/master/screenshot/setting2.png)

设置页面-用户中心<br>
![](https://github.com/SJcz/czlife/blob/master/screenshot/setting3.png)

设置页面-文章管理<br>
![](https://github.com/SJcz/czlife/blob/master/screenshot/setting4.png)

设置页面-个人界面<br>
![](https://github.com/SJcz/czlife/blob/master/screenshot/setting5.png)

设置页面-后台管理<br>
![](https://github.com/SJcz/czlife/blob/master/screenshot/setting6.png)
