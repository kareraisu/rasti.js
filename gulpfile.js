const { task, src, dest, watch, series: s, parallel: p } = require('gulp')
const fs = require('fs')
const log = require('fancy-log')

const browserify = require('browserify')
const sourcemaps = require('gulp-sourcemaps')

const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')

const merge2 = require('merge2')
const rename = require('gulp-rename')
const concat = require('gulp-concat')
const replace = require('gulp-replace')
const minify = require('gulp-babel-minify')
const cleanCSS = require('gulp-clean-css')
const trimlines = require('gulp-trimlines')
const sizereport = require('gulp-sizereport')

/* TODO evaluate
const postcss = require('gulp-postcss')
const nested = require('postcss-nested')
const extend = require('postcss-extend-rule')
*/

process.env.APP_PATH = process.env.APP_PATH || 'C:/Users/ale/Documents/repos/rasti-demo'

const paths = {
    app : process.env.APP_PATH,
    dist : 'dist' // process.env.PROD ? 'dist' : process.env.APP_PATH + '/dist'
}

const bundler = browserify({
    entries: ['src/rasti.js.temp'],
    standalone: 'rasti', // create an umd module (which, when loaded in a
                         //   browser, registers in the global namespace)
    debug: true,         // create inline sourcemaps
})

const sizeopts = {
    gzip: true,
    total: false,
    '*': {
        'maxSize': 100000,
    },
}


task('bundle', () => 
    bundler.bundle()
    .pipe(source('rasti.js')) // turn browserify's text stream into gulp's vinyl stream
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        .on('error', function(err) {
            log(err.stack)
            this.emit('end') // end the errored stream here so gulp doesn't crash
        })
    .pipe(sourcemaps.write('./')) // extract inline sourcemaps to external files
    .pipe(dest(paths.dist))
)

task('merge', () =>
    merge2( src('lib/umbrella.min.js'), src('src/rasti.js') )
    .pipe(concat('rasti.js.temp'))
    .pipe( replace('rasti.css', fs.readFileSync( paths.dist + '/rasti.css' )) ) // inject rasti styles
    .pipe(dest('src'))
)

task('styles', () =>
    src('src/rasti.css')
    .pipe(cleanCSS())
    .pipe(dest(paths.dist))
)

task('minify', () =>
    src(paths.dist + '/rasti.js')
    .pipe(minify())
    // trim ES6 template strings whitespace
    .pipe(trimlines({ pattern: '\n[ ]+' }))
    .pipe(trimlines({ pattern: '[\n]+'  }))
    .pipe(rename('rasti.min.js'))
    .pipe(dest(paths.dist))
)

task('watch', (done) => {
    const server = require('browser-sync').create()
    server.init({
        server : true,
        index  : paths.app + '/demos/humans/index.html',
        serveStatic: [{
            route : '',
            dir   : paths.app
        }],
    })
    watch(['src/**/*.js', 'lib/**/*.js'], s('merge', 'bundle'))
    watch('src/**/*.css', s('build'))
    watch(paths.app + '/**/*.*').on('change', server.reload)
    watch(paths.dist + '/**/*.*').on('change', server.reload)
    done()
})

task('size', () =>
    src([paths.dist + '/rasti.js', paths.dist + '/rasti.min.js'])
    .pipe(sizereport(sizeopts))
)

task('build', s('styles', 'merge', 'bundle'))
task('dev', s('build', 'watch'))
task('prod', s('build', 'minify', 'size'))
task('default', s('dev'))
