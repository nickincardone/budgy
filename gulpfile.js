var gulp = require('gulp'),
    gutil = require('gulp-util'),
    browserSync = require('browser-sync'),
    bump = require('gulp-bump'),
    compression = require('compression'),
    concat = require('gulp-concat'),
    fs = require('fs'),
    gzip = require('gulp-gzip'),
    htmlhint = require('gulp-htmlhint'),
    jshint = require('gulp-jshint'),
    karma = require('karma').Server,
    cleanCss = require('gulp-clean-css'),
    ngHtml2Js = require('gulp-ng-html2js'),
    nodemon = require('gulp-nodemon'),
    reload = browserSync.reload,
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    runSequence = require('run-sequence'),
    sass = require('gulp-sass'),
    shortid = require('shortid'),
    sourcemaps = require('gulp-sourcemaps'),
    tar = require('gulp-tar'),
    uglify = require('gulp-uglify'),
    scaffolding = require('scaffolding-angular'),
    shell = require('gulp-shell'),

    input = {
        'source_sass': 'src/app/**/*.scss',
        'source_sass_main': 'src/app/app.scss',
        'vendor_sass': [
            'src/bower_components/ux-core-styles/src/_colors.scss'
        ],
        'source_js': [
            '!src/app/**/*.spec.js',
            '!src/app/**/*.mock.js',
            'src/app/**/*.module.js',
            'src/app/services/**/*.service.js',
            'src/app/**/**/*.js',
            'src/app/**/*.config.js',
            'src/app/**/*.run.js'
        ],
        'lib_css': 'src/lib/sass/**/*.scss',
        'lib_js': 'src/lib/js/**/*.js',
        'vendor_css': [
            'src/bower_components/angular-material/angular-material.css',
            'src/bower_components/angular-material/angular-material.layouts.css',
            'src/bower_components/angular-material-data-table/dist/md-data-table.css',
            'src/bower_components/components-font-awesome/css/font-awesome.css',
            'src/bower_components/uxicon/uxicon.css',
            'src/bower_components/ux-core-styles/dist/ux-core-styles.css',
            'src/bower_components/nvd3/nv.d3.css',
            'src/bower_components/font-awesome/css/font-awesome.css'
        ],
        'vendor_js': [
            'src/bower_components/angular/angular.js',
            'src/bower_components/angular-aria/angular-aria.js',
            'src/bower_components/angular-animate/angular-animate.js',
            'src/bower_components/angular-cookies/angular-cookies.js',
            'src/bower_components/angular-material/angular-material.js',
            'src/bower_components/angular-messages/angular-messages.js',
            'src/bower_components/angular-resource/angular-resource.js',
            'src/bower_components/angular-sanitize/angular-sanitize.js',
            'src/bower_components/angular-ui-router/release/angular-ui-router.js',
            'src/bower_components/moment/moment.js',
            'src/bower_components/angular-moment/angular-moment.js',
            'src/bower_components/lodash/dist/lodash.js'
        ],
        'html': 'src/app/**/*.html',
        'images': ['src/images/*'],
        'fonts': [
            'src/bower_components/font-awesome/fonts/*',
            'src/fonts/pt-sans-v8-latin/*'
        ]
    },
    output = {
        'globalStyles': 'source/app/global-styles',
        'stylesheets': 'www/css',
        'javascript': 'www/js',
        'images': 'www/images',
        'fonts': 'www/fonts'
    },
    zipFiles = [
        './**/*',
        '!./node_modules/**',
        '!./source/**',
        '!./dist/**',
        '!./config/**',
        '!karma.conf.js',
        '!manifest.yml.template',
        '.cfignore',
        '.bowerrc',
        '.gitignore'
    ];

/* Start up browser syncing for local dev */
gulp.task('browser-sync', function () {
    browserSync({
        proxy: "localhost:3000", // local node app address
        port: 3001, // use *different* port than above
        notify: false,
        //host: 'localhost.homedepot.com',
        open: gutil.env.openBS ? 'external' : false,
        middleware: [compression()]
    });
});



/* Start up local dev server */
gulp.task('nodemon', function (cb) {
    gutil.log(gutil.colors.bold.white.bgBlue("nodemon"));
    var called = false;

    return nodemon({
        script: 'server.js',
        ignore: [
            'gulpfile.js',
            'node_modules/',
            'bower_components',
            'public/assets/'
        ]
    })
        .on('start', function () {
            if (!called) {
                called = true;
                cb();
            }
        })
        .on('restart', function () {
            setTimeout(function () {
                reload({
                    stream: false
                });
            }, 1000);
        })
        .on('error', gutil.log)
        .on('crash', gutil.log);
});

