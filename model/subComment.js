const subCommentModel = require('../db/mongodb').subCommentModel

module.exports.SubCommentOperation = {
	createSubComment: (subComment) => {
		return subCommentModel.create(subComment).exec()
	},

	deleteSubCommentByParentComment: (commentId) => {
		return subCommentModel.remove({parentComment: commentId}).exec()
	},

	getSubCommentByParentComment: (commentId) => {
		return subCommentModel.find({parentComment: commentId})
		.populate({path: 'srcAuthor', model: 'author'})
		.populate({path: 'tarAuthor', model: 'author'})
		.sort({_id: 1})
		.addCreatedAt()
		.exec()
	},
}
