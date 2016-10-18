if (menuToggler) {
	menuToggler.dispose();
	menuToggler = null;
}

var menuToggler = new metal.Toggler({
	content: '.sidebar-list-1',
	header: '.sidebar-header'
});

/* ==========================================================================
	 Menu links
	 ========================================================================== */

function saveLangChoice() {
	['js', 'java', 'rest'].forEach(function(lang) {
		if (window.location.href.indexOf(lang) !== -1) {
			localStorage.setItem('docsLang', lang);
		}
	});
}

function updateLangURLs() {
	var docsLang = localStorage.getItem('docsLang');

	if (docsLang) {
		var sideLinks = document.querySelectorAll('.sidebar-link');

		sideLinks.forEach(function(sideLink) {
			sideLink.href = sideLink.href.replace(/(\/js\/)|(\/java\/)|(\/rest\/)/g, '/' + docsLang+ '/');
		});
	}
}

saveLangChoice();
updateLangURLs();
