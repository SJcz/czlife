const express = require('express')
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

