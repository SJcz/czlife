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
	pageNumber: 15,  //文章分页是每页最多显示数目
	articleScore: 5,  //每篇文章增加5积分
	commentScore: 1   //每个评论增加1积分
}