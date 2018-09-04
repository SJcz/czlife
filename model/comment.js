const commentModel = require('../db/mongodb').commentModel

const SubCommentOperation = require('./subComment').SubCommentOperation

commentModel.plugin('getSubComment', {
	afterFind: (result) => {
		return Promise.all(result.map((comment) => {
			return SubCommentOperation.getSubCommentByParentComment(comment._id).then((subComments) => {
				comment.subCommentList = subComments
				return comment
			})
		}))
	},
	afterFindOne: (comment) => {
		if (comment) {
			return SubCommentOperation.getSubCommentByParentComment(comment._id).then((subComments) => {
				comment.subCommentList = subComments
				return comment
			})
		}
		return comment
	}
})

module.exports.CommentOperation = {
	createComment: (comment) => {
		return commentModel.create(comment).exec()
	},

	getCommentByArticle: (articleId) => {
		return commentModel.find({article: articleId})
		.populate({path: 'author', model: 'author'})
		.sort({_id: 1})
		.addCreatedAt()
		.getSubComment()
		.exec()
	},

	getAllComment: () => {
		return commentModel.find().sort({_id: -1}).exec()
	},

	getCommentByUser: (userId) => {
		return commentModel.find({author: userId}).exec()
	},

	deleteCommentByArticle: (articleId) => {
		return commentModel.remove({article: articleId}).exec()
	}
}