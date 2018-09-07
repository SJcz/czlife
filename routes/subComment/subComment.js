const express = require('express')
const router = express.Router()

const SubCommentOperation = require('../../model/subComment').SubCommentOperation
const checkLogin = require('../../middleware/checkLoginStatus').checkLogin

router.post('/create', checkLogin, function (req, res, next) {
	var fields = req.fields

	var subComment = {
		srcAuthor: req.session.user._id,
		tarAuthor: fields.tarAuthor,
		content: fields.subComment_content,
		parentComment: fields.commentId
	}

	SubCommentOperation.createSubComment(subComment).then((result) => {
		req.flash('success', '提交评论成功...')
		res.status(200).type('json').end(JSON.stringify(result.ops[0]))
	}).catch(next)
})

module.exports = router