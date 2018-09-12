const express = require('express')
const router = express.Router()
const fs = require('fs')
const sha1 = require('sha1')
const path = require('path')

const checkLogin = require('../../middleware/checkLoginStatus').checkLogin
const AuthorOperation = require('../../model/author').AuthorOperation
const ArticleOperation = require('../../model/article').ArticleOperation
const CommentOperation = require('../../model/comment').CommentOperation
const StyleOperation = require('../../model/style').StyleOperation


function sortData (arr, param) {
	var compare = function (arg1, arg2) {
		if (arg1[param] > arg2[param]) {
			return -1
		} else if (arg1[param] < arg2[param]) {
			return 1
		} else {
			return 0
		}
	}
	arr = arr.sort(compare)
	return arr
}


router.post('/modifyUserInfo', checkLogin, function (req, res, next) {
	var fields = req.fields
	var files = req.files
	var folderPath = path.join(__dirname, '../../upload/' + fields.userId)
	var avatar = ''

	try {
		if (fields.userId != req.session.user._id) {
			throw new Error('权限不足')
		}

		if (!fs.existsSync(folderPath)) {
			fs.mkdirSync(folderPath)
		}

		if (files.avatar) {
			var pathArr = files.avatar.path.split(path.sep)
			fs.renameSync(files.avatar.path, path.join(folderPath, pathArr[pathArr.length - 1]));

			avatar = fields.userId + '/' + pathArr[pathArr.length - 1]
		}
	} catch (err) {
		if (files.avatar) {
			if (fs.existsSync(files.avatar.path)) {
				fs.unlinkSync(files.avatar.path)
			}
		}
		return next(err)
	}
	
	var user = {
		nickname: fields.nickname,
		gender: fields.gender,
		bio: fields.bio,
	}

	if (avatar) {
		user.avatar = avatar
	}

	AuthorOperation.getUserByNickname(fields.nickname)
	.then((result) => {
		if (result && result.nickname != req.session.user.nickname) {
			throw new Error('该昵称已存在, 请更换其他昵称')
		}
		return AuthorOperation.updateUserInfoByUserId(fields.userId, user)
	})
	.then(() => {
		return AuthorOperation.getUserByUserId(fields.userId)
	})
	.then((result) => {
		if (result) {
			req.session.user = result
		}
		req.flash('success', '用户信息更新成功')
		res.status(200).end('用户信息更新成功')
	})
	.catch(next)
})

router.post('/changePassword', checkLogin, function (req, res, next) { 
	var fields = req.fields

	if (fields.userId != req.session.user._id) {
		return next(new Error('权限不足'))
	}

	var user = {
		password: sha1(fields.newPassword)
	}

	AuthorOperation.getUserByUserId(fields.userId).then((result) => {
		if (!result) {
			throw new Error('找不到该用户')
		}
		if (sha1(fields.oldPassword) != result.password) {
			throw new Error('输入密码错误')
		}
		return AuthorOperation.updateUserInfoByUserId(fields.userId, user)
	}).then(() => {
		req.flash('success', '密码修改成功')
		res.status(200).end('密码修改成功')
	}).catch(next)
})

router.post('/savePageStyle', checkLogin, function (req, res, next) { 
	var fields = req.fields

	if (fields.userId != req.session.user._id) {
		return next(new Error('权限不足'))
	}

	var style = {
		nav: fields.nav, 
		back: fields.back,
		panel: fields.panel
	}

	StyleOperation.updateStyle(fields.userId, style).then(() => {
		req.flash('success', '保存用户样式成功')
		res.status(200).end()
	}).catch(next)
})

router.post('/deleteUser', checkLogin, function (req, res, next) {
	var userId = req.fields.userId

	if (req.session.user.group != 'admin') {
		return next(new Error('权限不足'))
	}

	AuthorOperation.deleteUserByUserId(userId)
	.then(() => {
		req.flash('success', '用户删除成功')
		res.status(200).end()
	}).catch(next)
})

router.post('/changeUserStatus', checkLogin, function (req, res, next) {
	var userId = req.fields.userId

	if (req.session.user.group != 'admin') {
		return next(new Error('权限不足'))
	}
	
	delete req.fields.userId

	for (var k in req.fields) {
		req.fields[k] = parseInt(req.fields[k])
	}

	AuthorOperation.updateUserInfoByUserId(userId, req.fields)
	.then(() => {
		res.status(200).end()
	})
	.catch(next)
})

router.get('/:userId', checkLogin, function (req, res, next) {
	var userId = req.params.userId
	var tab = req.query.tab

	if (!tab || ['userInfo', 'changePassword', 'userCenter', 'articleManage', 'uiManage', 'adminManage'].indexOf(tab) == -1) {
		tab = 'userInfo'
	}

	if (userId != req.session.user._id) {
		return next(new Error('权限不足'))
	}

	if (tab == 'userInfo') {
		AuthorOperation.getUserByUserId(userId).then((user) => {
			if (!user) {
				return res.render('setting/user-setting', {errorMessage: '找不到该用户信息', setting_tab: tab})
			}
			res.render('setting/user-setting', {errorMessage: '', setting_tab: 'userInfo'})
		}).catch(next)
	} else if (tab == 'changePassword') {
		res.render('setting/user-setting', {setting_tab: tab})
	} else if (tab == 'userCenter') {
		AuthorOperation.getAllUser().then((result) => {
			result = sortData(result, 'score')
			res.render('setting/user-setting', {
				setting_tab: tab,
				allAuthors: result
			})
		}).catch(next)
	} else if (tab == 'articleManage') {
		CommentOperation.getCommentByUser(userId).then((comments) => {
			var articleIds = [{_id: '数组不能为空， 不然会发生异常'}]
			comments.forEach((comment) => {
				articleIds.push({_id: comment.article})
			})

			return Promise.all([
				ArticleOperation.getArticleByUserId(userId),
				ArticleOperation.getArticleByArticleIds(articleIds),
				ArticleOperation.getPrivateArticleByUserId(userId)
			])
		}).then((result) => {
			res.render('setting/user-setting', {
				errorMessage: '', 
				setting_tab: tab, 
				publishedArticleList: result[0],
				commentedArticleList: result[1],
				privateArticleList: result[2]
			})
		}).catch(next)
	} else if (tab == 'uiManage') {
		StyleOperation.getStyleByUserId(userId).then((result) => {
			res.render('setting/user-setting', {
				errorMessage: '', 
				setting_tab: tab,
				userStyle: result[0] ? result[0] : {} //防止空指针异常，前端界面会使用userStyle.back...
			})
		}).catch(next)
	} else if (tab == 'adminManage') {
		if (req.session.user.group != 'admin') {
			return next(new Error('权限不足'))
		}

		Promise.all([
			ArticleOperation.getAllArticle(),
			AuthorOperation.getAllUser()
		]).then((result) => {
			res.render('setting/user-setting', {
				setting_tab: tab,
				allArticles: result[0],
				allAuthors: result[1]
			})
		}).catch(next)
	}
})



module.exports = router
