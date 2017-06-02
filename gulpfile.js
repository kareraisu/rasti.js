const gulp = require('gulp')
const gutil = require('gulp-util')
const rename = require('gulp-rename')

const browserify = require('browserify')
const exorcist = require('exorcist')

const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
//const vinylize = require('vinyl-transform')

const babili = require('gulp-babili')
const cleanCSS = require('gulp-clean-css')
const trimlines = require('gulp-trimlines')

const browserSync = require('browser-sync').create()

//TODO maybe add gulp-changed / gulp-cached for incremental builds

const s = gulp.series
const p = gulp.parallel

const paths = {
    app : 'app',
}


function bundle() {
    return browserify({
        entries: ['src/rasti.js'],
        standalone: 'rasti', // create an umd module (which, when loaded in a browser, registers in the global namespace (window))
        debug: true,         // create inline sourcemaps
    })
    .bundle()
    .pipe(exorcist('dist/rasti.map'))
    .on('error', function(err) {
        gutil.log(err.stack)
        this.emit('end') // end this stream here so gulp doesn't crash
    })
    .pipe(source('rasti.js')) // turn browserify's text stream into gulp's vinyl stream
    .pipe(buffer())           // turn stream into buffer (expected by some gulp plugins, i.e. babili)
}


gulp.task('bundle', () =>
    bundle()
    .pipe(gulp.dest('dist'))
)


gulp.task('minify-js', () =>
    bundle()
    //.pipe(vinylize(() => exorcist('dist/rasti.min.map')))
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


gulp.task('live-reload', (done) => {
    browserSync.init({
        server : true,
        index  : paths.app + '/index.html',
        serveStatic: [{
            route : '',
            dir   : paths.app
        }],
    })
    done()
})


gulp.task('watch-src', (done) => {
    gulp.watch('src/**/*.js', s('bundle'))
    gulp.watch('src/**/*.css', s('minify-css'))
    done()
})


gulp.task('watch-dist', (done) => {
    gulp.watch('dist/**/*.*').on('change', browserSync.reload)
    done()
})


gulp.task('watch-app', (done) => {
    gulp.watch(paths.app + '/**/*.*').on('change', browserSync.reload)
    done()
})


gulp.task('watch', p('watch-src', 'watch-dist', 'watch-app'))


gulp.task('default', s('bundle', 'minify-css', 'live-reload', 'watch'))


gulp.task('prod', p('minify-js', 'minify-css'))




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