var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('webpack');
var Server = require('karma').Server;
var webpackExample = require('./webpack/webpack-dev.config');
var webpackModule = require('./webpack/webpack.config');
var open = require('gulp-open');
var del = require('del');
var internalIP = require('internal-ip');
var babel = require('gulp-babel');
var path = require('path');
var runSequence = require('gulp-run-sequence');

var config = require('./package.json');

var error = function(e) {
    console.error(e);
    if (e.stack) {
        console.error(e.stack);
    }
    process.exit(1);
};
gulp.task('karma', function(done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task('open', function() {
    gulp.src(__filename)
        .pipe(open({ uri: "http://" + (internalIP.v4() || '127.0.0.1') + ":8081/index.html" }));
});

gulp.task('hot', function(callback) {
    webpackExample.server();

});

gulp.task('webpack-module', function(done) {
    webpack(Object.create(webpackModule)).run(function(err, stats) {
        if (err) throw new gutil.PluginError("webpack-module", err);
        gutil.log("[webpack]", stats.toString({
            // output options
        }));
        done();
    });
});
gulp.task('webpack-example', function(done) {
    var wbpk = Object.create(webpackExample.build);
    wbpk.output.path = path.join(process.cwd(), 'examples/dist');
    webpack(wbpk).run(function(err, stats) {
        if (err) throw new gutil.PluginError("webpack-example", err);
        gutil.log("[webpack]", stats.toString({
            // output options
        }));
        done();
    });
});

gulp.task('min-webpack', function(done) {

    var wbpk = Object.create(webpackModule);
    wbpk.output.filename = '[name].min.js';
    wbpk.plugins.push(new webpack.optimize.UglifyJsPlugin());

    webpack(wbpk).run(function(err, stats) {
        if (err) throw new gutil.PluginError("min-webpack", err);
        gutil.log("[webpack]", stats.toString({
            // output options
        }));
        done();
    });
});

gulp.task('babel', function(done) {
    return gulp.src('src/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('lib'));
});

gulp.task('watch', function() {
    gulp.watch(['./lib/**/*.*'], ['demo']);
});

gulp.task('default', function(cb) {
    runSequence('babel', 'webpack-module', 'webpack-example', cb);
});

//gulp.task('default', ['babel', 'webpack-module','webpack-example']);
gulp.task('test', ['karma']);
gulp.task('demo', ['hot', 'open']);
gulp.task('min', ['min-webpack']);