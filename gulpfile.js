const gulp = require('gulp')
const gutil = require('gulp-util')
const rename = require('gulp-rename')

const browserify = require('browserify')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')

const babili = require('gulp-babili')
const cleanCSS = require('gulp-clean-css')
const trimlines = require('gulp-trimlines')

const browserSync = require('browser-sync').create()

//TODO maybe add gulp-changed / gulp-cached for incremental builds

const s = gulp.series
const p = gulp.parallel


function bundle() {
    return browserify({
      entries: ['src/rasti.js'],
      standalone: 'rasti', // create var in global namespace (window)
      debug: true,         // create inline sourcemaps
    })
    .bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('rasti.js')) // turn browserify's text stream into gulp's vinyl stream
    .pipe(buffer())           // turn stream into buffer (expected by some gulp plugins, i.e. babili)
}


gulp.task('bundle', () =>
    bundle()
    .pipe(gulp.dest('dist'))
)


gulp.task('minify-js', () =>
    bundle()
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


gulp.task('minify', p('minify-js', 'minify-css'))


gulp.task('live-reload', (done) => {
    browserSync.init({
        server : true,
        index  : 'example/index.html',
        serveStatic: [{
            route : '',
            dir   : 'example'
        }],
    })
    done()
})


gulp.task('watch-src', (done) => {
    gulp.watch('src/**/*.js', s('minify-js'))
    gulp.watch('src/**/*.css', s('minify-css'))
    done()
})


gulp.task('watch-dist', (done) => {
    gulp.watch('dist/**/*.js').on('change', browserSync.reload)
    gulp.watch('dist/**/*.css').on('change', browserSync.reload)
    done()
})


gulp.task('watch-app', (done) => {
    gulp.watch('example/**/*.js').on('change', browserSync.reload)
    gulp.watch('example/**/*.css').on('change', browserSync.reload)
    gulp.watch('example/**/*.html').on('change', browserSync.reload)
    done()
})


gulp.task('watch', s('live-reload', p('watch-src', 'watch-dist', 'watch-app')))


gulp.task('default', s('minify', 'watch'))


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