var gulp = require('gulp'),
sass = require('gulp-sass'),
autoprefixer = require('gulp-autoprefixer'),
watch = require('gulp-watch'),
browserSync = require('browser-sync').create(),
eslint = require('gulp-eslint'),
jasmine = require('gulp-jasmine-phantom'),
concat = require('gulp-concat'),
uglify = require('gulp-uglify'),
ghPages = require('gulp-gh-pages'),
babel = require('gulp-babel'),
imagemin = require('gulp-imagemin'),
pngquant = require('imagemin-pngquant');

gulp.task('default', ['copy-html', 'copy-images', 'copy-fonts', 'scripts', 'copy-sounds', 'styles', 'lint'], function(){
    browserSync.init({
        server: './dist'
    });

    gulp.watch('./src/style/**/*.scss',['styles']);
    gulp.watch('./src/style/**/*.css',['styles']);
    gulp.watch('./src/js/**/*.js',['lint','scripts']).on('change', browserSync.reload);
    gulp.watch('./src/**/*.html',['copy-html']).on('change', browserSync.reload);
    gulp.watch('./src/index.html').on('change', browserSync.reload);
});

gulp.task('dist', [
    'copy-html',
    'copy-images',
    'styles',
    'lint',
    'scripts-dist',
    'copy-sounds',
    'copy-fonts'
]);

gulp.task('scripts', function(){
    gulp.src('./src/js/**/*.js')
        .pipe(babel())
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./dist/js'));
    gulp.src('./src/lib/**/*.js')
        .pipe(uglify())
        //.pipe(concat('all.js'))
        .pipe(gulp.dest('./dist/lib'));
});

gulp.task('scripts-dist', function(){
    gulp.src('src/js/**/*.js')
        .pipe(babel())
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
    gulp.src('./src/lib/**/*.js')
        .pipe(uglify())
        //.pipe(concat('all.js'))
        .pipe(gulp.dest('./dist/lib'));
});

gulp.task('copy-html', function(){
    gulp.src('./src/**/*.html')
        .pipe(gulp.dest('./dist'));
});


gulp.task('copy-images', function(){
    gulp.src('src/img/**')
        .pipe(imagemin({
            progressive:true,
            use: [pngquant()]
        }))
        .pipe(gulp.dest('dist/img'));
});


gulp.task('copy-sounds', function(){
    gulp.src('src/sounds/**')
        .pipe(gulp.dest('./dist/style/sounds'));
});

gulp.task('copy-fonts', function(){
    gulp.src('src/style/fonts/**')
        .pipe(gulp.dest('./dist/style/fonts'));
});

gulp.task('styles', function(){
    console.log('executing styles');
    gulp.src('./src/style/**/*.scss')
        .pipe(sass({outputStyle:'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(gulp.dest('./dist/style/css'))
        .pipe(browserSync.stream());
});

gulp.task('lint', function(){
    return gulp.src(['./src/js/**/*.js'])
        // eslint() attaches the lint output to the eslint property
        // of the file object so it can be used by other modules
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console
        // Alternatively use eslint.formatEach() (see docs)
        .pipe(eslint.format())
        // to have the process with an error code (1) on
        // lint error, return the stream and pipe to failOnError last.
        .pipe(eslint.failOnError());

});

gulp.task('test', function(){
    gulp.src('src/test/spec/extra/Spec.js')
        .pipe(jasmine({
            integration: true,
            vendor: 'js/**/*.js'
        }));
});

gulp.task('deploy', function(){
    return gulp.src('./dist/**/*')
        .pipe(ghPages({
            branch: 'master'
        }));
});