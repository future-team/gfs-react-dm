import {getActionTypes} from './model'
import RTools from 'gfs-react-tools'
import './utils'

const fetch = RTools.fetch
let controlList = {}
//任意类型参数
export function Sync(anywhere){

    let url = ''
    let opts = {}
    let error = null
    //修正参数
    if(typeof(anywhere) === 'string' ){
        url = anywhere
    }else if(typeof(anywhere) ==='object' ){
        url = anywhere.url
        opts = anywhere
    }

    if(arguments.length>=2){
        opts = arguments[1]
    }
    //todo error作用域无法指向target，target对象丢失，强制制定为undefined，解决作用域丢失问题
    if(opts.error){
        error = opts.error
    }

    return function(target, name, descriptor){

        let fn = ((success = ()=>{})=>{
            let fn = success

            return function(){

                var args = Array.prototype.slice.call(arguments)

                return (dispatch)=>{
                    if(opts && typeof(opts.method) =='undefined' ){
                        opts.method = 'get'
                    }
                    fetch(url,opts).then(function(){

                        let result = fn.apply(target,Array.prototype.slice.call(arguments).concat(args) )

                        if(result && typeof(result) === 'object'){

                            dispatch({
                                type:getActionTypes(`${target.__modelName}$$${name}`),
                                data:result
                            } )
                        }
                    },error ||  target[name+'Error'] )
                }
            }


        })(descriptor.value)

        descriptor.value = fn
        descriptor.enumerable = true
        return descriptor
    }
}

export function Control(modelName,loadingbar,mock){

    if(arguments.length === 2 ){
        mock = loadingbar
        mock && (fetch.addMock(mock) )
    }

    if(arguments.length === 3){
        mock && (fetch.addMock(mock))
        loadingbar && (fetch.addLoadingBar(loadingbar) )
    }

    modelName = modelName && (modelName.toLowerCase().indexOf('model<=-1') ? modelName+'model':modelName).toLowerCase()

   return function(target){

       target.prototype.__modelName = modelName

       let control = controlList[modelName] = new target()
       //循环遍历方法，将返回
       //将方法的作用域改成对象本身
       var t = new target()
       var p ={}
       for(var item in t) {
           p[item] = t[item] instanceof Function ? t[item].bind(control ) : t[item]
       }

       return p
       //todo 解决对象私有属性访问，同样是对象丢失造成
       //return {...target.prototype}
   }
}

export function getControl(modelName){

    return controlList[modelName.toLowerCase() ]
}
