const gulp = require('gulp')
const babili = require('gulp-babili')
const cleanCSS = require('gulp-clean-css')
const trimlines = require('gulp-trimlines')


gulp.task('minify-js', () =>
    gulp.src('src/*.js')
        // uglify
        .pipe( babili({
            mangle: { keepClassNames: true }
        }) )
        // trim ES6 template strings whitespace
        .pipe( trimlines({
            pattern: '\n[ ]+'
        }) )
        .pipe( gulp.dest('dist') )
)


gulp.task('minify-css', () =>
    gulp.src('src/*.css')
        .pipe( cleanCSS({
            compatibility: 'ie8'
        }) )
        .pipe( gulp.dest('dist') )
)


gulp.task('default', ['minify-js', 'minify-css'])
