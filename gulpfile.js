const gulp = require('gulp');
const sass = require('gulp-sass')(require('node-sass'));
const cssnano = require('gulp-cssnano');
const rev = require('gulp-rev');
const uglify = require('gulp-uglify-es').default;
const del = require('del');
const imagemin = require('gulp-imagemin');

gulp.task('css', function(done) {
  console.log('minifying CSS');

  gulp.src('./assets/sass/**/*.scss')
    .pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest('./assets.css'));

  console.log('Minified CSS');

  gulp.src('./assets/**/*.css')
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest('public/assets/rev-manifest.json',{
      base: './public/assets',
      merge: true
    }))
    .pipe(gulp.dest('./public/assets'));

  done();
});


gulp.task('js', function(done){
  console.log('Minifying JS');
  gulp.src('./assets/**/*.js')
  .pipe(uglify())
  .pipe(rev())
  .pipe(gulp.dest('./public/assets'))
  .pipe(rev.manifest('public/assets/rev-manifest.json',{
    base: './public/assets',
    merge: true
  }))
  .pipe(gulp.dest('./public/assets'))
  done()
})

gulp.task('images', function(done){
  console.log('Minifying JS');
  gulp.src('./assets/**/*.+(png|jpg|jpeg|gif|svg)')
  .pipe(imagemin())
  .pipe(rev())
  .pipe(gulp.dest('./public/assets'))
  .pipe(rev.manifest('public/assets/rev-manifest.json', {
    base: './public/assets',
    merge: true
  }))
  .pipe(gulp.dest('./public/assets'))
  done()
})

// Empty the public/assets directory
gulp.task('clean:assets', function(done){
  del.sync('./public/assets')
  done()
});

gulp.task('build',gulp.series('clean:assets' , 'css' , 'js' , 'images') ,function(done){
  del.deleteSync('./public/assets')
  done()
});

