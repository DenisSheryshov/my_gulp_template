const gulp = require('gulp')
const soucemaps = require('gulp-sourcemaps')
const concat = require('gulp-concat')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const cleanCss = require('gulp-clean-css')
const htmlmin = require('gulp-htmlmin')
const uglify = require('gulp-uglify-es').default;
const server = require('browser-sync').create()

const config = {
	isDevelop: true,
	paths: {
		scss: './src/scss/**/*.scss',
		html: './app/index.html',
		html_min: './dist/index.html'
	},
	output: {
		cssName: 'bundle.css',
		path() {
			return config.isDevelop ? './app' : './dist'
		}
	}	
}

const scss2css = function() {
	return gulp.src(config.paths.scss)
		.pipe(soucemaps.init())
		.pipe(sass())
		.pipe(concat(config.output.cssName))
		.pipe(autoprefixer())
		.pipe(soucemaps.write())
		.pipe(gulp.dest('./app'))
		.pipe(server.stream())
}


const compressCSS = function() {
	return gulp.src('./app/*.css')
		.pipe(cleanCss())
		.pipe(gulp.dest('./dist'))
}

const compressHTML = function() {
	return gulp.src('./app/*.html')
		.pipe(htmlmin({
			collapseWhitespace: true,
			removeComments: true}))
		.pipe(gulp.dest('./dist'))
}

const compressJS = function() {
   return gulp.src('./app/*.js')
        .pipe(uglify({}))
        .pipe(gulp.dest('./dist'))
}


const serve = function() {
    server.init({
        server: config.output.path(),
        notify: false,
        open: true,
        cors: true
    })

    gulp.watch(config.paths.scss, gulp.series(scss2css))
    gulp.watch(config.paths.html).on('change', server.reload)
}

exports.default = gulp.series(scss2css, serve)
exports.min = gulp.series(compressHTML, compressCSS, compressJS)


