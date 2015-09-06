var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({lazy: true});
var browserSync = require('browser-sync').create();
var secrets = require('./secrets.json');

// Create banner to insert as text before js & css files
var pkg = require('./package.json');
var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

// Path to assets
var paths = {
  less: 'css/app.less',
  html: ['index.html', 'partials/*.html'],
  js: ['js/main.js', 'js/**/*.js']
};

// Convert less files into css
gulp.task('less', function() {
  return gulp.src(paths.less)
  .pipe(plugins.less())
  .pipe(plugins.minifyCss())
  .pipe(plugins.header(banner, { pkg : pkg } ))
  .pipe(gulp.dest('css/'));
});

// Concat and uglify javascript files
gulp.task('js', function() {
  return gulp.src(paths.js)
  .pipe(plugins.jshint())
  .pipe(plugins.jshint.reporter('default'))  
  .pipe(plugins.concat('app.js'))
  .pipe(plugins.ngAnnotate())
  .pipe(plugins.uglify())
  .pipe(plugins.header(banner, { pkg : pkg } ))
  .pipe(gulp.dest('js/'));
});

// Minify html and replace references to minified javascript files
gulp.task('html', function() {
  return gulp.src(paths.html)
    .pipe(plugins.minifyHtml({ empty: true }))
    // .pipe(plugins.usemin({
    //   assetsDir: 'js',
    //   js: [plugins.uglify(), 'concat']
    // }))    
    .pipe(gulp.dest('prod/'));
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
  var gulpSSH = new plugins.ssh({
    ignoreErrors: false,
    sshConfig: secrets.config
  });

  return gulpSSH
    .shell(['cd /srv/www/peter.szocs.info/public', 'git pull', 'npm install', 'npm update', 'npm postinstall'], {filePath: 'shell.log'})
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
gulp.task('default', ['less', 'watch']);
