const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const { exec } = require('child_process');
const gulp = require('gulp');
const minify = require('gulp-clean-css');
const pjson = require('./package.json');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const terser = require('gulp-terser');

// Get component library name from package.json
const componentLibrary = pjson.customProperties.componentLibrary;

const dirs = {
  src: 'src',
  dest: 'dist',
  comps: `src/${componentLibrary}/components`,
};

const injectCodeCmd = 'npm run inject';


/////////////// DEFAULT SUBTASKS ///////////////

// Build md and HTML pages for all components
gulp.task('build-pages', () => {
  return new Promise((resolve, reject) => {
      exec(injectCodeCmd, (error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      }).stdout.pipe(process.stdout);
  });
});


gulp.task('sass', () => {
  return gulp.src(`./${dirs.src}/sass/**/*.scss`)
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(`./${dirs.src}/css`))
    .pipe(browserSync.stream());
});


gulp.task('serve', () => {
  browserSync.init(
    {
      open: false,
      server: [
        `./${dirs.src}`,
        `./${dirs.src}/pages`,
      ],
    }
  );

  // Watch SASS files and trigger 'sass' task on change
  gulp.watch(`./${dirs.src}/**/*.scss`, gulp.series('sass'));

  // Watch JS files and reload browser on change
  gulp.watch(`./${dirs.src}/**/*.js`)
    .on('change', browserSync.reload);

  // Watch HTML files (except example files) and reload browser on change
  gulp.watch(`./${dirs.src}/pages/**/*.html`)
    .on('change', browserSync.reload);

  // Watch component SASS files and rebuild md and HTML page on change
  gulp.watch(`./${dirs.comps}/**/*.scss`)
    .on('change', (path) => {
      const pathFragments = path.split('/');
      const componentName = pathFragments[pathFragments.length - 2];
      console.log(`${componentName} scss changed`);
      exec(`${injectCodeCmd} -- ${componentName}`).stdout.pipe(process.stdout);
    });

  // Watch component example HTML files and rebuild md and HTML page on change
  gulp.watch(`./${dirs.comps}/**/examples/*.html`)
    .on('change', (path) => {
      const pathFragments = path.split('/');
      const exampleName = pathFragments[pathFragments.length - 1];
      const componentName = pathFragments[pathFragments.length - 3];
      console.log(`${componentName} ${exampleName} changed`);
      exec(`${injectCodeCmd} -- ${componentName} --html-only`).stdout.pipe(process.stdout);
    });
});


gulp.task('default', gulp.series('build-pages', 'sass', 'serve'));


/////////////// BUILD SUBTASKS ///////////////

gulp.task('clean', async () => {
  exec(`rm -rf ./${dirs.dest}/*`);
});


gulp.task('html', () => {
  return gulp.src(`./${dirs.src}/pages/**/*.html`, { base: `./${dirs.src}/pages` })
    .pipe(gulp.dest(`./${dirs.dest}/`));
});


gulp.task('img', () => {
  return gulp.src(`./${dirs.src}/img/**/*`, { base: `./${dirs.src}/` })
    .pipe(gulp.dest(`./${dirs.dest}/`));
});


gulp.task('js', () => {
  return gulp.src(`./${dirs.src}/{js,asce}/**/*.js`)
    .pipe(terser())
    .pipe(gulp.dest(`./${dirs.dest}/`));
});


gulp.task('build-sass', () => {
  return gulp.src(`./${dirs.src}/sass/**/*.scss`)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest(`./${dirs.src}/css`));
});


gulp.task('css', gulp.series('build-sass', () => {
  return gulp.src(`./${dirs.src}/css/**/*.css`)
    .pipe(minify())
    .pipe(gulp.dest(`./${dirs.dest}/css/`));
}));


/////////////// BUILD TASKS ///////////////

gulp.task('build', gulp.series(
  gulp.parallel('clean', 'build-pages'),
  gulp.parallel('html', 'js', 'css', 'img')
));


gulp.task('serve-build', gulp.series('build', () => {
  browserSync.init({
    port: 3030,
    open: false,
    server: `./${dirs.dest}`,
  });
}));
