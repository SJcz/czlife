const styleModel = require('../db/mongodb').styleModel

module.exports.StyleOperation = {
	updateStyle: (authorId, style) => {
		return styleModel.update({author: authorId}, {$set: style}, {upsert: true}).exec()
	},

	getStyleByUserId: (userId) => {
		return styleModel.find({author: userId}).exec()
	}
}
