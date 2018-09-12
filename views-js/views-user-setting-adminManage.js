
//对于用户将要进行的动作, 我们可以预先设定好
// 101  删除用户
// 102  禁言用户
// 103  禁止用户发文
// 104  解除禁言
// 105  解除禁文
// 201  删除文章

function showConfirmModal (id, code) {
	var prompt = ''
	var submit = ''
	switch (code) {
		case 101:
			prompt = '确定删除用户吗? 删除之后无法恢复...'
			submit = '确定删除'
			break
		case 102:
			prompt = '确定禁言该用户吗? 禁言之后该用户无法参与任何评论...'
			submit = '确定禁言'
			break
		case 103:
			prompt = '确定对该用户禁止发文吗? 禁止之后该用户无法发布文章'
			submit = '确定禁止'
			break
		case 104:
			prompt = '确定解除禁言吗? 解除之后该用户可以参与评论'
			submit = '确定解除'
			break
		case 105:
			prompt = '确定解除禁文吗? 解除之后该用户可以发布文章'
			submit = '确定解除'
			break
		case 201:
			prompt = '确定删除文章吗? 删除之后无法恢复...'
			submit = '确定删除'
			break;
	}
	//首先对模态框的确认按钮解除所有事件绑定
	$('#comfirm-prompt-modal .btn-danger').unbind()  

	//设置模态框的文本显示信息 
	$('#comfirm-prompt-modal .modal-body').text(prompt)
	$('#comfirm-prompt-modal .btn-danger').text(submit)

	//模态框确认按钮绑定事件
	$('#comfirm-prompt-modal .btn-danger').click(() => {
		sendRequest(id, code)
	})

	//模态框显示
	$('#comfirm-prompt-modal').modal('show')
}

function sendRequest (id, code) {
	var postData = {}
	var url = ''
	switch (code) {
		case 101:
			postData.userId = id
			url = '/setting/deleteUser'
			break
		case 102:
			postData.userId = id
			postData.status1 = 1
			url = '/setting/changeUserStatus'
			break
		case 103:
			postData.userId = id
			postData.status2 = 1
			url = '/setting/changeUserStatus'
			break
		case 104:
			postData.userId = id
			postData.status1 = 0
			url = '/setting/changeUserStatus'
			break
		case 105:
			postData.userId = id
			postData.status2 = 0
			url = '/setting/changeUserStatus'
			break
		case 201:
			postData.articleId = id
			url = '/article/delete'
			break
	}
	$.post(url, postData).done(() => {
		window.location.reload()
	}).fail((err) => {
		console.log(err)
		$('#comfirm-prompt-modal').modal('hide')
		$('#simple-prompt-modal .modal-body').text(err.responseText)
		$('#simple-prompt-modal').modal('show')
	})
}


