const authorModel = require('../db/mongodb').authorModel
const CommentOperation = require('./comment').CommentOperation
const ArticleOperation = require('./article').ArticleOperation

authorModel.plugin('getArticleCount', {
	afterFind: (result) => {
		return Promise.all(result.map((user) => {
			return ArticleOperation.getArticleByUserId(user._id).then((articles) => {
				user.articleCount = articles.length
				return user
			})
		}))
	},
	afterFindOne: (user) => {
		if (user) {
			return ArticleOperation.getArticleByUserId(user._id).then((articles) => {
				user.articleCount = articles.length
				return user
			})
		}
		return user
	}
})

authorModel.plugin('getCommontCount', {
	afterFind: (result) => {
		return Promise.all(result.map((user) => {
			return CommentOperation.getCommentByUser(user._id).then((comments) => {
				user.commentCount = comments.length
				return user
			})
		}))
	},
	afterFindOne: (user) => {
		if (user) {
			return CommentOperation.getCommentByUser(user._id).then((comments) => {
				user.commentCount = comments.length
				return user
			})
		}
		return user
	}
})

module.exports.AuthorOperation = {
	createUser: (user) => {
		return authorModel.create(user).exec()
	},

	getAllUser: () => {
		return authorModel
		.find()
		.addCreatedAt()
		.getArticleCount()
		.getCommontCount()
		.exec()
	},

	getUserByUserId: (userId) => {
		return authorModel.findOne({_id: userId}).addCreatedAt().exec()
	},

	getUserByUsername: (username) => {
		return authorModel.findOne({name: username}).addCreatedAt().exec()
	},

	getUserByNickname: (nickname) => {
		return authorModel.findOne({nickname: nickname}).addCreatedAt().exec()
	},

	updateUserInfoByUserId: (userId, user) => {
		return authorModel.update({_id: userId}, {$set: user}).exec()
	},

	deleteUserByUserId: (userId) => {
		return authorModel.remove({_id: userId}).exec()
	} 
}