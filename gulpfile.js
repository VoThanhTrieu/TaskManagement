var gulp        = require('gulp');
//Require gulp sass plugin
var sass        = require('gulp-sass');
//Require Brower-sync
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');

//convert scss to css
gulp.task('sass',function () {
  return gulp.src('app/scss/**/*.scss')
  .pipe(sass())
  .pipe(gulp.dest('dist/css'))
  .pipe(browserSync.reload({
    stream: true
  }))

})

//watching sass file for changes
gulp.task('watch', ['browserSync','sass'], function(){
  gulp.watch('app/scss/**/*.scss', ['sass']); 
  // Reloads the browser whenever HTML or JS files change
  gulp.watch('app/html/**/*.html', browserSync.reload); 
  gulp.watch('app/js/**/*.js', browserSync.reload); 
  // Other watchers
})

//browser task to enable Gulp to spin upa server using Browser Sync
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: ''
    },
  }) 
})

//compile JS file
gulp.task('userefjs', function(){
  return gulp.src('app/js/**/*.js')
    .pipe(useref())
    .pipe(gulp.dest('dist/js'))
});

//minify JS file
gulp.task('useref', function(){
  return gulp.src('app/html/**/*.html')
    .pipe(useref())
    .pipe(gulp.dest('dist/html'))
});


//Optimizing Images
gulp.task('images', function(){
  return gulp.src('app/Libs/images/**/*.+(png|jpg|gif|svg|ico)')
  // Caching images that ran through imagemin
  .pipe(cache(imagemin({
    // Setting interlaced to true
      interlaced: true
  })))
  .pipe(gulp.dest('dist/images'))
});


//Copying Fonts to Dist
gulp.task('fonts', function() {
  return gulp.src('app/Libs/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
})


//Copying index.html to Dist
gulp.task('ind', function() {
  return gulp.src('index.html')
  .pipe(gulp.dest('dist'))
})

  //Copying Libs to Dist
gulp.task('libs', function() {
  return gulp.src('app/Libs/**/*')
  .pipe(gulp.dest('dist/Libs'))
})

//Cleaning up generated files automatically
gulp.task('clean:dist', function() {
  return del.sync('dist')
})

//To clear the caches off your local system
gulp.task('cache:clear', function (callback) {
return cache.clearAll(callback)
})

//Combining Gulp tasks
gulp.task('build', function (callback) {
  runSequence('clean:dist','cache:clear', 
    ['sass','userefjs', 'useref', 'images', 'fonts','libs','ind'],
    callback
  )
})

gulp.task('default', function (callback) {
  runSequence(['sass','browserSync', 'watch'],
    callback
  )
})