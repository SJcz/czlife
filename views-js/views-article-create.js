$(document).ready(() => {
	$('#createArticle-summernote').summernote({
		height: 500,
		lang: 'zh-CN'
	})
	$('#article-create-form').bootstrapValidator({
		//excluded:[":hidden",":disabled",":not(visible)"] ,//bootstrapValidator的默认配置
    	excluded:[],//关键配置，表示表单元素都要验证
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
			/*
			content: {
				validators: {
                    notEmpty: {
                        message: '文章内容不能为空'
                    },
                    callback: {
                    	callback: function (value, validator, $field) {
                    		console.log('111', $($('textarea[name="content"]').val()).text())
                    		if (!$($('textarea[name="content"]').val()).text()) {
                    			return {
                    				message: '文章内容不能为空',
                    				valid: false
                    			}
                    		} else {
                    			return true
                    		}
                    	}
                    }
                }
			}
			*/
		}
	})

	$('#createArticle-submitBtn').click(() => {
		$('#article-create-form').data('bootstrapValidator').validate()

		if ($('#article-create-form').data('bootstrapValidator').isValid()) {
			//手动对content进行验证， 因为summernote的存在,导致这里的验证结果表现不如人意
			if (!$($('textarea[name="content"]').val()).text()) {
				$('#simple-prompt-modal .modal-body').text('亲, 文章内容可不能为空呢...')
				$('#simple-prompt-modal').modal('show')
			} else {
				createArticle_sendRequest()
			}
		}
	})

	function createArticle_sendRequest () {
		$.post('/article/create', $('#article-create-form').serialize())
		.done((result) => {
			//result = JSON.parse(result)
			window.location.href = '/article/' + result._id
		})
		.fail((err) => {
			$('#simple-prompt-modal .modal-body').text(err.responseText)
			$('#simple-prompt-modal').modal('show')
		})
	}
})