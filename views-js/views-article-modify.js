$(document).ready(() => {
	$('#modifyArticle-summernote').summernote({
		height: 500,
		lang: 'zh-CN'
	})
	$('#article-modify-form').bootstrapValidator({
		feedbackIcons: {
			valid: 'glyphicon glyphicon-ok',
			invalid: 'glyphicon glyphicon-remove',
			validating: 'glyphicon glyphicon-refresh'
		},
		live: 'enabled',
		fields: {
			title: {
				validators: {
					notEmpty: {
						message: '文章标题不能为空'
					},
					stringLength: {
						min: 1,
						max: 30,
						message: '标题的长度必须在1 ~ 30 范围内'
					}
				}
			},
			content: {
				validators: {
                    notEmpty: {
                        message: '文章内容不能为空'
                    }
                }
			}
		}
	})

	$('#modifyArticle-submitBtn').click(() => {
		$('#article-modify-form').data('bootstrapValidator').validate()

		if ($('#article-modify-form').data('bootstrapValidator').isValid()) {
			modifyArticle_sendRequest()
		}
	})

	function modifyArticle_sendRequest () {
		$.post('/article/modify', $('#article-modify-form').serialize())
		.done((articleId) => {
			window.location.href = '/article/' + articleId
		})
		.fail((err) => {
			$('#article-modal .modal-body').text(err.responseText)
			$('#article-modal').modal('show')
		})
	}
})