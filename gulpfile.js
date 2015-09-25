// Create gulp & gulp plugins
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({ lazy: true });
// console.log(plugins);

// Create additional plugins
var browserSync = require('browser-sync').create();
var b2v = require('buffer-to-vinyl');
var del = require('del');

// Figure out the build environment
var isProd = !!plugins.util.env.production;
console.log('Environment: ' + (isProd ? 'PROD' : 'DEV'));

// Create banner to insert as text before js & css files
var pkg = require('./package.json');
var banner = '/**\n' +
  ' * <%= pkg.author %> - <%= pkg.name %>\n' +
  ' * <%= pkg.description %>\n' +
  ' * @license <%= pkg.license %>\n' +
  ' */\n';

// Paths to assets
var paths = {
  less: {
    src: 'css/**/*.less',
    dest: 'css/'
  },
  html: {
    src: ['index.html', 'partials/*.html'],
    dest: './'
  },
  js: {
    src: ['js/app.js', '!js/all.js', 'js/**/*.js'],
    dest: 'js/',
    output: 'all.js',
    config: 'config.js'
  }
};

// Convert less files into css and stream to BrowserSync
gulp.task('less', function() {
  return gulp.src(paths.less.src)
    .pipe(plugins.less())
    .pipe(plugins.if(isProd, plugins.minifyCss()))
    .pipe(plugins.if(isProd, plugins.header(banner, { pkg : pkg } )))
    .pipe(gulp.dest(paths.less.dest))
    .pipe(plugins.if(!isProd, browserSync.stream()));
});

// Clean js
gulp.task('clean:js', function() {
  return del([paths.js.dest + paths.js.output]);
});

// Create angular constants based on the build environment
gulp.task('config:js', function() {
  var json = JSON.stringify({
    "FIREBASE_URL": "https://peter-szocs-info.firebaseio.com/",
    "IS_PROD": isProd
  });
  return b2v.stream(new Buffer(json), paths.js.config)
    .pipe(plugins.ngConfig('app', { createModule: false }))
    .pipe(plugins.if(isProd, plugins.uglify()))
    .pipe(gulp.dest(paths.js.dest));
});

// Lint and concat js
gulp.task('concat:js', function() {
  return gulp.src(paths.js.src)
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('default'))
    .pipe(plugins.concat(paths.js.output))
    .pipe(gulp.dest(paths.js.dest));
});

// Full js task stack
gulp.task('js', ['clean:js', 'config:js'], function() {
  return gulp.src(paths.js.src)
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('default'))
    .pipe(plugins.concat(paths.js.output))
    .pipe(plugins.if(isProd, plugins.ngAnnotate()))
    .pipe(plugins.if(isProd, plugins.uglify()))
    .pipe(plugins.if(isProd, plugins.header(banner, { pkg : pkg } )))
    .pipe(gulp.dest(paths.js.dest));
});

// Minify html and replace references to minified javascript files
gulp.task('html', function() {
  return gulp.src(paths.html.src, { base: './' })
    .pipe(plugins.if(isProd, plugins.minifyHtml({ empty: true })))
    // .pipe(plugins.if(isProd, plugins.usemin({
    //   assetsDir: 'js',
    //   js: [plugins.uglify(), 'concat']
    // })))
    .pipe(gulp.dest(paths.html.dest));
});

// Static server
// http://paulsalaets.com/posts/injecting-styles-in-page-with-browser-sync/
gulp.task('watch', function(gulpCallback) {
  browserSync.init({
    // serve out of ./
    server: './',
    // serve on port 8080
    port: 8080,
    // launch default browser as soon as server is up
    open: true
  }, function callback() {
    // (server is now up)

    // when less files change run specified gulp task
    gulp.watch(paths.less.src, ['less']);

    // when js files change run specified gulp task
    gulp.watch(paths.js.src, ['concat:js']);

    // when html files change reload browsers
    gulp.watch(paths.html.src, browserSync.reload);

    // notify gulp that this task is done
    gulpCallback();
  });
});

// Production deployment task using SSH
gulp.task('deploy', function() {
  var config = require('./config/config.json');
  var gulpSSH = new plugins.ssh({
    ignoreErrors: false,
    sshConfig: config.server.sshConfig
  });

  return gulpSSH
    .shell(config.server.commands, {filePath: 'shell.log'})
    .pipe(gulp.dest('logs'));
});

gulp.task('status', function() {
  plugins.git.status({args: '--porcelain'}, function (err, stdout) {
    if (err) throw err;
  });
});

// Production install task
gulp.task('production', ['less', 'js', 'html']);

// The default task
gulp.task('default', ['less', 'js', 'watch']);
