export {Model} from './model'
export {Control,Sync,fetch} from './control'
export {View} from './view'
export {enumerable as Action,noenumerable as Noenumerable} from './decorator'
//export {binding} from './valuelink'

import extend from 'extend'
import RTools from 'gfs-react-tools'
import {getModels,emptyModels} from './model'
import thunkMiddleware from 'redux-thunk'

import Immutable from 'immutable'

if(window && window.DM_STORE){
    var __initData = {},
        dmStore = window.DM_STORE
    for(var item in dmStore){
        if(dmStore[item] instanceof Object){
            __initData[item] = Immutable.fromJS(dmStore[item] )
        }
    }
    window.DM_STORE = __initData
}

/**
 * 提供Model、View、Control、Sync、RTools等系列便捷类库
 * @module gfs-react-mvc
 * */

/**
 * 页面渲染
 * @class Page
 * */

/**
 *
 * @method page
 * @param opts {object} 可以直接等于react component
 * @param opts.middleware {array} 可选，中间件集合
 * @param opts.module {react component} 必填，需要渲染在页面的组件
 * @param opts.devTools {object} 可选，数据模型调试，可视化面板，可以查看数据模型结构
 * @param opts.bar {object} 可选，异步数据请求时加载状态栏
* @param opts.debug {Boolean} 可选，是否是调试状态，调试状态下会输出日志信息
 * @param opts.agent {string} 可选，默认值为pc，三种可选值：pc、wap、other，other已bar字段对象为准
 * @param opts.container {string} 可选，默认为root，组件放在页面的容器id
 * @return RTools
 * @example
 *
 *      imoprt {page} from 'gfs-react-mvc'
 *      import Module from './TestComponent'
 *
 *      //渲染到页面
 *      page(Module)
 * */
export function page(opts={}){

    if(opts && typeof(opts.module) === 'undefined'){
        opts = {
            module:opts
        }
    }

    opts.middleware = [thunkMiddleware].concat(opts.middleware||[])

    if(opts.debug || (typeof(opts.debug)=='undefined' &&location&& location.port!='') ){
        opts.middleware.push(require('redux-logger')() )
    }

    let rtools = new RTools(extend({
        //可选
        middleware:[],
        //必填
        module:null,
        //可选
        reducers:getModels(),
        //可选n
        //devTools:DevTools,
        //可选 默认loadingbarComponent
        //bar:null,
        //可选  loadingbar平台（pc/wap/other）other直接使用bar字段作为参数
        //agent:'pc',
        //可选  react component放取的节点id
        container:'root',
        debug:false
    },opts) )

    // emptyModels()

    return rtools
}