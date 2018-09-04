const ArticleOperation = require('../model/article').ArticleOperation
const log4js = require('log4js')

module.exports = {
	getHotArticle: (req, res, next) => {
		ArticleOperation.getHotArticle().then((result) => {
			res.locals.hotArticle = result
			next()
		}).catch((err) => {
			log4js.getLogger('error').info(err, '\n' + req.url + '\n')
			res.locals.hotArticleMessage = []
			next()
		})
	},

	getRecommendArticle: (req, res, next) => {
		ArticleOperation.getRecommendArticle().then((result) => {
			res.locals.recommendArticle = result
			next()
		}).catch((err) => {
			log4js.getLogger('error').info(err, '\n' + req.url + '\n')
			res.locals.recommendArticle = []
			next()
		})
	},
}