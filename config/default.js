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