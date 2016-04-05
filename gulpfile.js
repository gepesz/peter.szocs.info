// Create gulp & gulp plugins
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({ lazy: true });
// console.log(plugins);

// Create additional plugins
var browserSync = require('browser-sync').create();
var b2v = require('buffer-to-vinyl');
var del = require('del');
var spawn = require('child_process').spawn;

// Figure out the build environment
var isProd = (process.env.NODE_ENV === 'production');
console.log('Environment: ' + (isProd ? 'PROD' : 'DEV'));

// Paths to assets
var paths = {
  app: {
    name: 'app'
  },
  pkg: {
    json: './package.json'
  },
  less: {
    src: './src/client/stylesheets/**/*.less',
    dest: './src/client/stylesheets/',
    appFile: './src/client/stylesheets/app.less'
  },
  html: {
    src: [
      './src/client/index.html',
      './src/client/partials/*.html'
    ],
    dest: './src/client/',
    partials: './src/client/partials/*.html'
  },
  js: {
    src: [
      './src/client/javascripts/app.js',
      '!./src/client/javascripts/all.js',
      './src/client/javascripts/**/*.js'
    ],
    dest: './src/client/javascripts/',
    output: 'all.js',
    config: 'config.js'
  }
};

// Create banner to insert as text before js & css files
var pkg = require(paths.pkg.json);
var banner = '/**\n' +
  ' * <%= pkg.author %> - <%= pkg.name %>\n' +
  ' * <%= pkg.description %>\n' +
  ' * @license <%= pkg.license %>\n' +
  ' */\n';

// Node server
var node = null;

// Clean less: remove all .css files
gulp.task('clean:less', function() {
  return del([paths.less.dest + '*.css']);
});

// Convert less files into css and stream to BrowserSync
gulp.task('less', function() {
  return gulp.src(paths.less.appFile)
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
    .pipe(plugins.ngConfig(paths.app.name, { createModule: false }))
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

// Template cache html files
gulp.task('html:cache', function() {
  return gulp.src(paths.html.partials)
    .pipe(plugins.angularTemplatecache({ module: paths.app.name }))
    .pipe(gulp.dest(paths.js.dest));
});

// Minify html
gulp.task('html', function() {
  return gulp.src(paths.html.src, { base: './' })
    .pipe(plugins.if(isProd, plugins.minifyHtml({ empty: true })))
    .pipe(gulp.dest(paths.html.dest));
});

// Static server
// http://paulsalaets.com/posts/injecting-styles-in-page-with-browser-sync/
gulp.task('watch', ['node'], function(done) {
  browserSync.init({
    proxy: 'https://peter-szocs-info-gepesz.c9users.io/',
    port: 4000
  }, function callback() {
    // (server is now up)

    // when less files change run specified gulp task
    gulp.watch(paths.less.src, ['less']);

    // when js files change run specified gulp task
    gulp.watch(paths.js.src, ['concat:js']);

    // when html files change reload browsers
    gulp.watch(paths.html.src, browserSync.reload);

    // notify gulp that this task is done
    done();
  });
});

// Start node server via foreman
gulp.task('node', function() {
  if (node) node.kill();
  node = spawn('nf', ['start'], { stdio: 'inherit' });
  node.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
});

// The production task: run this on PROD
gulp.task('production', ['less', 'js', 'html']);

// The development task: run this on DEV
gulp.task('development', ['less', 'js', 'watch']);

// The default task
gulp.task('default', ['development']);