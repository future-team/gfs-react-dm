var config = require('./package.json');
//var description = require('./README.md');
var fs = require('fs');
var path = require('path');
var data=fs.readFileSync(path.resolve(__dirname,'src/info.html'),"utf-8");

module.exports = {
    //扫描的文件路径
    paths: ['src/'],
    demoDir:"examples/",
    //文档页面输出路径
    outdir: 'doc/',
    //内置主题
    // theme:'ui',
    //自定义主题目录
    //themedir: 'theme-smart-ui/',
    //项目信息配置
    project: {

        //项目名称
        name: config.name,

        //项目描述，可以配置html，会生成到document主页
        description: data,

        //版本信息
        version: config.version,
        //是否隐藏defined in 注解(代码定义于第几行)
        hideFoundAt:'true',
        //是否禁止每个class里的methods、properties、events表格
        hideClassItemTable:'true',
        //是否隐藏tab栏
        hideTabItemList:'true',
        hideViewDemo:'true',
        hideEditCode:'true',
        //设置默认active的tab，不设置的话默认激活detail tab
        activeTab:'method',
        //地址信息
        url: '',
        //logo:'dp-logo.png',

        //导航信息
        navs: [{
            name: "主页",
            url: "index.html"
        }]
    },
    //demo页面需要加载的js库
    demo: {
        autoComplete : true//,
        //paths : ['examples/','bower_components']
        //link : ['bower_components/react/react.js','bower_components/react/react-dom.js']
    }
};

