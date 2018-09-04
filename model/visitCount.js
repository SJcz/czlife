const countModel = require('../db/mongodb').countModel

module.exports.VisitCountOperation = {
	updateCount: (date) => {
		return countModel.update({date: date}, {$inc: {visit: 1}}, {upsert: true}).exec()
	},

	getVisitCount: (number) => {
		return countModel.find().sort({date: -1}).limit(number).exec()
	}
}
