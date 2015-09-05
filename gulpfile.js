var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var browserSync = require('browser-sync').create();

var pkg = require('./package.json');
var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

// Convert less files into css
gulp.task('less', function() {
  return gulp.src(['css/app.less'])
  .pipe(plugins.less())
  .pipe(plugins.minifyCss())
  .pipe(plugins.header(banner, { pkg : pkg } ))
  .pipe(gulp.dest('prod/'));
});

// Concat and uglify javascript files
gulp.task('js', function() {
  return gulp.src([
    'js/app.js', 
    'js/**/*.js',
    '!js/unused/*.js'
  ])
  .pipe(plugins.jshint())
  .pipe(plugins.jshint.reporter('default'))  
  .pipe(plugins.concat('all.js'))
  .pipe(plugins.ngAnnotate())
  .pipe(plugins.uglify())
  .pipe(plugins.header(banner, { pkg : pkg } ))
  .pipe(gulp.dest('prod/'));
});

// Watch less & html files for changes
gulp.task('serve', ['less'], function() {

    browserSync.init({
        server: '.'
    });

    gulp.watch('css/*.less', ['less']);
    // gulp.watch('partials/*.html').on('change', browserSync.reload);
});

// Default task
gulp.task('default', function() {
  console.log('hi from gulp');
});
