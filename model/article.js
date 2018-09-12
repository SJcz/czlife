const articleModel = require('../db/mongodb').articleModel
//const marked = require('marked')

//用来提取文章内容的具体文本信息, 因为存到数据库的是html字符串, 
//在首页文章缩略图中, 我们要做文章内容缩略显示, 没法用substr
//
const cheerio = require('cheerio') 

const CommentOperation = require('./comment').CommentOperation

/*
articleModel.plugin('contentToHtml', {
	afterFind: (result) => {
		result.forEach((article) => {
			article.content = marked(article.content)
		})
		return result
	},
	afterFindOne: (article) => {
		if (article) {
			article.content = marked(article.content)
		}
		return article
	}
})
*/

//得到文章缩略内容, 在首页显示
articleModel.plugin('getAbbContent', {
	afterFind: (result) => {
		result.forEach((item) => {
			item.abbContent = cheerio.load(item.content).text()
		})
		return result
	},
	afterFindOne: (article) => {
		if (article) {
			article.abbContent = cheerio.load(article.content).text()
		}
		return article
	}
})

articleModel.plugin('getCommentCount', {
	afterFind: (result) => {
		return Promise.all(result.map((article) => {
			return CommentOperation.getCommentByArticle(article._id).then((comments) => {
				article.commentCount = comments.length
				return article
			})
		}))
	},
	afterFindOne: (article) => {
		if (article) {
			return CommentOperation.getCommentByArticle(article._id).then((comments) => {
				article.commentCount = comments.length
				return article
			})
		}
		return article
	}
})

module.exports.ArticleOperation = {
	createArticle: (article) => {
		return articleModel.create(article).exec()
	},

	getArticleByArticleId: (articleId) => {
		return articleModel.findOne({_id: articleId})
		.populate({path: 'author', model: 'author'})
		.addCreatedAt()
		.getCommentCount()
		.exec()
	},

	/*
	getSourceArticleByArticleId: (articleId) => {
		return articleModel.findOne({_id: articleId})
		.populate({path: 'author', model: 'author'})
		.addCreatedAt()
		.exec()
	},
	*/

	getArticleByTitle: (titleArr) => {
		return articleModel.find({$or: titleArr})
		.populate({path: 'author', model: 'author'})
		.sort({_id: -1})
		.addCreatedAt()
		.getCommentCount()
		.exec()
	},

	getPageArticle: (category, index, pageNumber) => {
		return articleModel.find({visibility: true, $or: category})
		.populate({path: 'author', model: 'author'})
		.sort({_id: -1})
		.limit(pageNumber)
		.skip((index - 1) * pageNumber)
		.addCreatedAt()
		.getCommentCount()
		.getAbbContent()
		.exec()
	},

	getAllArticle: () => {
		return articleModel.find()
		.populate({path: 'author', model: 'author'})
		.sort({_id: -1})
		.getCommentCount()
		.exec()
	},

	getArticleByCategory: (category) => {
		return articleModel.find({visibility: true, $or: category})
		.getCommentCount()
		.exec()
	}, 

	getArticleByUserId: (userId) => {
		return articleModel.find({visibility: true, author: userId})
		.populate({path: 'author', model: 'author'})
		.sort({_id: -1})
		.addCreatedAt()
		.getCommentCount()
		.exec()
	},

	getPrivateArticleByUserId: (userId) => {
		return articleModel.find({visibility: false, author: userId})
		.populate({path: 'author', model: 'author'})
		.sort({_id: -1})
		.addCreatedAt()
		.getCommentCount()
		.exec()
	},

	getArticleByArticleIds: (articleIds) => {
		return articleModel.find({$or: articleIds})
		.populate({path: 'author', model: 'author'})
		.addCreatedAt()
		.getCommentCount()
		.exec()
	},

	deleteArticleByArticleId: (articleId) => {
		return articleModel.remove({_id: articleId}).exec()
	},

	getHotArticle: () => {
		return articleModel.find({visibility: true})
		.sort({bt: -1})
		.limit(7)
		.getCommentCount()
		.exec()
	},

	getRecommendArticle: () => {
		return articleModel.find({visibility: true})
		.limit(7)
		.getCommentCount()
		.exec()
	},

	addArticleBT: (articleId) => {
		return articleModel.update({_id: articleId}, {$inc: {bt: 1}}).exec()
	},

	updateArticleByArticleId: (articleId, article) => {
		return articleModel.update({_id: articleId}, {$set: article}).exec()
	}

}