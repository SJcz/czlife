$(document).ready(() => {
	$('.media-list .media').mouseenter(function () {
		$(this).children('.media-right').css('display', 'table-cell')
	})

	$('.media-list .media').mouseleave(function () {
		$(this).children('.media-right').css('display', 'none')
	})

	//关闭评论框的事件绑定
	$('#sub-comment-form-div .czlife-close-comment-div').click(function () {
		$('#sub-comment-form-div').css('display', 'none')
	})

	//刷新之后，清楚评论框内容
	$('#comment-create-form textarea[name="comment_content"]').val('')



	$('#comment-create-form').bootstrapValidator({
		feedbackIcons: {
			valid: 'glyphicon glyphicon-ok',
			invalid: 'glyphicon glyphicon-remove',
			validating: 'glyphicon glyphicon-refresh'
		},
		live: 'enabled',
		fields: {
			comment_content: {
				validators: {
					notEmpty: {
						message: '评论不能为空'
					},
					stringLength: {
						min: 1,
						max: 200,
						message: '评论的长度必须在1 ~ 200 范围内'
					}
				}
			}
		}
	})

	$('#sub-comment-create-form').bootstrapValidator({
		feedbackIcons: {
			valid: 'glyphicon glyphicon-ok',
			invalid: 'glyphicon glyphicon-remove',
			validating: 'glyphicon glyphicon-refresh'
		},
		live: 'enabled',
		fields: {
			subComment_content: {
				validators: {
					notEmpty: {
						message: '评论不能为空'
					},
					stringLength: {
						min: 1,
						max: 200,
						message: '评论的长度必须在1 ~ 200 范围内'
					}
				}
			}
		}
	})

	$('#createComment-submitBtn').click(() => {
		$('#comment-create-form').data('bootstrapValidator').validate()

		if ($('#comment-create-form').data('bootstrapValidator').isValid()) {
			createComment_sendRequest()
		}
	})

	$('#createSubComment-submitBtn').click(() => {
		$('#sub-comment-create-form').data('bootstrapValidator').validate()

		if ($('#sub-comment-create-form').data('bootstrapValidator').isValid()) {
			createSubComment_sendRequest()
		}
	})

	function createComment_sendRequest () {
		$.post('/comment/create', $('#comment-create-form').serialize())
		.done((result) => {
			//result = JSON.parse(result)
			//window.location.href = 'http://localhost:3000/article/' + result.article
			window.location.reload()
		})
		.fail((err) => {
			$('#article-modal .modal-body').text(err.responseText)
			$('#article-modal').modal('show')
		})
	}

	function createSubComment_sendRequest () {
		$.post('/subComment/create', $('#sub-comment-create-form').serialize())
		.done((result) => {
			//result = JSON.parse(result)
			//window.location.href = 'http://localhost:3000/article/' + result.article
			window.location.reload()
		})
		.fail((err) => {
			$('#article-modal .modal-body').text(err.responseText)
			$('#article-modal').modal('show')
		})
	}
})

function showSubCommentForm (tarAuthorId, tarAuthorName, commentId, ele, type) {
	$('#sub-comment-create-form input[name="tarAuthor"]').val(tarAuthorId)
	$('#sub-comment-create-form input[name="commentId"]').val(commentId)

	if (type == 'icon') {
		$('#sub-comment-form-div').appendTo($(ele).parent())
	}
	if (type == 'sub') {
		$('#sub-comment-form-div').appendTo($(ele).parent().parent().parent().parent().parent())
	}
	
	$('#sub-comment-form-div').css('display', 'block')
	$('#sub-comment-form-div textarea').attr('placeholder', '@' + tarAuthorName)
	$('#sub-comment-form-div textarea').val('')
}