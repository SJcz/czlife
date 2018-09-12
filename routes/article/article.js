const express = require('express')
const moment = require('moment')
const router = express.Router()
const config = require('config-lite')(__dirname)

const ArticleOperation = require('../../model/article').ArticleOperation
const CommentOperation = require('../../model/comment').CommentOperation
const checkLogin = require('../../middleware/checkLoginStatus').checkLogin
const getHotArticle = require('../../middleware/getLeaderInfo').getHotArticle
const getRecommendArticle = require('../../middleware/getLeaderInfo').getRecommendArticle
const AuthorOperation = require('../../model/author').AuthorOperation


//对于请求中发生的异常， 我们到底是返回400的状态码还是定向到404页面， 这些是根据
//前端请求是否是ajax来判断的， 如果是ajax请求， 返回400状态码，前端会根据这个状态码做出反应
//如果不是ajax请求， 直接定向到404页面即可

router.get('/create', checkLogin, getHotArticle, getRecommendArticle, function (req, res, next) {
	//status2 表示禁文状态
	if (req.session.user.status2 == 1) {
		req.flash('error', '由于违规, 你已被禁止发布文章')
		return res.redirect('/index')
	}
	res.render('article/article-create')
})

router.post('/create', checkLogin, function (req, res, next) {
	//status2 表示禁文状态
	if (req.session.user.status2 == 1) {
		return next(new Error('由于违规, 你已被禁止发布文章'))
	}
	var fields = req.fields

	var article = {
		title: fields.title,
		content: fields.content,
		category: fields.category,
		author: req.session.user._id,
		visibility: fields.visibility == 'true' ? true : false,
		lastModify: Date.now()
	}

	Promise.all([
		AuthorOperation.addUserScore(req.session.user._id, config.articleScore),
		ArticleOperation.createArticle(article)
	])
	.then((result) => {
		req.flash('success', '发表文章成功')
		res.status(200).type('json').end(JSON.stringify(result[1].ops[0]))
	})
	.catch(next)
})

router.post('/delete', checkLogin, function (req, res, next) {
	var articleId = req.fields.articleId

	ArticleOperation.getArticleByArticleId(articleId)
	.then((article) => {
		if (req.session.user._id != article.author._id && req.session.user.group != 'admin') {
			throw new Error('权限不足')
		}
		return Promise.all([
			ArticleOperation.deleteArticleByArticleId(articleId),
			CommentOperation.deleteCommentByArticle(articleId)
		]).then(() => {
			req.flash('success', '文章删除成功...')
			res.status(200).end('文章删除成功...')
		})
	}).catch(next)
})

router.post('/modify', checkLogin, function (req, res, next) {
	var fields = req.fields

	if (req.session.user._id != fields.userId) {
		//return res.status(400).end('权限不足')
		return next(new Error('权限不足'))
	}

	var article = {
		title: fields.title,
		content: fields.content,
		category: fields.category,
		visibility: fields.visibility == 'true'? true : false,
		lastModify: Date.now()
	}

	ArticleOperation.updateArticleByArticleId(fields.articleId, article)
	.then((result) => {
		if (!result) {
			throw new Error('更新数据失败, 找不到该文章')
		}
		req.flash('success', '文章修改成功')
		res.status(200).end(fields.articleId)
	}).catch(next)
})

router.get('/modify/:articleId', checkLogin, getHotArticle, getRecommendArticle, function (req, res, next) {
	var articleId = req.params.articleId

	ArticleOperation.getArticleByArticleId(articleId).then((result) => {
		if (result) {
			if (result.author._id != req.session.user._id) {
				throw new Error('权限不足')
			}
			return res.render('article/article-modify', {article: result})
		}
		throw new Error('抱歉, 你访问的文章不存在...')
	}).catch(next)
})

router.get('/search', getHotArticle, getRecommendArticle, function (req, res, next) {
	var title = req.query.title

	var titleArr = []

	title.split(/\s+/).forEach((item) => {
		titleArr.push({title: new RegExp(item)})
	})

	ArticleOperation.getArticleByTitle(titleArr).then((result) => {
		res.render('article/article-search', {articleList: result})
	}).catch(next)
})

router.get('/:articleId', getHotArticle, getRecommendArticle, function (req, res, next) {
	var articleId = req.params.articleId

	//私密文章除了作者之外, 其他人无法访问, 至于管理员行不行....我最大, 我可以
	ArticleOperation.getArticleByArticleId(articleId)
	.then((article) => {
		//console.log(req.session.user._id, article.author)
		if (article) {
			if (article.visibility == false) {
				if (req.session.user && (req.session.user.group == 'admin' || req.session.user._id == article.author._id)) {
					return article
				} else {
					throw new Error('抱歉, 你无权限访问这篇文章...')
				}
			} else {
				return article
			}
		} else {
			throw new Error('抱歉, 你访问的文章不存在...')
		}
	}).then((article) => {
		article.lastModify = moment(article.lastModify).format('YYYY-MM-DD HH:mm:ss') //格式化时间
		return Promise.all([
			ArticleOperation.addArticleBT(articleId),
			CommentOperation.getCommentByArticle(articleId)
		]).then((result) => {
			return res.render('article/article-detail', {article: article, commentList: result[1]})
		})	
	}).catch(next)

	/*
	Promise.all([
		ArticleOperation.getArticleByArticleId(articleId),
		ArticleOperation.addArticleBT(articleId),
		CommentOperation.getCommentByArticle(articleId)
	]).then((result) => {
		if (result[0]) {
			return res.render('article/article-detail', {article: result[0], commentList: result[2]})
		}
		throw new Error('抱歉， 你访问的文章不存在...')
	}).catch(next)
	*/
})

module.exports = router