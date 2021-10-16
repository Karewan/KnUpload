const gulp = require('gulp'),
rename = require('gulp-rename'),
terser = require('gulp-terser'),
header_comment = require('gulp-header-comment');

const terser_options = {
	ecma: '2015',
	ie8: false,
	safari10: false,
	compress: {
		ecma: '2015',
		drop_console: true,
		drop_debugger: true,
		passes: 2
	},
	format: {
		comments: false,
		ecma: '2015',
		quote_style: 3
	}
};

gulp.task('build-inline-worker', function() {
	return gulp.src('src/kupload-worker.js')
		.pipe(terser(terser_options))
		.pipe(rename('kupload-inline-worker.js'))
		.pipe(gulp.dest('dist'));
});

gulp.task('build', function() {
	return gulp.src('src/kupload.js')
		.pipe(terser(terser_options))
		.pipe(header_comment(`
			kupload v<%= pkg.version %> (<%= moment().format('YYYY-MM-DD HH:mm:ss ZZ') %>)
			Copyright (c) 2019-2021 <%= pkg.author %>
			Released under the MIT license
		`))
		.pipe(rename('kupload.min.js'))
		.pipe(gulp.dest('dist'));
});
