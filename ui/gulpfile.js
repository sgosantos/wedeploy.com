var gulp = require('gulp');
var connect = require('gulp-connect');
var layout = require('gulp-layout');
var markdown = require('gulp-markdown');
var metal = require('gulp-metal');
var replace = require('gulp-replace');
var sass = require('gulp-sass');
var path = require('path');
var livereload = require('gulp-livereload');

metal.registerTasks({
	taskPrefix: 'metal:',
	bundleFileName: 'main.js',
	buildSrc: 'src/assets/scripts/misc/main.js',
	buildDest: 'dist/scripts'
});

// CSS -------------------------------------------------------------------------

gulp.task('styles', function() {
	return gulp.src('src/assets/styles/**/*.scss')
		.pipe(sass({includePaths: ['node_modules']}))
		.pipe(gulp.dest('dist/styles'));
});

gulp.task('vendor-styles', ['vendor-westyles'], function() {
	return gulp.src([
			'bower_components/senna/build/senna.css',
			'bower_components/highlightjs/styles/tomorrow-night-eighties.css'
		])
		.pipe(gulp.dest('dist/styles/vendor'));
});

gulp.task('vendor-westyles', function() {
	return gulp.src(['node_modules/westyle/build/**'])
		.pipe(gulp.dest('dist/styles/vendor/westyle'));
});

// Fonts -----------------------------------------------------------------------

gulp.task('fonts', function () {
    return gulp.src(['src/assets/fonts/**/*'])
        .pipe(gulp.dest('dist/fonts'));
});

// JS --------------------------------------------------------------------------

gulp.task('scripts', function() {
	return gulp.src('src/assets/scripts/**/*.js')
		.pipe(gulp.dest('dist/scripts'));
});

gulp.task('vendor-scripts', function() {
	return gulp.src([
			'bower_components/senna/build/globals/senna-min.js',
			'bower_components/handlebars/handlebars.min.js',
			'bower_components/highlightjs/highlight.pack.min.js'
		])
		.pipe(gulp.dest('dist/scripts/vendor'));
});

// Images ----------------------------------------------------------------------

gulp.task('images', function() {
	return gulp.src('src/assets/images/**/*')
		.pipe(gulp.dest('dist/images'));
});

// HTML ------------------------------------------------------------------------

gulp.task('pages-home', function() {
	return gulp.src('src/content/index.html')
		.pipe(layout({
			layout: 'src/layouts/home.html',
			engine: 'nunjucks'
		}))
		.pipe(gulp.dest('dist'));
});

gulp.task('pages-search', function() {
	return gulp.src('src/content/search/index.html')
		.pipe(layout({
			layout: 'src/layouts/search.html',
			engine: 'nunjucks'
		}))
		.pipe(gulp.dest('dist/docs/search'));
});

gulp.task('pages-docs', ['pages-docs-redirect'], function() {
	return gulp.src('src/content/docs/index.html')
		.pipe(layout({
			layout: 'src/layouts/docs.html',
			engine: 'nunjucks'
		}))
		.pipe(gulp.dest('dist/docs'))
		.pipe(livereload());
});

gulp.task('pages-docs-redirect', function() {
	return gulp.src('src/content/docs/**')
		.pipe(gulp.dest('dist/docs'));
});

gulp.task('pages-blog', function() {
	return gulp.src('src/content/blog/**')
		.pipe(layout({
			layout: 'src/layouts/blog.html',
			engine: 'nunjucks'
		}))
		.pipe(gulp.dest('dist/blog'));
});

// Markdown --------------------------------------------------------------------

gulp.task('pages-terms', function() {
	return gulp.src('src/content/terms/index.md')
		.pipe(markdown())
		.pipe(layout({
			layout: 'src/layouts/terms.html',
			engine: 'nunjucks'
		}))
		.pipe(gulp.dest('dist/terms'));
});

gulp.task('pages-guide', function() {
	return gulp.src('bower_components/docs/**')
		.pipe(markdown())
		.pipe(replace('<!-- ', ''))
		.pipe(replace(' -->', ''))
		.pipe(layout(function(file) {
			var docsIndex = file.path.indexOf('/docs/') + 6;
			var docsPath = file.path.substring(docsIndex, file.path.length);
			var docsTokens = docsPath.split('/');

			var section, basename;
			var topic = docsTokens[0];
			var fullpath = docsPath.replace('.html', '');

			// Contains language specific content
			if (docsTokens.length === 2) {
				section = null;
				basename = docsTokens[1].replace('.html', '');
			} else {
				section = docsTokens[1];
				basename = docsTokens[2].replace('.html', '');
			}

			return {
				engine: 'nunjucks',
				layout: 'src/layouts/guide.html',
				topic: topic,
				section: section,
				basename: basename,
				fullpath: fullpath
			}
		}))
		.pipe(gulp.dest('dist/docs'))
		.pipe(livereload());
});

// Runner ----------------------------------------------------------------------

gulp.task('build', [
	'styles', 'vendor-styles', 'fonts', 'scripts', 'vendor-scripts', 'metal:build:js',
	'images', 'pages-home', 'pages-search', 'pages-terms', 'pages-docs', 'pages-guide',
	'pages-blog'
]);

gulp.task('server', ['build'], function() {
	connect.server({
		root: 'dist',
		port: 8888
	});
});

gulp.task('watch', ['server'], function() {
	livereload.listen();

	gulp.watch('src/layouts/*.html',['pages-docs', 'pages-guide']);
	gulp.watch('bower_components/docs/**/**/*.md',['pages-docs', 'pages-guide']);
	gulp.watch('bower_components/docs/**/*.md',['pages-docs','pages-guide']);
	gulp.watch('src/assets/styles/**/*.scss', ['styles']);
	gulp.watch('src/assets/scripts/**/*.js', ['scripts']);
});
