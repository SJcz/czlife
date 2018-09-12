$(document).ready(function () {
	//$('#signup-form').bootstrapValidator('resetForm', true)
	$('#signup-form').bootstrapValidator({
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
					stringLength: {
						min: 6,
						max: 11,
						message: '用户名的长度必须在6 ~ 11 范围内'
					},
					regexp: {
						regexp: /^[a-zA-Z0-9_\.]+$/,
						message: '用户名由数字, 大小写字母, 点和下划线组成'
					}
				}
			},
			password: {
				validators: {
                    notEmpty: {
                        message: '密码不能为空'
                    },
                    stringLength: {
                    	min: 6,
                    	max: 11,
                    	message: '密码长度必须在6 ~ 11 范围内'
                    },
                    identical: {
						field: 'repeatpassword',
						message: '两次输入的密码不一致'
					}
                }
			},
			repeatpassword: {
				validators: {
					notEmpty: {
						message: '确认密码不能为空'
					},
					identical: {
						field: 'password',
						message: '两次输入的密码不一致'
					}
				}
			},
			bio: {
				validators: {
					stringLength: {
						max: 100,
						message: '个人简介就不要太长啦, 100字以内哦！'
					}
				}
			}
		}

	})

    $('#signup-submitBtn').click(() => {
    	$('#signup-form').data('bootstrapValidator').validate()

    	if ($('#signup-form').data('bootstrapValidator').isValid()) {
    		signup_sendRequest()
    	}
    })

    $('#signup-resetBtn').click(() => {
    	//为了修复reset按钮使用之后, 表弟那验证状态不改变的bug, 这里手动调用form(dom元素)的reset, 再调用validator的reset方法
    	//1, 清除了验证产生的所有提示, 重置验证状态 2, 重置表单
    	$("#signup-form")[0].reset()
    	$("#signup-form").data('bootstrapValidator').resetForm();
    })

	function signup_sendRequest () {
		$.post('/signup', $('#signup-form').serialize())
		.done((result) => {
			//console.log(result)
			window.location.href = '/index'
		})
		.fail((err) => {
			$('#simple-prompt-modal .modal-body').text(err.responseText)
			$('#simple-prompt-modal').modal('show')
		})
	} 
})