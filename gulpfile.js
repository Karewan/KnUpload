const gulp = require('gulp'),
fs = require('fs'),
rename = require('gulp-rename'),
terser = require('gulp-terser'),
header_comment = require('gulp-header-comment');

const terser_options = {
	ecma: '2020',
	compress: {
		ecma: '2020',
		drop_console: true,
		drop_debugger: true,
		passes: 2
	},
	format: {
		comments: false,
		ecma: '2020',
		quote_style: 3
	}
},
header_txt= `
	KnUpload v<%= pkg.version %> (<%= moment().format('YYYY-MM-DD HH:mm:ss ZZ') %>)
	Copyright (c) 2019-2023 <%= pkg.author %>
	Released under the MIT license
`;

gulp.task('minify', function() {
	return gulp.src('src/kn_upload.js')
		.pipe(header_comment(header_txt))
		.pipe(gulp.dest('dist'))
		.pipe(terser(terser_options))
		.pipe(header_comment(header_txt))
		.pipe(rename('kn_upload.min.js'))
		.pipe(gulp.dest('dist'));
});

gulp.task('build', gulp.series('minify'));
