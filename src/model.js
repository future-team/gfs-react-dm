import { createReducer } from 'gfs-react-redux-twoway-binding'
import Immutable from 'immutable'
/**
 * 实体、数据模型
 * @class Model
 * */
//需要一个队列保存model
let __gfs_mvc_m_list = {}
let __gfs_mvc_m_actiontypes = {}

/**
 * 一个类装饰器，被装饰的类会变成store
 * @method Model
 * @param target {object} 被包装的对象
 * @example
 *
 *       import {Model} from 'gfs-react-mvc'
 *       //这里由于@为文档关键符号，所以下面将以$代替
 *       //@Model
 *       $Model
         class TestModel {
            //数据模型
            static age = 20
            static xq = {}
            constructor(){

            }
            static save(data, action){

                if(action.data){
                    return data.merge(Immutable.fromJS(action.data) )
                }
            }
            static del(data, action){
                if(action.data){
                    return data.merge(Immutable.fromJS(action.data) )
                }
            }
        }
 * */
export  function Model(target){

    //读取字段组成新的对象
    let modelName = target.name.toLowerCase()
    let method ={}
    let property = {}

    if(modelName.indexOf('model')<=-1){
        modelName+='model'
    }

    //取得属性或方法
    for(let item in target){
        if(!(target[item] instanceof Function) ){
            property[item] = target[item]
        }else{
            method[`${modelName}$$${item}`] = target[item]
            __gfs_mvc_m_actiontypes[`${modelName}$$${item}`] = `${modelName}$$${item}`
        }


    }

    let store = createReducer(modelName, Immutable.fromJS(property ), method)

    __gfs_mvc_m_list[`${modelName}`]=store

}

export function getActionTypes(typeName){
    return __gfs_mvc_m_actiontypes[typeName]
}

export function getModels(){
    return __gfs_mvc_m_list
}

export function emptyModels(){
    __gfs_mvc_m_list = null
    //delete __gfs_mvc_m_list
}


