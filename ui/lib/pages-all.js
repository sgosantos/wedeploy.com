var path = require('path');
var dir = require('node-dir');
var stripMarkdown = require('remove-markdown');
var stripHtml = require('striptags');

exports.read = function(callback) {
	var pages = [];

	dir.readFiles(path.join(__dirname, '../bower_components/docs'), {
		match: /.md$/
	}, function(err, content, next) {
		if (err) throw err;

		pages.push({
			title: getTitle(content),
			content: getContent(content)
		});

		next();
	},
	function(err, files){
		if (err) throw err;

		for (var i = 0; i < files.length; i++) {
			pages[i].path = getPath(files[i]);
			pages[i].lang = getLang(files[i]);
			pages[i].topic = getTopic(files[i]);
		}

		callback(pages);
	});
}

function getTitle(content) {
	var titleStarts = content.indexOf('#') + 1;
	var titleEnds = content.indexOf('######');

	return content.substring(titleStarts, titleEnds).trim();
}

function getContent(content) {
	var strip = stripMarkdown(stripHtml(content));
	return strip.substring(getTitle(content).length).trim();
}

function getPath(path) {
	var prefix = path.indexOf('/docs');

	return path.substring(prefix)
		.replace('.md', '.html')
		.replace('index.html', '');
}

function getLang(path) {
	var currentLang = 'none';
	var langs = ['/js', '/java', '/rest'];

	langs.forEach(function(lang) {
		if (path.indexOf(lang) !== -1) {
			currentLang = lang.substring(1);
		}
	});

	return currentLang;
}

function getTopic(path) {
	var currentTopic, icon, iconBg;
	var topics = ['intro', 'auth', 'data', 'email', 'hosting', 'other'];

	topics.forEach(function(topic) {
		if (path.indexOf(topic) !== -1) {
			currentTopic = topic;
		}
	});

	switch(currentTopic) {
		case 'intro':
			icon = 'icon-16-arrow-right-rod';
			iconBg = '#00d46a';
			break;
		case 'auth':
			icon = 'icon-16-persons';
			iconBg = '#9552ef';
			break;
		case 'data':
			icon = 'icon-16-database';
			iconBg = '#ffb700';
			break;
		case 'email':
			icon = 'icon-16-mail-full';
			iconBg = '#ff6e00';
			break;
		case 'hosting':
			icon = 'icon-16-folder';
			iconBg = '#ff536b';
			break;
		case 'other':
			icon = 'icon-16-module';
			iconBg = '#00a4ff';
			break;
	}

	return {
		icon: icon,
		iconBg: iconBg,
		name: currentTopic
	}
}
