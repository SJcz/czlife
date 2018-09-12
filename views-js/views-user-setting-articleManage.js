function showConfirmModal (articleId) {
	console.log(articleId)
	//首先对模态框的确认按钮解除所有事件绑定
	$('#comfirm-prompt-modal .btn-danger').unbind()  

	//设置模态框的文本显示信息 
	$('#comfirm-prompt-modal .modal-body').text('确定删除文章吗? 删除之后无法恢复...')
	$('#comfirm-prompt-modal .btn-danger').text('确定删除')

	//模态框确认按钮绑定事件
	$('#comfirm-prompt-modal .btn-danger').click(() => {
		sendRequest(articleId)
	})

	//模态框显示
	$('#comfirm-prompt-modal').modal('show')
} 

function sendRequest (articleId) {
	$.post('/article/delete', {articleId: articleId}).done(() => {
		window.location.reload()
	}).fail((err) => {
		console.log(err)
		$('#comfirm-prompt-modal').modal('hide')
		$('#simple-prompt-modal .modal-body').text(err.responseText)
		$('#simple-prompt-modal').modal('show')
	})
}