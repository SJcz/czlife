const express = require('express')
const router = express.Router()
const config = require('config-lite')(__dirname)

const CommentOperation = require('../../model/comment').CommentOperation
const checkLogin = require('../../middleware/checkLoginStatus').checkLogin
const AuthorOperation = require('../../model/author').AuthorOperation

router.post('/create', checkLogin, function (req, res, next) {
	var fields = req.fields

	var comment = {
		author: req.session.user._id,
		content: fields.comment_content,
		article: fields.articleId
	}
	Promise.all([
		AuthorOperation.addUserScore(req.session.user._id, config.commentScore),
		CommentOperation.createComment(comment)
	])
	.then((result) => {
		req.flash('success', '提交评论成功...')
		//console.log(result[1].ops[0])
		res.status(200).type('json').end(JSON.stringify(result[1].ops[0]))
	})
	.catch(next)
})

module.exports = router