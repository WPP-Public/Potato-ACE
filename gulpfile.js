const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();
const {exec} = require('child_process');
const flatten = require('gulp-flatten');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const minify = require('gulp-clean-css');
const pjson = require('./package.json');
const postcss = require('gulp-postcss');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const terser = require('gulp-terser');

// Get component library name from package.json
const LIB_NAME = pjson.customProperties.componentLibrary;

// DIRS
const SRC = './src';
const DIST = './dist';
const LIB_DIR = `${SRC}/${LIB_NAME}`;
const COMPS_DIR = `${LIB_DIR}/components`;
const PAGES_DIR = `${SRC}/pages`;

const BUILD_DOCS_CMD = 'npm run build-docs';

const componentsData = require(`${COMPS_DIR}/components.json`);
const collaboratorsData = require(`${PAGES_DIR}/about/collaborators.json`);


// Get value of given argument
const getArg = (arg) => {
	const args = process.argv;
	const argIndex = args.indexOf(`--${arg}`);
	return (argIndex !== -1) && args[argIndex + 1];
}


// Determine if the '--prod' arg was given
const prodArgGiven = () => {return process.argv[process.argv.length - 1] === '--prod'};


// Run given bash command
const runCmd = (cmd, cb) => {
	return new Promise((res, rej) => {
		exec(cmd, (err, stdout, stderr) => {
			if (err) {
				rej(err);
				return;
			}
			console.error(stderr);
			res();
		}).stdout.pipe(process.stdout);
	});
};


/////////////// SUBTASKS ///////////////
// Clean dist directory
gulp.task('clean', async () => {
	return exec(`rm -rf ${DIST}/*`, (error) => {
			if (error) { console.log(error); }
		}).stdout.pipe(process.stdout);
});

// Copy CSS files from css dir to dist and minify
gulp.task('css', () => {
	isProd = prodArgGiven();
	return gulp.src(`${SRC}/css/**/*.css`, {sourcemaps: isProd})
		.pipe(postcss([autoprefixer]))
		.pipe(minify())
		.pipe(gulp.dest(`${DIST}/css`, {sourcemaps: isProd}));
});


// ///////////
// MEDIA
// ///////////
// Copy component mp4s to ./dist/img directory
gulp.task('vid', () => {
	return gulp.src(`${COMPS_DIR}/**/media/*.mp4`)
		.pipe(flatten())
		.pipe(gulp.dest(`${DIST}/vids/components`));
});

// Copy images to dist
gulp.task('img', () => {
	return gulp.src(`${SRC}/img/**/*`)
		.pipe(gulp.dest(`${DIST}/img`));
});
// ///////////


// ///////////
// SASS
// ///////////
// Convert given gulp src SASS file(s) to CSS with sourcemaps, autoprefix and put in dist
const convertSass = (src, isProd=false) => {
	return gulp.src(src, {sourcemaps: isProd})
		.pipe(
			sass({outputStyle: 'expanded'})
			.on('error', sass.logError)
		)
		.pipe(postcss([autoprefixer]))
		.pipe(gulpif(isProd, minify()))
		.pipe(gulp.dest(`${DIST}/css`, {sourcemaps: isProd}))
		.pipe(browserSync.stream());
}

// Convert Docs SASS to CSS and move to dist
gulp.task('main-sass', () => {
  return runCmd(`npm run nxm -- ./scripts/convert-sass.mjs`);
});

gulp.task('docs-sass', () => {
	isProd = prodArgGiven();
	return convertSass(`${SRC}/sass/styles.scss`, isProd);
});

// Convert examples SASS to CSS and move to dist
gulp.task('examples-sass', () => {
	isProd = prodArgGiven();
	return convertSass(`${COMPS_DIR}/**/examples/*.scss`, isProd);
});

// Convert all SASS to CSS and move to dist
gulp.task('sass',  gulp.series(
	async () => {
		console.log('>> Linting SASS...');
		await runCmd('npm run lint:scss');
	},
	gulp.parallel('docs-sass', 'examples-sass')
));
// ///////////

// ///////////
// TS
// ///////////
// Move JS to dist
gulp.task('js', async () => {
	isProd = prodArgGiven();
	await runCmd('npm run lint:js');

	return gulp.src([`${SRC}/**/*.js`, `!**/*.test.js`], {sourcemaps: isProd})
		.pipe(gulpif(isProd, terser()))
		.pipe(gulp.dest(DIST, {sourcemaps: isProd}));
});

