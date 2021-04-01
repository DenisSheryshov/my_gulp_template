const gulp = require('gulp')
const soucemaps = require('gulp-sourcemaps')
const concat = require('gulp-concat')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const cleanCss = require('gulp-clean-css')
const gulpIf = require('gulp-if')
const server = require('browser-sync').create()

const config = {
	paths: {
		scss: './src/scss/**/*.scss',
		html: './dist/index.html'
	},
	output: {
		cssName: 'bundle.min.css',
		path: './dist'
	},
	isDevelop: true
}

const scss = function() {
	return gulp.src(config.paths.scss)
		.pipe(gulpIf(config.isDevelop, soucemaps.init()))
		.pipe(sass())
		.pipe(concat(config.output.cssName))
		.pipe(autoprefixer())
		.pipe(gulpIf(!config.isDevelop, cleanCss()))
		.pipe(gulpIf(config.isDevelop, soucemaps.write()))
		.pipe(gulp.dest(config.output.path))
		.pipe(server.stream())
}

const serve = function() {
    server.init({
        server: config.output.path,
        notify: false,
        open: true,
        cors: true
    })

    gulp.watch(config.paths.scss, gulp.series(scss))
    gulp.watch(config.paths.html).on('change', server.reload)
}

exports.default = gulp.series(scss, serve)

