const gulp = require('gulp'),
fs = require('fs'),
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
},
header_txt= `
	KnUpload v<%= pkg.version %> (<%= moment().format('YYYY-MM-DD HH:mm:ss ZZ') %>)
	Copyright (c) 2019-2021 <%= pkg.author %>
	Released under the MIT license
`;

gulp.task('minify-worker', function() {
	return gulp.src('src/kn_upload_worker.js')
		.pipe(terser(terser_options))
		.pipe(rename('kn_upload_inline_worker.js'))
		.pipe(gulp.dest('dist'));
});

gulp.task('add-inline-worker', function(done) {
	try {
		let main_src = fs.readFileSync('src/kn_upload.js', 'utf8');
		let worker_script = fs.readFileSync('dist/kn_upload_inline_worker.js', 'utf8');

		let inline_pos = main_src.indexOf('WORKER_INLINE_SCRIPT = "') + 24,
		end_inline_pos = main_src.indexOf('";', inline_pos);

		fs.writeFileSync('dist/kn_upload.js', main_src.substring(0, inline_pos) + worker_script  + main_src.substring(end_inline_pos), 'utf8');
	} catch(e) {
		console.log('Error:', e.stack);
	}

	done();
});

gulp.task('minify-main', function() {
	return gulp.src('dist/kn_upload.js')
		.pipe(header_comment(header_txt))
		.pipe(gulp.dest('dist'))
		.pipe(terser(terser_options))
		.pipe(header_comment(header_txt))
		.pipe(rename('kn_upload.min.js'))
		.pipe(gulp.dest('dist'));
});

gulp.task('build', gulp.series('minify-worker', 'add-inline-worker', 'minify-main'));

