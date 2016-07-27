/************
 * gulp配置文件 *
 ************/

var gulp = require('gulp'); //gulp主功能

// 语法编译
var less = require('gulp-less'); //less编译
var babel = require('gulp-babel');

// 文件处理
// var rename = require('gulp-rename'); //文件更名
// var concat = require('gulp-concat'); //文件合并
var uglify = require('gulp-uglify'); //js压缩
var autoprefixer = require('gulp-autoprefixer'); //css自动浏览器前缀

//当发生异常时提示错误 确保本地安装gulp-notify和gulp-plumber
var notify = require('gulp-notify'); //提示信息
var plumber = require('gulp-plumber');

// 同步刷新浏览器
var browserSync = require('browser-sync');
var reload = browserSync.reload;


// =================================
// 开始配置
// =================================

var jsSrc = 'src/js/**/*.js';
var lessSrc = 'src/less/**/*.less';


gulp.task('less', function() {
    return gulp.src(lessSrc)
        .pipe(plumber({
            errorHandler: notify.onError('Error: <%= error.message %>')
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0']
        }))
        .pipe(less())
        .pipe(gulp.dest('dist/css'))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('js-es2015', function() {
    // 编译js-es6
    return gulp.src(jsSrc)
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist/js'))
})

gulp.task('js-compress', function() {
    // js编译并压缩
    return gulp.src(jsSrc)
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
})


gulp.task('default', [], function() {
    // 总任务，这里会执行整个gulp任务并开启浏览器同步。

    // 文件改变，自动同步浏览器刷新
    browserSync.init({

        // 需要监听的文件路径和类型
        // files: "**",
        files: [
            "dist/**/*.css",
            "dist/**/*.js",
            "dist/**/*.html",
            "demos/**"
        ],

        // 启动端口
        port: 7777,

        // 动态根路径
        server: {
            baseDir: "./dist/",
            // index: "./demos/wui/index.html"
            index: "./demos/sui/index.html"
        },

        // 静态化的路径
        serveStatic: ['./demos/']


    });

    // 文件改变，自动执行编译或打包的任务
    gulp.watch(lessSrc, ['less'])
    gulp.watch(jsSrc, ['js-es2015'])

});
