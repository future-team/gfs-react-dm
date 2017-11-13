import { createReducer } from 'gfs-react-redux-twoway-binding'
import Immutable from 'immutable'
/**
 * 实体、数据模型，model中的方法和属性都该设置成静态类型
 * @class Model
 * */
//需要一个队列保存model
let __gfs_mvc_m_list = {}
let __gfs_mvc_m_actiontypes = {}

export const DEFAULT_METHOD_FIX = '$$'
export const DEFAULT='default'

function getField(data,path){
    try{
        var newpath = path.concat()
        for(var i=0,len=newpath.length,p,v;i<len;i++){
            //如果path不是最后一个
            if(i!=len){
                p = newpath.slice(0,i+1)
                v = data.getIn(p)
                if(!v ){
                    data = typeof(v)=='undefined' ? data.mergeIn(p.slice(0,p.length-1),Immutable.fromJS({
                        [p[p.length-1]]:{}
                    }) ) : data.setIn(p,{})
                }
            }
        }
        
    }catch(ex){
        console && console.warn && (console.warn(ex) )
    }

    return data
}

function merger(prev,next){
    if( Immutable.List.isList(prev) &&  Immutable.List.isList(next)){
        return next
    }
    if(prev && prev.mergeWith){
        return prev.mergeWith(merger,next)
    }
    return next
}

function getOriginData(data){
    if(data){
        if(typeof(data.toJS )=='undefined' ){
            return Immutable.fromJS(data)
        }
    }

    return data
}

let curl = {
    del:function(data,action){
        return getOriginData(data).deleteIn(action.path)
    },
    update:function(data,action){
        data = getOriginData(getField(data,action.path) )
        if(typeof(action.data) ==='string' && action.path){
            return data.setIn(action.path,action.data)
        }
        action.data = Immutable.fromJS(action.data)
        return action.path ? data.mergeDeepIn(action.path,action.data ) : data.mergeDeep(action.data )
    },
    updateWith:function(data,action){
        data = getOriginData(data)
        if(typeof(action.data) ==='string' && action.path){
            return data.setIn(action.path,action.data)
        }
        action.data = Immutable.fromJS(action.data)
        return data.mergeWith(action.merge ? action.merge:merger,action.data )
    },
    save:function(data,action){
        data = getOriginData(getField(data,action.path) )
        return data.setIn(action.path,action.isImmutable ?Immutable.fromJS(action.data) : action.data)
    },
    insert:function(data,action){
        data = getOriginData(getField(data,action.path) )
        return data.setIn(action.path,action.isImmutable ?Immutable.fromJS(action.data) : action.data)
    },
    query:function(data){
        return data
    },
    findOne:function(data,action){
        return getOriginData(data).getIn(action.path)
    },
    find:function(data,action){
        return getOriginData(data).getIn(action.path)
    }
}

function implement(target={},modelName='',param={property:{},method:{}},fix=''){
    let property = param.property
    let method = param.method

    if(fix){
        fix+=DEFAULT_METHOD_FIX
    }
    for(let item in target){
        if(!(target[item] instanceof Function) ){
            property[item] = target[item]
        }else{
            method[`${fix}${modelName}${DEFAULT_METHOD_FIX}${item}`] = target[item].bind(target)
            //__gfs_mvc_m_actiontypes[`${fix}${modelName}${DEFAULT_METHOD_FIX}${item}`] = `${fix}${modelName}${DEFAULT_METHOD_FIX}}${item}`
        }


    }

    return {
        property:property,
        method:method
    }
}

/**
 * 一个类装饰器，被装饰的类会变成store，默认不需要额外提供对数据操作的方法，在control中默认会提供del、update、insert等数据操作方法；如果有特殊需求无法满足使用场景可按照example中给出的方式自行编写数据处理方法<br />
 * <strong style="color:red">注意：model类中`__name`属性必须要有，这是为了能在各个component正常使用model必备的一个属性,必须小写，默认会在字符串后面添加上"model",例如：`static __name='test'`,那么在实际中运用应该是this.props.testmodel</strong>
 * @method Model
 * @param target {object} 被包装的对象
 * @example
 *
 *       import {Model} from 'gfs-react-mvc'
 *       //这里由于@为文档关键符号，所以下面将以$代替
 *       //@Model
 *       $Model
         class TestModel {
            //__name必须要有，这是为了能再各个component正常使用model必备的一个属性,必须小写
            static __name = 'testmodel'
            //数据模型
            static age = 20
            static xq = {}
            //可以自行定义数据操作方法，在control中通过
            //dispatch({
            //    type:`testmodel$$save`,
            //    data:data
            //})
            //这种方式变更数据，其中type值的组成是通过：类名（全小写）+ 方法名组成
            static save(data, action){
                if(action.data){
                    return data.merge(Immutable.fromJS(action.data) )
                }
            }
            //dispatch({
            //    type:`testmodel$$del`,
            //    data:data
            //})
            static del(data, action){
                if(action.data){
                    return data.merge(Immutable.fromJS(action.data) )
                }
            }
        }
 * */
export  function Model(target){
    let params={}
    //读取字段组成新的对象
    if(typeof(target.__name) == 'undefined' ){
        console && console.warn('[create model error] ','Model中必须存在__name属性，并赋予store名称，例如: static __name="testmodel"')
        return {
            modelName:'',
            store:null
        }
    }
    let modelName = target.__name.toLowerCase()

    if(modelName.indexOf('model')<=-1){
        modelName+='model'
    }
    //取得属性或方法
    params = implement(target,modelName)
    params = implement(curl,modelName,params,DEFAULT)
    // params = implement(target.prototype,modelName,params)

    let store = createReducer(modelName, Immutable.fromJS(params.property||{} ), params.method)

    __gfs_mvc_m_list[`${modelName}`]=store

    return {
        modelName:modelName,
        store:store
    }

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


