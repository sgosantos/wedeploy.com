/* ==========================================================================
   Newsletter
   ========================================================================== */

if (newsletterAlert) {
	newsletterAlert.dispose();
	newsletterAlert = null;
}

var newsletterAlert = new metal.Alert({
	spinner: true,
	spinnerDone: true,
	visible: false
});

var newsletterForm = document.querySelector('.newsletter-form');

newsletterForm.addEventListener('submit', function(e) {
	e.preventDefault();

	Launchpad.url('http://liferay.io/docs/newsletter/subscribers')
		.post({
			email: e.target.email.value,
			timestamp: new Date().toISOString()
		})
		.then(function(result) {
			newsletterAlert.body = 'Thanks for subscribing!';
			newsletterAlert.elementClasses = 'alert-success';
			newsletterAlert.visible = true;
		})
		.catch(function(error) {
			newsletterAlert.body = 'Something wrong happened! Please come back later.';
			newsletterAlert.elementClasses = 'alert-danger';
			newsletterAlert.visible = true;
		});
});