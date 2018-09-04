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

})

function showDeleteModal (articleId) {
	console.log(articleId)
	$('#delete-article-modal').modal({
		show: true
	})
	$('#delete-article-modal').attr('articleId', articleId)
} 