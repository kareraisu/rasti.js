const fs = require('fs')
const gulp = require('gulp')
const log = require('fancy-log')
const rename = require('gulp-rename')
const merge2 = require('merge2')
const concat = require('gulp-concat')

const browserify = require('browserify')
const exorcist = require('exorcist')

const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')

const minify = require("gulp-babel-minify")
const cleanCSS = require('gulp-clean-css')
const trimlines = require('gulp-trimlines')
const replace = require('gulp-replace')

const browserSync = require('browser-sync').create()

const s = gulp.series
const p = gulp.parallel

const paths = {
    app : 'C:/Users/ale/Documents/rasti-demo',
    dist : 'C:/Users/ale/Documents/rasti-demo/dist'
}


function bundle(minCss) {
    return browserify({
        entries: ['src/rasti.js'],
        standalone: 'rasti', // create an umd module (which, when loaded in a
                             //   browser, registers in the global namespace)
        debug: true,         // create inline sourcemaps
    })
    .bundle()
    // extract inline sourcemaps to external files
    .pipe( exorcist(paths.dist + '/rasti.map') )
    .on('error', function(err) {
        log(err.stack)
        this.emit('end') // end the errored stream here so gulp doesn't crash
    })
    // turn browserify's text stream into gulp's vinyl stream
    .pipe(source('rasti.js'))
    // then turn stream into buffer (expected by some gulp plugins, i.e. babili, concat)
    .pipe(buffer())
    // inject rasti css
    .pipe( replace('rasti.css', fs.readFileSync(
        minCss ? paths.dist + '/rasti.min.css'
        : 'src/rasti.css'
    )))
}


gulp.task('minify-css', () =>
    gulp.src('src/*.css')
    .pipe(cleanCSS())
    .pipe(rename('rasti.min.css'))
    .pipe(gulp.dest(paths.dist))
)


gulp.task('bundle', s('minify-css', () =>
    merge2( gulp.src('lib/zepto.min.js'), bundle(true) )
    .pipe(concat('rasti.js'))
    .pipe(gulp.dest(paths.dist))
))


gulp.task('prod', s('bundle', () =>
    gulp.src(paths.dist + '/rasti.js')
    .pipe(minify())
    // trim ES6 template strings whitespace
    .pipe(trimlines({ pattern: '\n[ ]+' }))
    .pipe(trimlines({ pattern: '[\n]+'  }))
    .pipe(rename('rasti.min.js'))
    .pipe(gulp.dest(paths.dist))
))


gulp.task('live-reload', (done) => {
    browserSync.init({
        server : true,
        index  : paths.app + '/demos/humans/index.html',
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
    gulp.watch(paths.dist + '/**/*.*').on('change', browserSync.reload)
)


gulp.task('watch-app', () =>
    gulp.watch(paths.app + '/**/*.*').on('change', browserSync.reload)
)


gulp.task('watch', p('watch-src', 'watch-dist', 'watch-app'))


gulp.task('dev', s('bundle', 'live-reload', 'watch'))


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