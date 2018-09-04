$(document).ready(function () {
	$('#delete-article-modal .btn-danger').click(() => {
		var articleId = $('#delete-article-modal').attr('articleId')
		$.get('/article/delete?articleId=' + articleId)
		.done((result) => {
			console.log(result)
			window.location.reload()
		})
		.fail((err) => {
			console.log(err)
			$('#delete-article-modal').modal('hide')
			$('#setting-modal .modal-body').text(err.responseText)
			$('#setting-modal').modal('show')
		})
	})

	$('#delete-user-modal .btn-danger').click(() => {
		var userId = $('#delete-user-modal').attr('userId')
		$.get('/setting/deleteUser?userId=' + userId)
		.done((result) => {
			console.log(result)
			window.location.reload()
		})
		.fail((err) => {
			console.log(err)
			$('#delete-user-modal').modal('hide')
			$('#setting-modal .modal-body').text(err.responseText)
			$('#setting-modal').modal('show')
		})
	})

})

function showDeleteModal (articleId) {
	console.log(articleId)
	$('#delete-article-modal').modal({
		show: true
	})
	$('#delete-article-modal').attr('articleId', articleId)
} 

function showDeleteModal2 (userId) {
	console.log(userId)
	$('#delete-user-modal').modal({
		show: true
	})
	$('#delete-user-modal').attr('userId', userId)
} 
