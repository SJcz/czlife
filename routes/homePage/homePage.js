const express = require('express')
const router = express.Router()
const config = require('config-lite')(__dirname)

const pageNumber = config.pageNumber

const ArticleOperation = require('../../model/article').ArticleOperation
const VisitCountOperation = require('../../model/visitCount').VisitCountOperation
const getHotArticle = require('../../middleware/getLeaderInfo').getHotArticle
const getRecommendArticle = require('../../middleware/getLeaderInfo').getRecommendArticle

var addVisitCount = function (req, res, next) {
	var dateArr = new Date().toLocaleDateString().split(/-|\//)

	var date = dateArr[0] + '-' + (dateArr[1].length == 1 ? ('0' +  dateArr[1]) : dateArr[1]) +
				'-' + (dateArr[2].length == 1 ? ('0' +  dateArr[2]) : dateArr[2])

	VisitCountOperation.updateCount(date).then(() => {
		next()
	}).catch((err) => {
		next()
	})
}

router.get('/', function (req, res, next) {
	res.render('homePage/welcome')
})

router.get('/index', addVisitCount, getHotArticle, getRecommendArticle, function (req, res, next) {
	//tab- all, node, note, front
	var index = req.query.index
	var tab = req.query.tab
	var category = []
	var numberList = []
	
	if (!index || isNaN(index) || index <= 0) {
		index = 1
	} else {
		index = parseInt(index)
	}

	if (['czlife', 'ask', 'note'].indexOf(tab) < 0) {
		tab = 'all'
	}

	if (tab == 'all') {
		category = [{category: 'czlife'}, {category: 'ask'}, {category: 'note'}]
	} else if (tab == 'czlife') {
		category = [{category: 'czlife'}]
	} else if (tab == 'ask') {
		category = [{category: 'ask'}]
	} else if (tab == 'note') {
		category = [{category: 'note'}]
	}

	Promise.all([
		ArticleOperation.getPageArticle(category, index, pageNumber),
		ArticleOperation.getArticleByCategory(category)
	]).then((result) => {
		
		var maxNumber = parseInt(result[1].length / pageNumber)
		if (result[1].length % pageNumber > 0) {
			maxNumber += 1
		}

		if (result[0].length == 0) {
			maxNumber > 5 ? maxNumber = 5 : null  // 
			for (var i = 1; i <= maxNumber; i++) {
				numberList.push(i)
			}
			index = 1
		} else {
			if (index - 2 >= 1) {
				numberList.push(index - 2)
			}
			if (index - 1 >= 1) {
				numberList.push(index - 1)
			}
			numberList.push(index)
			if (index + 1 <= maxNumber) {
				numberList.push(index + 1)
			}
			if (index + 2 <= maxNumber) {
				numberList.push(index + 2)
			}
		}

		res.render('homePage/homePage', {
			articleList: result[0], 
			numberList: numberList, 	
			activeIndex: index, 
			activeTab: tab, 
			maxNumber: maxNumber
		})
	}).catch(next)
})


module.exports = router