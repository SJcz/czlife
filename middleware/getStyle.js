const StyleOperation = require('../model/style').StyleOperation
const log4js = require('log4js')

module.exports = {
	getUserStyle: (req, res, next) => {
		if (!req.session.user) {
			res.locals.userStyle = {}
			next()
		} else {
			StyleOperation.getStyleByUserId(req.session.user._id).then((result) => {
				if (result.length > 0) {
					res.locals.userStyle = result[0]
				} else {
					res.locals.userStyle = {}
				}
				next()
			}).catch((err) => {
				log4js.getLogger('error').info(err, '\n' + req.url + '\n')
				res.locals.userStyle = {}
				next()
			})
		}
	}
}