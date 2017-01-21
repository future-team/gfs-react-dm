import { createReducer } from 'gfs-react-redux-twoway-binding'
import Immutable from 'immutable'

//需要一个队列保存model
let __gfs_mvc_m_list = {}
let __gfs_mvc_m_actiontypes = {}

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


