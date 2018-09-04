const express = require('express')
const sha1 = require('sha1')
const router = express.Router()
const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')

const AuthorOperation = require('../../model/author').AuthorOperation
const checkNotLogin = require('../../middleware/checkLoginStatus').checkNotLogin

router.get('/', checkNotLogin, function (req, res, next) {
	res.render('sign/signup')
})

router.post('/', checkNotLogin, (req, res, next) => {
	let fields = req.fields
	var avatar = 'default/et.jpg'

	if (fields.gender == 'm') {
		avatar = 'default/tom.jpg'
	} else if (fields.gender == 'w') {
		avatar = 'default/nan.jpg'
	}

	var user = {
		name: fields.username,
		password: sha1(fields.password),
		gender: fields.gender,
		avatar: avatar,
		nickname: fields.username,
		bio: fields.bio
	} 

	AuthorOperation.getUserByUsername(fields.username).then((rst) => {
		if (rst) {
			throw new Error('用户名已存在')
		}
		return AuthorOperation.createUser(user)
	}).then((result) => {
		//ajax不支持重定向， 这里只设置session即可
		delete result.ops[0].password
		result.ops[0].created_at = moment(objectIdToTimestamp(result.ops[0]._id)).format('YYYY-MM-DD HH:mm')
		req.session.user = result.ops[0]
		req.flash('success', '注册成功')
		res.end()
	}).catch(next)
})

module.exports = router