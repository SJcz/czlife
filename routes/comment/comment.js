const express = require('express')
const router = express.Router()

const CommentOperation = require('../../model/comment').CommentOperation
const checkLogin = require('../../middleware/checkLoginStatus').checkLogin

router.post('/create', checkLogin, function (req, res, next) {
	let fields = req.fields

	var comment = {
		author: req.session.user._id,
		content: fields.comment_content,
		article: fields.articleId
	}

	CommentOperation.createComment(comment).then((result) => {
		req.flash('success', '提交评论成功...')
		res.end(JSON.stringify(result.ops[0]))
	}).catch(next)
})

module.exports = router