// Convert TS files to JS and then run 'js' task
gulp.task('ts', gulp.series(
	async () => {
		console.log('>> Linting TS...');
		await runCmd('npm run lint:ts');

		console.log('>> Converting TS to JS');
		await runCmd('tsc');
	},
	'js'
));
// ///////////


// Convert Pug files to HTML and move to dist
gulp.task('pug', () => {
	const filePath = getArg('path');
	const src = filePath || `**/index.pug`;
	const msg = filePath ?
		`Compiling ${filePath}...` :
		'Compiling all pug files...';
	console.log(`>> ${msg}`);

	return gulp.src(src, {base: PAGES_DIR})
		.pipe(pug({
			pretty: true,
			data: {
				components: componentsData,
				collaborators: collaboratorsData,
			},
		}))
		.pipe(flatten({includeParents: -1}))
		.pipe(gulp.dest(DIST));
});


// ///////////
// SERVE
// ///////////
gulp.task('serve', () => {
	let processingChange = false;
	isProd = prodArgGiven();
	const portNumber = isProd ? 3030 : 3000;
	browserSync.init({
		open: false,
		port: portNumber,
		server: DIST,
	});

	// ///////////
	// WATCHERS
	// ///////////
	// BUILD DOCS TRIGGER FILES
	// Build docs if component main SASS or example files change
	gulp.watch([
		`${COMPS_DIR}/*/examples/*`,
		`${COMPS_DIR}/**/{*.scss,README.md}`,
		`${LIB_DIR}/README.md`
	]).on('change', async (path) => {
		if (processingChange) {
			return;
		}
		processingChange = true;

		if (path === `${LIB_DIR.replace('./', '')}/README.md`) {
			await runCmd(BUILD_DOCS_CMD);
			await runCmd('gulp pug');
		} else {
			// If SASS file changed compile SASS files
			if (path.includes('.scss')) {
				runCmd('gulp sass');
			}
			// If JS file changed run JS gulp task
			if (path.includes('.js')) {
				runCmd('gulp js');
			}

			// Build docs and compile index.pug for component
			const component = path.split('components/')[1].split('/')[0];
			await runCmd(`${BUILD_DOCS_CMD} -- ${component}`);
			const pugFilePath = `${PAGES_DIR}/includes/components/${component}/index.pug`;
			await runCmd(`gulp pug --path ${pugFilePath}`);
		}

		processingChange = false;
		browserSync.reload();
	});


	// MP4S
	// Run gulp 'vid' task if .mp4 files changes
	gulp.watch(`${COMPS_DIR}/**/media/*.mp4`).on('change', gulp.series('vid', browserSync.reload));


	// IMGS
	// Run gulp 'img' task if image changes
	gulp.watch(`${SRC}/img/**/*`).on('change', gulp.series('img', browserSync.reload));


	// PUG
	// Compile pug file if index.pug changes, except components files
	gulp.watch([
		`${PAGES_DIR}/*/index.pug`,
		`!${PAGES_DIR}/includes/components/**/*`,
	]).on('change', async (path) => {
		await runCmd(`gulp pug --path ${path}`);
		browserSync.reload();
	})

	// Compile all pug files if mixin or include pug file changes, except components files
	gulp.watch(`${PAGES_DIR}/{includes,mixins}/*`).on('change', gulp.series('pug', browserSync.reload));


	// SASS
	// Compile SASS files to CSS if any SASS files (except component ones) change
	gulp.watch([`**/*.scss`, `!${COMPS_DIR}/**/*.scss`], gulp.series('sass'));

	// Covert component main SASS file to CSS if it changes
	gulp.watch(`${COMPS_DIR}/*/*.scss`).on('change', async (path) => {
		const component = path.split('components/')[1].split('/')[0];
		await runCmd(`npm run nxm -- ./scripts/convert-sass.mjs ${component}`);
	});


	// TS
	// Build ts files if they change and copy them to dist
	gulp.watch([`**/*.ts`, `!**/*.d.ts`]).on('change', gulp.series('ts', browserSync.reload));


	// JS
	// Build js files if they change and copy them to dist
	gulp.watch([`${SRC}/js/**/*.js`, `!${COMPS_DIR}/**/*.js`]).on('change', gulp.series('js', browserSync.reload));
});


// ///////////
// MAIN TASKS
// ///////////
gulp.task('build', gulp.series(
	gulp.parallel(
		'clean',
		async () => {await runCmd(BUILD_DOCS_CMD)},
	),
	gulp.parallel(
		'main-sass',
		'ts',
		'css',
		'vid',
		'img',
		'pug',
		'sass'
	)
));

gulp.task('default', gulp.series('build', 'serve'));
