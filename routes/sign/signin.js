const express = require('express')
const router = express.Router()
const sha1 = require('sha1')
const config = require('config-lite')(__dirname)

const AuthorOperation = require('../../model/author').AuthorOperation
const checkNotLogin = require('../../middleware/checkLoginStatus').checkNotLogin

router.get('/', checkNotLogin, function (req, res, next) {
	res.render('sign/signin');
})

router.post('/', checkNotLogin, function (req, res, next) {
	var fields = req.fields
	var username = fields.username
	var password = sha1(fields.password)

	AuthorOperation.getUserByUsername(username).then((user) => {
		//console.log(user)
		if (!user || user.password != password) {
			return next(new Error('用户不存在或密码不正确'))
		}
		delete user.password
		req.session.user = user
		req.flash('success', '登陆成功')
		if (fields.remember) {
			res.cookie('loginHelp', {username: fields.username, password: fields.password}, { maxAge: config.cookieTime })
		} else {
			//res.clearCookie('loginHelp')
		}
		res.end()
	}).catch(next)
})

module.exports = router