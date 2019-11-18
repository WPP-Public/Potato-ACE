const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-rm');
const terser = require('gulp-terser');
const minify = require('gulp-clean-css');

const dirs = {
  src: 'src',
  dest: 'dist'
};

gulp.task('serve', () => {
  browserSync.init({ server: `./${dirs.src}` });
  gulp.watch(`./${dirs.src}/sass/**/*.scss`, gulp.series('sass'));
  gulp.watch(`./${dirs.src}/**/*.{html,js}`).on('change', browserSync.reload);
});

gulp.task('sass', () => {
  return gulp.src(`./${dirs.src}/sass/**/*.scss`)
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(`./${dirs.src}/css`))
    .pipe(browserSync.stream())
});

gulp.task('markdown', () => {
  return gulp.src(`./${dirs.src}/sass/**/*.scss`)
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(`./${dirs.src}/css`))
    .pipe(browserSync.stream())
});

/////////////// BUILD SUBTASKS ///////////////
gulp.task('clean', () => {
  return gulp.src(`./${dirs.dest}/**/*`)
    .pipe(clean());
});


gulp.task('copy', () => {
  return gulp.src(`./${dirs.src}/{**/*.html,img/**/*}`)
    .pipe(gulp.dest(`./${dirs.dest}/`))
});


gulp.task('js', () => {
  return gulp.src(`./${dirs.src}/js/**/*.js`)
    .pipe(terser())
    .pipe(gulp.dest(`./${dirs.dest}/js/`))
});


gulp.task('build-sass', () => {
  return gulp.src(`./${dirs.src}/sass/**/*.scss`)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest(`./${dirs.src}/css`))
});


gulp.task('css', gulp.series('build-sass', () => {
  return gulp.src(`./${dirs.src}/css/**/*.css`)
    .pipe(minify())
    .pipe(gulp.dest(`./${dirs.dest}/css/`))
}));


/////////////// MAIN TASKS ///////////////
gulp.task('default', gulp.series('sass', 'serve'));


gulp.task('build', gulp.series(
  'clean',
  gulp.parallel('copy', 'js', 'css')
));


gulp.task('serve-build', gulp.series('build', () => {
  browserSync.init({
    server: `./${dirs.dest}`,
    port: 3030
  });
}));
