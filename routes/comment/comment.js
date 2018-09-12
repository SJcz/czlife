const express = require('express')
const router = express.Router()
const config = require('config-lite')(__dirname)

const CommentOperation = require('../../model/comment').CommentOperation
const checkLogin = require('../../middleware/checkLoginStatus').checkLogin
const AuthorOperation = require('../../model/author').AuthorOperation

router.post('/create', checkLogin, function (req, res, next) {
	//status1 表示禁言状态
	if (req.session.user.status1 == 1) {
		return next(new Error('由于违规, 你已被禁言'))
	}

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