/* ==========================================================================
	 Lifecycle
	 ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
	var app = senna.dataAttributeHandler.getApp();
	app.on('endNavigate', endNavigate);

	createAlert();
});

function endNavigate(e) {
	if (e.error) {
		onNavigateError(e);
	} else {
		onNavigateSuccess(e);
	}
}

function onNavigateError(e) {
	if (navigateErrorAlert) {
		navigateErrorAlert.visible = true;
	}
}

function onNavigateSuccess(e) {
	ga('set', 'page', e.path);
	ga('send', 'pageview');
}

/* ==========================================================================
	 Alert
	 ========================================================================== */

var navigateErrorAlert;

function createAlert() {
	if (navigateErrorAlert) {
		navigateErrorAlert.dispose();
		navigateErrorAlert = null;
	}

	navigateErrorAlert = new metal.Alert({
		body: 'The page cannot be loaded. Try reloading it. <a class="alert-undo-link" href="javascript:location.reload();">reload</a>',
		dismissible: true,
		elementClasses: 'alert-danger',
		visible: false
	});
}
