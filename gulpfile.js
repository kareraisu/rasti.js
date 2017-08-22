const fs = require('fs')
const gulp = require('gulp')
const gutil = require('gulp-util')
const rename = require('gulp-rename')
const merge2 = require('merge2')
const concat = require('gulp-concat')

const browserify = require('browserify')
const exorcist = require('exorcist')

const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
//const vinylize = require('vinyl-transform')

const babili = require('gulp-babili')
const cleanCSS = require('gulp-clean-css')
const trimlines = require('gulp-trimlines')
const replace = require('gulp-replace')

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
        standalone: 'rasti', // create an umd module (which, when loaded in a
                             //   browser, registers in the global namespace)
        debug: true,         // create inline sourcemaps
    })
    .bundle()
    // extract inline soucemaps to external files
    .pipe(exorcist('dist/rasti.map'))
    .on('error', function(err) {
        gutil.log(err.stack)
        this.emit('end') // end the errored stream here so gulp doesn't crash
    })
    // turn browserify's text stream into gulp's vinyl stream
    .pipe(source('rasti.js'))
    // then turn stream into buffer (expected by some gulp plugins, i.e. babili, concat)
    .pipe(buffer())
    // inject rasti css
    .pipe( replace('rasti.css', fs.readFileSync('src/rasti.css')) )
    .pipe(gulp.dest('dist'))
}


function babilize(buffer) {
    return buffer.pipe(babili({
        mangle: { keepClassNames: true }
    }))
    // trim ES6 template strings whitespace
    .pipe(trimlines({
        pattern: '\n[ ]+'
    }))
    .pipe(trimlines({
        pattern: '[\n]+'
    }))
}


gulp.task('minify-js', () =>
    babilize(bundle())
    .pipe(rename('rasti.min.js'))
    .pipe(gulp.dest('dist'))
)


gulp.task('minify-css', () =>
    gulp.src('src/*.css')
    .pipe(cleanCSS())
    .pipe(rename('rasti.min.css'))
    .pipe(gulp.dest('dist'))
)


gulp.task('bundle', () =>
    merge2( gulp.src('lib/zepto.min.js'), bundle() )
    .pipe(concat('rasti+zepto.js'))
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
    gulp.watch('src/**/*.css', s('bundle'))
    done()
})


gulp.task('watch-dist', () => 
    gulp.watch('dist/**/*.*').on('change', browserSync.reload)
)


gulp.task('watch-app', () =>
    gulp.watch(paths.app + '/**/*.*').on('change', browserSync.reload)
)


gulp.task('watch', p('watch-src', 'watch-dist', 'watch-app'))


gulp.task('dev', s('bundle', 'live-reload', 'watch'))


gulp.task('prod', () =>
    babilize(gulp.src('dist/rasti+zepto.js'))
    .pipe(rename('rasti+zepto.min.js'))
    .pipe(gulp.dest('dist'))
)


gulp.task('default', s('dev'))




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