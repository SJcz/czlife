//因为post请求基本上都是ajax请求， ajax请求不许接收返回数据， 对于res.redirect会导致请求的结果返回给ajax， 产生异常, 
//所以这里的post请求需要返回400状态码及异常提示信息，前端调用modal显示这些异常信息
module.exports = {
	checkLogin: (req, res, next) => {
		if (!req.session.user) {
			if (req.xhr) {
				return res.status(400).end('用户未登录, 需要登陆之后才能执行后续操作')
			} else {
				req.flash('error', '用户未登录, 需要登陆之后才能执行后续操作')
				return res.redirect('/index')
			}
			
		}
		next()
	},

	checkNotLogin: (req, res, next) => {
		//console.log(req.method)
		if (req.session.user) {
			if (req.xhr) {
				return res.status(400).end('用户已登录, 需要退出之后才能执行后续操作')	
			} else {
				req.flash('error', '用户已登陆, 需要退出之后才能执行后续操作')
				return res.redirect('back')
			}
		}
		next()
	}
} 