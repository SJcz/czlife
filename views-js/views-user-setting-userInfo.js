$(document).ready(function () {
	if ($('#setting-user-form').length > 0) {
		$('#setting-user-form').bootstrapValidator({
			feedbackIcons: {
				valid: 'glyphicon glyphicon-ok',
				invalid: 'glyphicon glyphicon-remove',
				validating: 'glyphicon glyphicon-refresh'
			},
			live: 'enabled',
			fields: {
				nickname: {
					validators: {
						notEmpty: {
							message: '昵称不能为空'
						},
						stringLength: {
							min: 1,
							max: 15,
							message: '昵称的长度必须在1 ~ 15 范围内'
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
				}, 
				avatar: {
					validators: {
						file: {
							extension: 'png,jpg,pdf,gif',
                       	 	maxSize: 5*1024*1024,
                       	 	message: '选择5M以内的jpg, png, gif, pdf 图片'
						}
					}
				}
			}

		})

		$('#setting-userInfo-submitBtn').click(() => {
			$('#setting-user-form').data('bootstrapValidator').validate()

			if ($('#setting-user-form').data('bootstrapValidator').isValid()) {
				modifyUserInfo_sendRequest()
			}
		})
	}

	function modifyUserInfo_sendRequest () {
		var oMyForm = new FormData();
		var myPhoto = $('input[name="avatar"]')[0].files[0];
		oMyForm.append('userId', $('input[name="userId"]').val());
        oMyForm.append('nickname', $('input[name="nickname"]').val());
        oMyForm.append('gender', $('select[name="gender"]').val());
        oMyForm.append('bio', $('textarea[name="bio"]').val());
    	oMyForm.append('avatar', myPhoto);
    	$.ajax({
        	type : 'POST',
        	url : '/setting/modifyUserInfo',
         	cache : false,  //不需要缓存
         	processData : false,    //不需要进行数据转换
            contentType : false, //默认数据传输方式是application,改为false，编程multipart
            data : oMyForm,
        }).done(function(data){
        	console.log(data)
            window.location.reload()
        }).fail(function(err){
        	console.log(1111111111)
        	console.log(err)
            $('#setting-modal .modal-body').text(err.responseText)
			$('#setting-modal').modal('show')
        })
	} 
})