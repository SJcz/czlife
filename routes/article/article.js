const express = require('express')
const router = express.Router()

const ArticleOperation = require('../../model/article').ArticleOperation
const CommentOperation = require('../../model/comment').CommentOperation
const checkLogin = require('../../middleware/checkLoginStatus').checkLogin
const getHotArticle = require('../../middleware/getLeaderInfo').getHotArticle
const getRecommendArticle = require('../../middleware/getLeaderInfo').getRecommendArticle


//对于请求中发生的异常， 我们到底是返回400的状态码还是定向到404页面， 这些是根据
//前端请求是否是ajax来判断的， 如果是ajax请求， 返回400状态码，前端会根据这个状态码做出反应
//如果不是ajax请求， 直接定向到404页面即可

router.get('/create', checkLogin, getHotArticle, getRecommendArticle, function (req, res, next) {
	res.render('article/article-create')
})

router.post('/create', checkLogin, function (req, res, next) {
	var fields = req.fields

	var article = {
		title: fields.title,
		content: fields.content,
		category: fields.category,
		author: req.session.user._id,
		visibility: fields.visibility == 'true' ? true : false 
	}

	ArticleOperation.createArticle(article).then((result) => {
		req.flash('success', '发表文章成功')
		res.end(JSON.stringify(result.ops[0]))
	}).catch(next)
})

router.get('/delete', checkLogin, function (req, res, next) {
	var articleId = req.query.articleId

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
			res.end('文章删除成功...')
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
		visibility: fields.visibility == 'true'? true : false
	}

	ArticleOperation.updateArticleByArticleId(fields.articleId, article)
	.then((result) => {
		if (!result) {
			throw new Error('更新数据失败, 找不到该文章')
		}
		req.flash('success', '文章修改成功')
		res.end(fields.articleId)
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
	let articleId = req.params.articleId

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
})

module.exports = router