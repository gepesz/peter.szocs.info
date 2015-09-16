// Create gulp & gulp plugins
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({ lazy: true });
// console.log(plugins);

// Create additional plugins
var browserSync = require('browser-sync').create();
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
    src: 'css/app.less',
    dest: 'css/'
  },
  html: {
    src: ['index.html', 'partials/*.html'],
    dest: 'prod/'
  },
  js: {
    src: ['js/app.js', 'js/**/*.js'],
    dest: 'js/',
    output: 'all.js'
  }
};

// Convert less files into css
gulp.task('less', function() {
  return gulp.src(paths.less.src)
  .pipe(plugins.less())
  .pipe(plugins.if(isProd, plugins.minifyCss()))
  .pipe(plugins.if(isProd, plugins.header(banner, { pkg : pkg } )))
  .pipe(gulp.dest(paths.less.dest));
});

// Clean js
gulp.task('clean:js', function() {
  return del([paths.js.dest + paths.js.output]);
});

// Concat and uglify javascript files
gulp.task('js', ['clean:js'], function() {
  return gulp.src(paths.js.src)
  .pipe(plugins.jshint())
  .pipe(plugins.jshint.reporter('default'))
  .pipe(plugins.concat(paths.js.output))
  .pipe(plugins.if(isProd, plugins.ngAnnotate()))
  .pipe(plugins.if(isProd, plugins.uglify()))
  .pipe(plugins.if(isProd, plugins.header(banner, { pkg : pkg } )))
  .pipe(gulp.dest(paths.js.dest));
});

// Clean html
gulp.task('clean:html', function() {
  return del([paths.html.dest]);
});

// Minify html and replace references to minified javascript files
gulp.task('html', ['clean:html'], function() {
  return gulp.src(paths.html.src)
    .pipe(plugins.if(isProd, plugins.minifyHtml({ empty: true })))
    // .pipe(plugins.if(isProd, plugins.usemin({
    //   assetsDir: 'js',
    //   js: [plugins.uglify(), 'concat']
    // })))
    .pipe(gulp.dest(paths.html.dest));
});

// Static server
gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: './'
    }
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

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.less, ['less']);
  gulp.watch(paths.js, ['js']);
});

// Production install task
gulp.task('production', ['less', 'js', 'html']);

// The default task
gulp.task('default', ['less', 'js']);
