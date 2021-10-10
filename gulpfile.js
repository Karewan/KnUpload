const gulp = require('gulp'),
rename = require('gulp-rename'),
terser = require('gulp-terser');

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

gulp.task('build', function() {
	return gulp.src('src/kupload.js')
		.pipe(terser(terser_options))
		.pipe(rename('kupload.min.js'))
		.pipe(gulp.dest('dist'));
});
