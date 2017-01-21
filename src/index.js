export {Model} from './model'
export {Control,Sync,getControl} from './control'
export {View} from './view'

import extend from 'extend'
import RTools from 'gfs-react-tools'
import {getModels,emptyModels} from './model'

export function page(opts={}){

    if(opts && typeof(opts.module) === 'undefined'){
        opts = {
            module:opts
        }
    }

    new RTools(extend({
        //可选
        middleware:[],
        //必填
        module:null,
        //可选
        reducers:getModels(),
        //可选
        //devTools:DevTools,
        //可选 默认loadingbarComponent
        //bar:null,
        //可选  loadingbar平台（pc/wap/other）other直接使用bar字段作为参数
        //agent:'pc',
        //可选  react component放取的节点id
        container:'root'
    },opts) )

    emptyModels()
}