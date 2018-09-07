const Mongolass = require('mongolass')
const mongolass = new Mongolass()
const Schema = Mongolass.Schema
const config = require('config-lite')(__dirname)
const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')

mongolass.connect(config.mongodb, { useNewUrlParser: true })

mongolass.plugin('addCreatedAt', {
	afterFind: function (result) {
		result.forEach((item) => {
			item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm:ss')
		})
		return result
	},
	afterFindOne: function (result) {
		if (result) {
			result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm:ss')
		}
		return result
	}
})

const authorSchema = new Schema('authorSchema', {
	name: {type: 'string', required: true, index: true, unique: true},
	password: {type: 'string', required: true},
	gender: {type: 'string', enum: ['m', 'f', 'w'], default: 'f'},
	nickname: {type: 'string', unique: true},
	avatar: {type: 'string', required: true},
	group: {type: 'string', default: 'normal'},
	bio: {type: 'string'},
	score: {type: 'number', default: 0}
})

const authorModel = mongolass.model('author', authorSchema)

const articleSchema = new Schema('articleSchema', {
	title: {type: 'string', required: true},
	content: {type: 'string', required: true},
	category: {type: 'string', required: true},
	author: {type: Schema.Types.ObjectId, required: true, index: true},
	visibility: {type: 'boolean', default: true},
	bt: {type: 'number', default: 0},
	
})

const articleModel = mongolass.model('article', articleSchema)

const commentSchema = new Schema('commentSchema', {
	author: {type: Schema.Types.ObjectId, required: true},
	content: {type: 'string', required: true},
	article: {type: Schema.Types.ObjectId, required: true, index: true}
})

const commentModel = mongolass.model('comment', commentSchema)

const subCommentSchema = new Schema('subCommentSchema', {
	srcAuthor: {type: Schema.Types.ObjectId, required: true},
	tarAuthor: {type: Schema.Types.ObjectId, required: true},
	content: {type: 'string', required: true},
	parentComment: {type: Schema.Types.ObjectId, required: true}
})

const subCommentModel = mongolass.model('subComment', subCommentSchema)

const styleSchema = new Schema('styleSchema', {
	author: {type: Schema.Types.ObjectId, required: true},
	nav: {type: 'string'},
	back: {type: 'string'},
	panel: {type: 'string'}
})

const styleModel = mongolass.model('style', styleSchema)

const countSchema = new Schema('countSchema', {
	date: {type: 'string', unique: true},
	visit: {type: 'number', default: 0}
})

const countModel = mongolass.model('visitCount', countSchema)

module.exports.authorModel = authorModel
module.exports.articleModel = articleModel
module.exports.commentModel = commentModel
module.exports.subCommentModel = subCommentModel
module.exports.styleModel = styleModel
module.exports.countModel = countModel

//db.once('open', (result) => {
	//console.log('连接成功', result)

	/*
	var kittySchema = mongoose.Schema({
		name: String,
		body: String
	})
	*/

	/*
	kittySchema.methods.speak = function () {
		var getting = this.name ? 'my name is ' + this.name : 'I do not have a name'
		console.log(getting)
	}
	*/

	//console.log(kittySchema)

	//var kittyModel = mongoose.model('Kitty', kittySchema)

	//console.log(kittyModel);

	//var silence = new kittyModel({name: 'one', body: 'one'})

	//console.log(silence)
	//console.log(silence.name)
	//silence.speak()

	/*
	silence.save().then((result) => {
		console.log('save success', result)
	}).catch((err) => {
		console.log(err)
	})

	kittyModel.find().then((result) => {
		console.log(result)
		result.forEach((row) => {
			row.speak();
		})
	}).catch((err) => {
		console.log(err)
	})
	*/
//})

