$(document).ready(() => {
	$('#signin-form').bootstrapValidator({
		feedbackIcons: {
			valid: 'glyphicon glyphicon-ok',
			invalid: 'glyphicon glyphicon-remove',
			validating: 'glyphicon glyphicon-refresh'
		},
		live: 'enabled',
		fields: {
			username: {
				validators: {
					notEmpty: {
						message: '用户名不能为空'
					},
					/*
					stringLength: {
						min: 6,
						max: 11,
						message: '用户名的长度必须在6 ~ 11 范围内'
					},
					regexp: {
						regexp: /^[a-zA-Z0-9_\.]+$/,
						message: '用户名由数字, 大小写字母, 点和下划线组成'
					}
					*/
				}
			},
			password: {
				validators: {
                    notEmpty: {
                        message: '密码不能为空'
                    },
                    /*
                    stringLength: {
                    	min: 6,
                    	max: 11,
                    	message: '密码长度必须在6 ~ 11 范围内'
                    }
                    */
                }
			}
		}
	})

	$('#signin-submitBtn').click(() => {
		$('#signin-form').data('bootstrapValidator').validate()

		if ($('#signin-form').data('bootstrapValidator').isValid()) {
			signin_sendRequest()
		}
	})

	$('#signin-resetBtn').click(() => {
		$('#signin-form')[0].reset()
		$('#signin-form').data('bootstrapValidator').resetForm()
	})

	function signin_sendRequest () {
		
		$.post('/signin', $('#signin-form').serialize())
		.done((result) => {
			//console.log(result)
			window.location.href = '/index'
		})
		.fail((err) => {
			$('#sign-modal .modal-body').text(err.responseText)
			$('#sign-modal').modal('show')
		})
	}
})