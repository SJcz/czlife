const express = require('express')
const router = express.Router()

const checkLogin = require('../../middleware/checkLoginStatus').checkLogin

router.get('/', checkLogin, function (req, res, next) {
	req.session.user = null
	req.flash('success', '退出成功')
	res.redirect('/index')
})

module.exports = router