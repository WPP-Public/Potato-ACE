const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const {exec} = require('child_process');
const gulp = require('gulp');
const minify = require('gulp-clean-css');
const pjson = require('./package.json');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const terser = require('gulp-terser');

const srcDir = './src';
const distDir = './dist';
// Get component library name from package.json
const componentLibrary = pjson.customProperties.componentLibrary;

const dirs = {
  comps: `${srcDir}/${componentLibrary}/components`,
  dist: distDir,
  pages: `${srcDir}/pages`,
  src: srcDir,
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


// Convert all or specific pug file to HTML
gulp.task('pug', () => {
  const args = process.argv;
  const srcArgIndex = args.indexOf('--src');
  let gulpSrc = (srcArgIndex === -1) ? `${dirs.pages}/**/index.pug` : args[srcArgIndex + 1];

  return gulp.src(gulpSrc, {base: dirs.pages})
    .pipe(pug({
      pretty: true,
    }))
    .pipe(gulp.dest(dirs.pages));
});


gulp.task('sass', () => {
  return gulp.src(`${dirs.src}/sass/**/*.scss`)
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(`${dirs.src}/css`))
    .pipe(browserSync.stream());
});

// Copy component gifs to ./src/img directory
gulp.task('gifs', () => {
  return gulp.src(`${dirs.comps}/**/*.gif`)
    .pipe(gulp.dest(`${dirs.src}/img`));
});


gulp.task('serve', () => {
  browserSync.init({
    open: false,
    server: [
      dirs.src,
      `${dirs.src}/pages`,
    ],
  });

  // Run gulp 'sass' task if SASS files change
  gulp.watch([`${dirs.src}/**/*.scss`, `!${dirs.comps}/**/*.scss`], gulp.series('sass'));

  // Convert all pug files to HTML if pug include files change
  gulp.watch([`${dirs.pages}/**/*.pug`, `!${dirs.pages}/**/index.pug`], gulp.series('pug'));

  // Convert 'index.pug' file to HTML if it changes
  gulp.watch(`${dirs.pages}/**/index.pug`).on('change', (path) => {
    console.log(`${path} changed. Converting it to HTML`);
    exec(`gulp pug --src ${path}`).stdout.pipe(process.stdout);
  });

  // Run gulp 'gifs' task if gifs changed
  gulp.watch(`${dirs.comps}/**/*.gif`, gulp.series('gifs'));

  // Reload browser if index.html or JS files or files in img dir change
  gulp.watch([
    `${dirs.pages}/**/index.html`,
    `${dirs.src}/img/*`,
    `${dirs.src}/**/*.js`,
  ]).on('change', browserSync.reload);


  let injectingCode = false;
  // Rebuild component's readme.html if its README.md changes
  gulp.watch(`${dirs.comps}/**/README.md`).on('change', (path) => {
    if (injectingCode) {
      return;
    }
    const pathFragments = path.split('/');
    const componentName = pathFragments[pathFragments.length - 2];
    console.log(`${componentName} README changed`);
    injectingCode = true;
    exec(`${injectCodeCmd} -- ${componentName} --html-only`, () => {
      injectingCode = false;
    }).stdout.pipe(process.stdout);
  });


  // Rebuild component's readme.html if its SASS file changes
  gulp.watch(`${dirs.comps}/**/*.scss`).on('change', (path) => {
    if (injectingCode) {
      return;
    }
    const pathFragments = path.split('/');
    const componentName = pathFragments[pathFragments.length - 2];
    console.log(`${componentName} scss changed`);
    injectingCode = true;
    exec(`${injectCodeCmd} -- ${componentName} && gulp sass`, () => {
      injectingCode = false;
    }).stdout.pipe(process.stdout);
  });


  // Rebuild component's readme.html if its example files change
  gulp.watch(`${dirs.comps}/**/examples/*.html`).on('change', (path) => {
    if (injectingCode) {
      return;
    }
    const pathFragments = path.split('/');
    const exampleName = pathFragments[pathFragments.length - 1];
    const componentName = pathFragments[pathFragments.length - 3];
    console.log(`${componentName} ${exampleName} changed`);
    injectingCode = true;
    exec(`${injectCodeCmd} -- ${componentName} --examples-only`, () => {
      injectingCode = false;
    }).stdout.pipe(process.stdout);
  });
});


/////////////// BUILD SUBTASKS ///////////////

gulp.task('build-clean', async () => {
  exec(`rm -rf ${dirs.dist}/*`);
});


gulp.task('build-sass', () => {
  return gulp.src(`${dirs.src}/sass/**/*.scss`)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(minify())
    .pipe(gulp.dest(`${dirs.dist}/css`));
});


gulp.task('build-css', () => {
  return gulp.src([`${dirs.src}/css/**/*.css`, `!${dirs.src}/css/styles.css`])
    .pipe(minify())
    .pipe(gulp.dest(`${dirs.dist}/css`));
});


gulp.task('build-html', () => {
  return gulp.src(`${dirs.src}/pages/**/index.html`, {base: `${dirs.src}/pages`})
    .pipe(gulp.dest(dirs.dist));
});


gulp.task('build-imgs', () => {
  return gulp.src(`${dirs.src}/img/**/*`, {base: `${dirs.src}/`})
    .pipe(gulp.dest(dirs.dist));
});


gulp.task('build-js', () => {
  return gulp.src(`${dirs.src}/{js,${componentLibrary}}/**/*.js`)
    .pipe(terser())
    .pipe(gulp.dest(dirs.dist));
});

/////////////// MAIN TASKS ///////////////

gulp.task('default', gulp.series('build-pages', gulp.parallel('pug', 'sass', 'gifs'), 'serve'));


gulp.task(
  'build',
  gulp.series(
    'build-clean',
    gulp.parallel(
      'build-sass',
      'build-css',
      'build-imgs',
      'build-js',
      gulp.series(
        'build-pages',
        'pug',
        'build-html'
      )
    )
  )
);


gulp.task('serve-build', gulp.series('build', () => {
  browserSync.init({
    port: 3030,
    open: false,
    server: dirs.dist,
  });
}));
