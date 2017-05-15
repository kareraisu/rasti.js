const gulp = require('gulp')
const gutil = require('gulp-util')
const rename = require('gulp-rename')

const browserify = require('browserify')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')

const babili = require('gulp-babili')
const cleanCSS = require('gulp-clean-css')
const trimlines = require('gulp-trimlines')


gulp.task('bundle', () =>
    browserify({
      entries: ['src/rasti.js'],
      standalone: 'rasti',
      debug: true,
    })
    .bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('rasti.js'))
    //.pipe(buffer())
    .pipe(gulp.dest('dist'))
)


gulp.task('minify-js', ['bundle'], () =>
    gulp.src('dist/rasti.js')
    // uglify
    .pipe(babili({
        mangle: { keepClassNames: true }
    }))
    // trim ES6 template strings whitespace
    .pipe(trimlines({
        pattern: '\n[ ]+'
    }))
    .pipe(rename('rasti.min.js'))
    .pipe(gulp.dest('dist'))
)


gulp.task('minify-css', () =>
    gulp.src('src/*.css')
    .pipe(cleanCSS())
    .pipe(rename('rasti.min.css'))
    .pipe(gulp.dest('dist'))
)


gulp.task('minify', ['minify-js', 'minify-css'])


gulp.task('watch', () => {
    gulp.watch('src/**/*.js', ['minify-js'])
    gulp.watch('src/*.css', ['minify-css'])
})


gulp.task('default', ['minify', 'watch'])


/* for AMD modules

const amdOptimize = require('amd-optimize')
const concat = require('gulp-concat')

gulp.task('bundle', () =>
    gulp.src('*.js')
    .pipe(amdOptimize('main'))
    .pipe(concat('main-bundle.js'))
    .pipe(gulp.dest('dist'))
)

*/