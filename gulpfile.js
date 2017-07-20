var gulp         = require('gulp'),
    gulpUtil     = require('gulp-util'),
    sass         = require('gulp-sass'),
    concat       = require('gulp-concat'),
    gulpif       = require('gulp-if'),
    sourcemaps   = require('gulp-sourcemaps'),
    autoprefixer = require('autoprefixer'),
    scssLint     = require('gulp-scss-lint'),
    cssnano      = require('gulp-cssnano'),
    postcss      = require('gulp-postcss'),
    uglify       = require('gulp-uglify'),
    rename       = require('gulp-rename'),
    del          = require('del'),
    server       = require('gulp-server-livereload'),
    fs           = require('fs'),
    modernizr    = require('modernizr'),
    flexboxFixes = require('postcss-flexbugs-fixes');

var config = {
    resourcePath: 'src/assets/',
    outputPath:   'dist/',
    vendorPath:   'node_modules/',
    env:          gulpUtil.env.type,
    styleFile:    'style.css',
    modernizr:    './modernizr-config.json'
};

var javascriptLibs = {
    header: [
        config.vendorPath + 'html5shiv/dist/html5shiv.js'
    ],
    footer: [
        config.vendorPath + 'jquery/dist/jquery.js',
        config.vendorPath + 'tether/dist/js/tether.js',
        config.vendorPath + 'bootstrap/dist/js/bootstrap.js',
        config.vendorPath + 'owl.carousel/dist/owl.carousel.js',
        config.vendorPath + 'select2/dist/js/select2.full.js',
        config.vendorPath + 'perfect-scrollbar/dist/js/perfect-scrollbar.jquery.js',
        config.vendorPath + 'wnumb/wNumb.js',
        config.vendorPath + 'nouislider/distribute/nouislider.js'
    ]
};

var fonts = [
    config.vendorPath + 'bootstrap-sass/assets/fonts/**/*',
    config.vendorPath + 'font-awesome/fonts/**/*'
];

function isDev() {
    return config.env === 'dev' || config.env === undefined;
}

gulp.task('style', ['clean:css'], function () {

    var plugins = [
        autoprefixer({
            browsers: [
                'last 2 versions',
                'ie 7', 'ie 8', 'ie 9', 'ie 10', 'ie 11'
            ]
        }),
        flexboxFixes()
    ];
    return gulp.src(config.resourcePath + 'scss/theme.scss')
        .pipe(gulpif(!isDev(), sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(plugins))
        .pipe(concat(config.styleFile))
        .pipe(gulp.dest(config.outputPath + 'css/'))
        .pipe(gulpif(!isDev(), cssnano()))
        .pipe(gulpif(!isDev(), sourcemaps.write()))
        .pipe(gulpif(!isDev(), rename({'suffix': '.min'})))
        .pipe(gulp.dest(config.outputPath + 'css/'));
});

gulp.task('libs', ['clean', 'libs:header', 'libs:footer'], function () {
    return true;
});

gulp.task('libs:header', ['clean:js'], function () {
    return gulp.src(javascriptLibs.header)
        .pipe(gulpif(!isDev(), sourcemaps.init()))
        .pipe(concat('libs-header.js', {newLine: '\n;'}))
        .pipe(gulp.dest(config.outputPath + 'js/'))
        .pipe(gulpif(!isDev(), uglify()))
        .pipe(gulpif(!isDev(), sourcemaps.write()))
        .pipe(gulpif(!isDev(), rename({'suffix': '.min'})))
        .pipe(gulpif(!isDev(), gulp.dest(config.outputPath + 'js/')));
});

gulp.task('libs:footer', ['clean:js'], function () {
    return gulp.src(javascriptLibs.footer)
        .pipe(gulpif(!isDev(), sourcemaps.init()))
        .pipe(concat('libs-footer.js', {newLine: '\n;'}))
        .pipe(gulp.dest(config.outputPath + 'js/'))
        .pipe(gulpif(!isDev(), uglify()))
        .pipe(gulpif(!isDev(), sourcemaps.write()))
        .pipe(gulpif(!isDev(), rename({'suffix': '.min'})))
        .pipe(gulpif(!isDev(), gulp.dest(config.outputPath + 'js/')));
});

gulp.task('scripts', ['clean'], function () {
    return gulp.src(config.resourcePath + 'js/**/*.js')
        .pipe(gulpif(!isDev(), sourcemaps.init()))
        .pipe(concat('compiled.js', {newLine: '\n;'}))
        .pipe(gulp.dest(config.outputPath + 'js/'))
        .pipe(gulpif(!isDev(), uglify()))
        .pipe(gulpif(!isDev(), sourcemaps.write()))
        .pipe(gulpif(!isDev(), rename({'suffix': '.min'})))
        .pipe(gulpif(!isDev(), gulp.dest(config.outputPath + 'js/')));
});

gulp.task('images', ['clean'], function () {
    return gulp.src(config.resourcePath + 'img/**/*')
        .pipe(gulp.dest(config.outputPath + 'img/'));
});

gulp.task('clean', ['clean:css', 'clean:js'], function () {
    return true;
});


gulp.task('clean:css', function () {
    return del(config.outputDir + '/**/*.css');
});

gulp.task('clean:js', function () {
    return del(config.outputDir + '/**/*.js');
});

gulp.task('copy-fonts', function () {
    return gulp.src(fonts)
        .pipe(gulp.dest(config.outputPath + 'fonts/'));
});

gulp.task('modernizr', function (done) {
    modernizr.build(config.modernizr, function (code) {
        fs.writeFile('./dist/js/modernizr.js', code, done);
    });
});

gulp.task('copy-sample-data', function () {
    return gulp.src(config.resourcePath + 'json/*.json')
        .pipe(gulp.dest(config.outputPath + 'json/'));
});

gulp.task('serve', function () {
    gulp.src('./dist').pipe(server({
        livereload:       true,
        directoryListing: false,
        open:             true,
        port:             4000
    }));
});

gulp.task('compile', function () {
    'use strict';
    var twig = require('gulp-twig');
    return gulp.src('./src/**/*.twig')
        .pipe(twig({
            data: {
                title: 'The Mall - Ecommerce Template'
            }
        }))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', ['default', 'serve'], function () {
    gulp.watch(config.resourcePath + 'scss/**/*.scss', ['style']);
    gulp.watch(config.resourcePath + 'js/**/*.js', ['scripts']);
    gulp.watch('./src/**/*.twig', ['compile']);
});

gulp.task('default', ['clean', 'modernizr', 'compile', 'style', 'libs', 'copy-fonts', 'images', 'scripts', 'copy-sample-data']);