/* Run app javascript through jshint */
gulp.task('jshint', function () {
    return gulp.src(input.source_js)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

/* Scaffolding UI **/
gulp.task('scaffolding', function (done) {
    scaffolding.appStart();
});

/* Run app html through htmlhint */
gulp.task('htmlhint', function () {
    var rules = {
        "tagname-lowercase": true,
        "attr-lowercase": true,
        "attr-value-double-quotes": true,
        "doctype-first": false,
        "tag-pair": true,
        "spec-char-escape": true,
        "id-unique": true,
        "src-not-empty": true,
        "attr-no-duplication": true,
        "title-require": true
    };
    gulp.src('source/app/**/*.html')
        .pipe(htmlhint(rules))
        .pipe(htmlhint.reporter())
});

/* Executes all build tasks to build all source files */
gulp.task('build', function () {
    runSequence(
        'build-vendor-js',
        'build-vendor-css',
        ['build-source-js', 'build-lib-js', 'build-source-sass', 'html2js', 'htmlhint']
    );
});

/* Compile css and scss files */
gulp.task('build-source-sass', ['copy-vendor-sass'], function () {
    return gulp.src(input.source_sass_main)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', gutil.log))
        .pipe(concat('source.css').on('error', gutil.log))
        .pipe(cleanCss().on('error', gutil.log))
        .pipe(sourcemaps.write().on('error', gutil.log))
        .pipe(gulp.dest(output.stylesheets))
        .pipe(browserSync.stream().on('error', gutil.log));
});

gulp.task('copy-vendor-sass', function () {
    return gulp.src(input.vendor_sass)
        .pipe(concat('vendor.scss'))
        .pipe(gulp.dest(output.globalStyles));
});

/* Concat app javascript files */
gulp.task('build-source-js', function () {
    return gulp.src(input.source_js)
        .pipe(sourcemaps.init().on('error', gutil.log))
        .pipe(concat('source.js').on('error', gutil.log))
        .pipe(sourcemaps.write().on('error', gutil.log))
        .pipe(gulp.dest(output.javascript));
});

/* Concat lib javascript files */
gulp.task('build-lib-js', function () {
    return gulp.src(input.lib_js)
        .pipe(sourcemaps.init().on('error', gutil.log))
        .pipe(concat('lib.js').on('error', gutil.log))
        .pipe(uglify().on('error', gutil.log))
        .pipe(sourcemaps.write().on('error', gutil.log))
        .pipe(gulp.dest(output.javascript));
});

/* Process and concat vendor css and scss files */
gulp.task('build-vendor-css', function () {
    return gulp.src(input.vendor_css)
        .pipe(concat('vendor.css').on('error', gutil.log))
        .pipe(gulp.dest(output.stylesheets))
        .pipe(browserSync.stream().on('error', gutil.log));
});

/* Concat vendor javascript files */
gulp.task('build-vendor-js', function () {
    return gulp.src(input.vendor_js)
        .pipe(concat('vendor.js').on('error', gutil.log))
        .pipe(gulp.dest(output.javascript));
});

/* Converts html to javascript templateCache */
gulp.task('html2js', function () {
    return gulp.src(input.html)
        .pipe(ngHtml2Js({
            moduleName: 'html-templates'
        }))
        .pipe(concat("templates.min.js").on('error', gutil.log))
        .pipe(uglify().on('error', gutil.log))
        .pipe(gulp.dest(output.javascript))
        .pipe(browserSync.stream().on('error', gutil.log));
});

/* Copy images to public */
gulp.task('images', function () {
    return gulp
        .src(input.images)
        .pipe(gulp.dest(output.images));
});

/* Copy fonts to public */
gulp.task('fonts', function () {
    return gulp
        .src(input.fonts)
        .pipe(gulp.dest(output.fonts));
});

/* Running test specs via command line, single run */
gulp.task('test', ['html2js'], function (done) {
    testWatch(true, done);
});

/* Running test specs via command line, single run */
gulp.task('test-headless', ['html2js'], function (done) {
    testWatchHeadless(true, done);
});

/* Running test specs via command line, watch */
gulp.task('autotest', ['html2js'], function (done) {
    testWatch(false, done);
});

/* Helper function to execute tests based on Karma conf */
function testWatch(singleRun, done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: singleRun
    }, function (code) {
        if (code == 1) {
            gutil.log(gutil.colors.bold.white.bgRed('UNIT TEST FAILURES, EXITING PROCESS'));
            process.exit(code);
        } else {
            gutil.log(gutil.colors.bold.white.bgGreen('UNIT TESTS PASSED'));
            done();
        }
    });
}

/* Helper function to execute tests based on Karma conf */
function testWatchHeadless(singleRun, done) {
    karma.start({
        configFile: __dirname + '/headless.karma.conf.js',
        singleRun: singleRun
    }, function (code) {
        if (code == 1) {
            gutil.log(gutil.colors.bold.white.bgRed('UNIT TEST FAILURES, EXITING PROCESS'));
            process.exit(code);
        } else {
            gutil.log(gutil.colors.bold.white.bgGreen('UNIT TESTS PASSED'));
            done();
        }
    });
}

/* Run the watch task when gulp is called without arguments */
gulp.task('default', function () {
    buildSequence();
});

function buildSequence() {
    runSequence(
        'build',
        //'test',
        'images',
        'fonts'
    );
}
