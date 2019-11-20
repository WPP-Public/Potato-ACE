const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const terser = require('gulp-terser');
const minify = require('gulp-clean-css');
const { exec } = require('child_process');


const dirs = {
  src: 'src',
  dest: 'dist',
  comps: 'src/pa11y/components',
};

const injectCodeCmd = 'node --experimental-modules ./scripts/inject-code.mjs';

/////////////// DEFAULT SUBTASKS ///////////////

// Build md and HTML pages for all components
gulp.task('build-html', async () => {
  const child = exec(injectCodeCmd);
  child.stdout.pipe(process.stdout);
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


gulp.task('serve', () => {
  browserSync.init(
    {
      open: false,
      server: `./${dirs.src}`,
    }
  );

  // Watch SASS files and trigger 'sass' task on change
  gulp.watch(`./${dirs.src}/**/*.scss`, gulp.series('sass'));

  // Watch JS files and reload browser on change
  gulp.watch(`./${dirs.src}/**/*.js`).on('change', browserSync.reload);

  // Watch HTML files (except example files) and reload browser on change
  gulp.watch([`./${dirs.src}/**/*.html`, `!./${dirs.comps}/**/examples/*.html`])
    .on('change', browserSync.reload);

  // Watch component SASS files and rebuild md and HTML page on change
  gulp.watch(`./${dirs.comps}/**/*.scss`)
    .on('change', (path) => {
      const pathFragments = path.split('/');
      const componentName = pathFragments[pathFragments.length - 2];
      console.log(`${componentName} scss changed`);
      const child = exec(`${injectCodeCmd} ${componentName} --sass-only`);
      child.stdout.pipe(process.stdout);
    });

  // Watch component example HTML files and rebuild md and HTML page on change
  gulp.watch(`./${dirs.src}/**/examples/*.html`).on('change', (path) => {
    const pathFragments = path.split('/');
    const componentName = pathFragments[pathFragments.length - 3];
    console.log(`${componentName} example file changed`);
    const child = exec(`${injectCodeCmd} ${componentName} --html-only`);
    child.stdout.pipe(process.stdout);
  });

  // // Watch component README.md and rebuild md and HTML page on change
  // gulp.watch(`./${dirs.comps}/**/README.md`)
  //   .on('change', (path) => {
  //     const pathFragments = path.split('/');
  //     const componentName = pathFragments[pathFragments.length - 2];
  //     // const child = exec(`${injectCodeCmd} ${componentName} --md-only`);
  //     // child.stdout.pipe(process.stdout);
  //   });
});


gulp.task('default', gulp.series('build-html', 'sass', 'serve'));


/////////////// BUILD SUBTASKS ///////////////

gulp.task('clean', async () => {
  exec(`rm -rf ./${dirs.dest}/*`);
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


/////////////// BUILD TASKS ///////////////

gulp.task('build', gulp.series(
  'clean',
  gulp.parallel('copy', 'js', 'css')
));


gulp.task('serve-build', gulp.series('build', () => {
  browserSync.init({
    port: 3030,
    open: false,
    server: `./${dirs.dest}`,
  });
}));
