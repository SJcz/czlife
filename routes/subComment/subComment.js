const express = require('express')
const router = express.Router()

const SubCommentOperation = require('../../model/subComment').SubCommentOperation
const checkLogin = require('../../middleware/checkLoginStatus').checkLogin

router.post('/create', checkLogin, function (req, res, next) {
	//status1 表示禁言状态
	if (req.session.user.status1 == 1) {
		return next(new Error('由于违规, 你已被禁言'))
	}
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