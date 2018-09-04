module.exports = function (app) {


	//只要用户登陆了, 任何请求都需要获取用户的样式信息
	app.use(require('../middleware/getStyle').getUserStyle)

	app.use('/', require('./homePage/homePage'))
	app.use('/signup', require('./sign/signup'))
	app.use('/signin', require('./sign/signin'))
	app.use('/signout', require('./sign/signout'))

	app.use('/article', require('./article/article'))
	app.use('/comment', require('./comment/comment'))
	app.use('/subComment', require('./subComment/subComment'))
	
	app.use('/setting', require('./setting/setting'))

	app.use('/api', require('./api'))
}