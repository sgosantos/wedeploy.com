/* ==========================================================================
   Main Search
   ========================================================================== */

var resultContainer = document.querySelector('#search-result-container');
var searchInput = document.querySelector('#search-input');
var template = document.querySelector('#search-result-template');

var docsLang = localStorage.getItem('docsLang') || 'js';

var request;

searchInput.addEventListener('input', function(e) {
	if (request) {
		request.cancel();
	}

	if (e.currentTarget.value === '') {
		resultContainer.innerHTML = '';
	}
	else {
		request = search(e.currentTarget.value);
	}
});

function search(term) {
	searchInput.value = term;

	return Launchpad.url('http://docs.wedeploy.com/search')
		.search('*', 'prefix', term)
		.search(Filter.equal('lang', docsLang).or('lang', 'none'))
		.highlight('content')
		.limit(100)
		.get()
		.then(function(result) {
			var data = result.body();

			data.term = term;

			var compiled = Handlebars.compile(template.innerHTML);
			var rendered = compiled(data);

			resultContainer.innerHTML = rendered;
		});
}

function onLoad() {
	var query = window.location.search;
	var queryIndex = query.indexOf('q=');

	if (queryIndex === -1) {
		window.location.href = '/docs';
	}
	else {
		queryString = query.substr(queryIndex + 2);

		search(queryString);
	}
}

Handlebars.registerHelper('trimString', function(passedString) {
    return passedString.substring(0, 300) + '...';
});

onLoad();

/* ==========================================================================
   Sidebar Search
   ========================================================================== */

if (sideSearchAutocomplete) {
	sideSearchAutocomplete.dispose();
	sideSearchAutocomplete = null;
}

var sideSearchInput = document.querySelector('.sidebar-search .form-control');

var sideSearchAutocomplete = new metal.Autocomplete({
	inputElement: sideSearchInput,
	data: function(query) {
		var docs = Launchpad.url('http://docs.wedeploy.com/search');

		if (query) {
			docs.search('*', 'prefix', query)
				.search(Filter.equal('lang', docsLang).or('lang', 'none'))
				.limit(3)
				.highlight('content');
		}

		return docs.get().then(function(response) {
			return response.body().documents;
		});
	},
	format: function(item) {
		return {
			textPrimary: '<a class="autocomplete-link" href="' + item.path + '">' +
				'<p class="autocomplete-title">' + item.title + '</p>' +
				'<p class="autocomplete-text">' + item.content.substr(0, 100) + '...</p></a>'
		};
	},
	select: function() {}
});
