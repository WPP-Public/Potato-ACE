const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const {exec} = require('child_process');
const flatten = require('gulp-flatten');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const minify = require('gulp-clean-css');
const pjson = require('./package.json');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const terser = require('gulp-terser');
const ts = require('gulp-typescript');
const argv = require('yargs').argv;
const gulpif = require('gulp-if');

const isProduction = !!argv['production'];

const buildDocsCmd = 'npm run build-docs';
// Get component library name from package.json
const componentLibrary = pjson.customProperties.componentLibrary;

const srcDir = './src';
const distDir = './dist';
const dirs = {
  comps: `${srcDir}/${componentLibrary}/components`,
  dist: distDir,
  lib: `${srcDir}/${componentLibrary}`,
  pages: `${srcDir}/pages`,
  src: srcDir,
};
const componentsData = require(`${dirs.comps}/components.json`);


/////////////// SUBTASKS ///////////////

// Build md and HTML pages for all components
gulp.task('build-docs', () => {
  return new Promise((resolve, reject) => {
      exec(buildDocsCmd, (error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      }).stdout.pipe(process.stdout);
  });
});


// Clean dist directory
gulp.task('clean', async () => {
  exec(`rm -rf ${dirs.dist}/*`);
});


// Copy other CSS files to dist and minify e.g. prism.js
gulp.task('css', () => {
  const isProd = process.argv[process.argv.length - 1] === '--prod';
  return gulp.src([`${dirs.src}/css/**/*.css`, `!${dirs.src}/css/styles.css`])
    .pipe(gulpif(isProd, minify()))
    .pipe(gulp.dest(`${dirs.dist}/css`));
});


// Copy component gifs to ./src/img directory
gulp.task('gifs', () => {
  return gulp.src(`${dirs.comps}/**/media/*.gif`)
    .pipe(flatten())
    .pipe(gulp.dest(`${dirs.dist}/img/components`));
});


gulp.task('imgs', () => {
  return gulp.src(`${dirs.src}/img/**/*`)
    .pipe(gulp.dest(`${dirs.dist}/img`));
});


gulp.task('js', () => {
  const isProd = process.argv[process.argv.length - 1] === '--prod';
  return gulp.src([`${dirs.src}/js/**/*.js`, `${dirs.comps}/**/examples/*.js`])
    .pipe(gulpif(isProd, terser()))
    .pipe(flatten({ subPath: [0, 1]}))
    .pipe(gulp.dest(`${dirs.dist}/js`));
});


gulp.task(`js-${componentLibrary}`, () => {
  const isProd = process.argv[process.argv.length - 1] === '--prod';
  return gulp.src([`${dirs.src}/ace/**/*.js`, `!${dirs.comps}/**/*.test.js`, `!${dirs.comps}/**/examples/*.js`, `!${dirs.comps}/template/*`], {base: dirs.src})
    .pipe(gulpif(isProd, terser()))
    .pipe(gulp.dest(dirs.dist));
});


// Convert all or specific pug file to HTML
gulp.task('pug', () => {
  const args = process.argv;
  const srcArgIndex = args.indexOf('--src');
  const gulpSrc = (srcArgIndex === -1) ? `${dirs.pages}/**/index.pug` : args[srcArgIndex + 1];

  return gulp.src(gulpSrc, {base: dirs.pages})
    .pipe(pug({
      pretty: true,
      data: { components: componentsData },
    }))
    .pipe(flatten({ includeParents: -1 }))
    .pipe(gulp.dest(dirs.dist));
});


gulp.task('sass', () => {
  const isProd = process.argv[process.argv.length - 1] === '--prod';
  return gulp.src(`${dirs.src}/sass/**/*.scss`)
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(gulpif(isProd, minify()))
    .pipe(gulp.dest(`${dirs.dist}/css`))
    .pipe(browserSync.stream());
});


gulp.task('ts', () => {
  const isProd = process.argv[process.argv.length - 1] === '--prod';
  return gulp.src(`${dirs.src}/{ts,${componentLibrary}}/**/*.ts`)
    .pipe(ts({target: 'esnext'}))
    .pipe(gulpif(isProd, terser()))
    .pipe(gulp.dest(dirs.dist));
});


gulp.task('serve', () => {
  let injectingCode = false;

  browserSync.init({
    open: false,
    server: dirs.dist,
  });

  // Convert all pug files to HTML if pug include files change
  gulp.watch([`${dirs.pages}/**/*.pug`, `!${dirs.pages}/**/index.pug`], gulp.series('pug'));

  // Convert 'index.pug' file to HTML if it changes
  gulp.watch(`${dirs.pages}/**/index.pug`).on('change', (path) => {
    console.log(`${path} changed. Converting it to HTML`);
    exec(`gulp pug --src ${path}`).stdout.pipe(process.stdout);
  });

  // Build docs if package main README.md changes
  gulp.watch(`${dirs.lib}/README.md`, gulp.series('build-docs'));


  gulp.watch([`${dirs.src}/{ts,${componentLibrary}}/**/*.ts`]).on('change', () => (gulp.series('build-ts'))());


  // Rebuild component readme.html if README.md changes
  gulp.watch(`${dirs.comps}/**/README.md`).on('change', (path) => {
    if (injectingCode) {
      return;
    }
    const pathFragments = path.split('/');
    const componentName = pathFragments[pathFragments.length - 2];
    console.log(`${componentName} README changed`);
    injectingCode = true;
    exec(`${buildDocsCmd} -- ${componentName} --html-only`, () => {
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
    exec(`${buildDocsCmd} -- ${componentName} --examples-only`, () => {
      injectingCode = false;
    }).stdout.pipe(process.stdout);
  });

  // Run gulp 'sass' task if SASS files change
  gulp.watch([`${dirs.src}/**/*.scss`, `!${dirs.comps}/**/*.scss`], gulp.series('sass'));

  // Rebuild component's readme.html if its SASS file changes
  gulp.watch(`${dirs.comps}/**/*.scss`).on('change', (path) => {
    if (injectingCode) {
      return;
    }
    const pathFragments = path.split('/');
    const componentName = pathFragments[pathFragments.length - 2];
    console.log(`${componentName} scss changed`);
    injectingCode = true;
    exec(`${buildDocsCmd} -- ${componentName} && gulp sass`, () => {
      injectingCode = false;
    }).stdout.pipe(process.stdout);
  });

  gulp.watch([`${dirs.src}/js/**/*.js`, `${dirs.comps}/**/examples/*.js`], gulp.series('js'));

  // Run gulp 'gifs' task if gifs changed
  gulp.watch(`${dirs.comps}/**/media/*.gif`, gulp.series('gifs', () => { return browserSync.reload; }));

  // RELOAD
  // Reload browser if index.html or JS files or files in img dir change
  gulp.watch([
    `${dirs.dist}/**/index.html`,
    `${dirs.dist}/**/*.js`,
  ]).on('change', browserSync.reload);
});


/////////////// TASKS ///////////////

gulp.task('build',
  gulp.series('clean', gulp.parallel(
    'css',
    'gifs',
    'imgs',
    'js',
    `js-${componentLibrary}`,
    'sass',
    gulp.series('build-docs', 'pug'))
  )
);


gulp.task('default', gulp.series('build', 'serve'));
