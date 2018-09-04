$(document).ready(function () {
	$('')
	if ($('#setting-change-password-form').length > 0) {
		$('#setting-change-password-form').bootstrapValidator({
			feedbackIcons: {
				valid: 'glyphicon glyphicon-ok',
				invalid: 'glyphicon glyphicon-remove',
				validating: 'glyphicon glyphicon-refresh'
			},
			live: 'enabled',
			fields: {
				oldPassword: {
					validators: {
                    	notEmpty: {
                        	message: '密码不能为空'
                    	}
                	}
				}, 
				newPassword: {
					validators: {
                    	notEmpty: {
                        	message: '密码不能为空'
                    	},
                    	identical: {
							field: 'repeatPassword',
							message: '两次输入的密码不一致'
						},
                    	stringLength: {
                    		min: 6,
                    		max: 11,
                    		message: '密码长度必须在6 ~ 11 范围内'
                    	}
                	}
				}, 
				repeatPassword: {
					validators: {
						notEmpty: {
							message: '确认密码不能为空'
						},
						identical: {
							field: 'newPassword',
							message: '两次输入的密码不一致'
						}
					}
				},
			}
		})

		$('#setting-change-password-submitBtn').click(() => {
			$('#setting-change-password-form').data('bootstrapValidator').validate()

			if ($('#setting-change-password-form').data('bootstrapValidator').isValid()) {
				changePassword_sendRequest()
			}
		})
	}

	function changePassword_sendRequest () {
		$.post('/setting/changePassword', $('#setting-change-password-form').serialize())
		.done((result) => {
			//console.log(result)
			window.location.reload()
		})
		.fail((err) => {
        	console.log(err)
            $('#setting-modal .modal-body').text(err.responseText)
			$('#setting-modal').modal('show')
		})
	} 
})