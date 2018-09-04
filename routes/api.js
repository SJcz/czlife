const express = require('express')
const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')
const router = express.Router()

const ArticleOperation = require('../model/article').ArticleOperation
const CommentOperation = require('../model/comment').CommentOperation
const AuthorOperation = require('../model/author').AuthorOperation
const VisitCountOperation = require('../model/visitCount').VisitCountOperation

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

router.get('/getAllUser', function (req, res, next) {
	var sort = req.query.sort

	AuthorOperation.getAllUser().then((result) => {
		result = sortData (result, sort)
		res.end(JSON.stringify(result))
	}).catch((err) => {
		console.log(err.message)
		res.status(400).end('得到表格信息异常...')
	})
})

router.get('/getChartData', function (req, res, next) {
	var category = req.query.category

		// date.getTime() 得到的是1970年到格林威治标准时间的毫秒数， 本地时间要加上8个小时
		// n那我们就得到6天之前的时间，要得到6天之前的0点时间, ....有点麻烦的哦
		/*
		var date = new Date(
			new Date(new Date().getTime() - 6 * 24 * 3600 * 1000 + 8 * 3600 * 1000).toLocaleDateString().replace(/\//g, '-'))
		*/
		
		// 之后我想到一个简单的解决办法，既然是得到最近七天的访问数据，那我直接从数据库
		// 获取最新的7条数据不就行了吗，因为每一行数据都代表一天
		// 如果获取最近半年的访问量， 那么我获取最新的190行数据就可以了(有的月有31天， 所以取稍大一点的日期)
		// 按照日期排列，对每一行数据分析其中的月份，相同月份累加，然后一旦两行数据月份不一致，就可以知道是新的月份了
		// 重新累加新的月份的访问量即可

	if (category == 'visit') {
		//得到最近7天访问量
		VisitCountOperation.getVisitCount(7)
		.then((result) => {
			return res.end(JSON.stringify(result))
		}).catch((err) => {
			console.log(err.message)
			res.status(400).end('得到访问量失败')
		})
	} else if (category == 'article') {
		ArticleOperation.getAllArticle()
		.then((result) => {
			var returnValue = getCountGroupByDate(result)
			
			return res.end(JSON.stringify(returnValue))
		}).catch((err) => {
			console.log(err.message)
			res.status(400).end('得到文章量失败')
		})
	} else if (category == 'comment') {
		CommentOperation.getAllComment()
		.then((result) => {
			var returnValue = getCountGroupByDate(result)
			
			return res.end(JSON.stringify(returnValue))
		}).catch((err) => {
			console.log(err.message)
			res.status(400).end('得到评论量失败')
		})
	}
})

function getCountGroupByDate (result) {
	var returnValue = []
	for (var i = 0; i < result.length; i++) {
		var date = moment(objectIdToTimestamp(result[i]._id)).format('YYYY-MM-DD')
		if (i == 0) {
			returnValue.push({date: date, count: 1})
			continue
		}
		if (date == moment(objectIdToTimestamp(result[i - 1]._id)).format('YYYY-MM-DD')) {
			for (var j = 0; j < returnValue.length; j++) {
				if (returnValue[j].date == date) {
					returnValue[j].count += 1
					break
				}
			}
		} else {
			if (returnValue.length == 7) {
				break
			} else {
				returnValue.push({date: date, count: 1})
			}
		}
	}
	return returnValue
}


module.exports = router