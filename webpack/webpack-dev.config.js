var webpackConfig = require('./webpack.config');
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var path = require('path');
var gutil = require("gulp-util");
var glob = require('glob');

var wbpk = Object.create(webpackConfig);

var getEntry = function(){
    var webpackConfigEntry = {};
    var basedir =path.join(process.cwd(),'examples/src' );
    var files = glob.sync(path.join(basedir, '*.js'));

    files.forEach(function(file) {
        var relativePath = path.relative(basedir, file);
        webpackConfigEntry[relativePath.replace(/\.js/,'').toLowerCase()] = [file];
    });
    return webpackConfigEntry;
};

wbpk.entry = getEntry();
//wbpk.output.path = path.join(process.cwd(), 'examples/dist');

wbpk.module.loaders=wbpk.module.loaders.filter(function(item){
    return item.test.toString().match(/less|css/i)==null;
}).concat([
    {
        test: /\.(less$)$/,
        loader:"style!css!less"
    },
    {
        test: /\.css$/,
        loader: "style!css?-restructuring"
    }
]);

module.exports.server= function(){
    var devPort = 8081;
    wbpk.devtool = 'eval';
    for (var key in wbpk.entry) {
        var ar = wbpk.entry[key];

        if (key != "common" && key!='dev') {
            ar.unshift('webpack-dev-server/client?http://0.0.0.0:'+devPort , "webpack/hot/dev-server");
        }
    }
    wbpk.externals = [];
    wbpk.plugins.push(
        new webpack.HotModuleReplacementPlugin()
    );


    var compiler = webpack(wbpk);

    new WebpackDevServer(compiler, {
        publicPath: "/dist/",
        contentBase:path.join(process.cwd(),'examples/'),
        hot: true,
        inline:true,
        historyApiFallback: true,
        port: devPort,
        stats: {
            colors: true
        }
    }).listen(devPort, "0.0.0.0", function (err) {
            if (err) throw new gutil.PluginError("webpack-dev-server", err);

        });
};
module.exports.build = wbpk;
