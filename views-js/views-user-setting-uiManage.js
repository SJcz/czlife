$(document).ready(function () {
	$('table tr td input[type="radio"]').click(function () {
		var style = getPageStyle()
		changePageStyle(style[0], style[1], style[2])
	})

	$('button[type="button"]').click(() => {
		var style = getPageStyle()
		$.post({
			url: '/setting/savePageStyle',
			data: {
				nav: style[0],
				back: style[1],
				panel: style[2],
				userId: $('#global-user-id').val()
			}
		})
		.done(() => {
			//
			window.location.reload()
		})
		.fail((err) => {
			console.log(err)
			$('#setting-modal .modal-body').text(err.responseText)
			$('#setting-modal').modal('show')
		})
	})

	function getPageStyle () {
		var nav = back = panel = ""
		var radios = $('table tr input[name="navRadio"]')
		for (var i = 0; i < radios.length; i++) {
			if (radios[i].checked == true) {
				nav = radios[i].value
			}
		}
		var radios = $('table tr input[name="backRadio"]')
		for (var i = 0; i < radios.length; i++) {
			if (radios[i].checked == true) {
				back = radios[i].value
			}
		}
		var radios = $('table tr input[name="panelRadio"]')
		for (var i = 0; i < radios.length; i++) {
			if (radios[i].checked == true) {
				panel = radios[i].value
			}
		}
		return [nav, back, panel]
	}

	function changePageStyle (nav, back, panel) {
		console.log(nav, back, panel)
		if (nav == 'default') {
			$('nav.navbar').removeClass('navbar-inverse').addClass('navbar-' + nav)
		} else if (nav == 'inverse') {
			$('nav.navbar').removeClass('navbar-default').addClass('navbar-' + nav)
		}
		document.body.style.backgroundColor = back
		$('.panel').attr('class', 'panel panel-' + panel)
	}
})
