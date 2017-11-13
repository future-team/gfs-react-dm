import {DEFAULT_METHOD_FIX,DEFAULT} from './model'
import RTools from 'gfs-react-tools'
import './utils'
import extend from 'extend'

/**
 * 控制器
 * @class Control
 * */
export const fetch = RTools.fetch
let controlList = {}
//todo 异步action和数据实现
//todo 异步ajax中间件
let curl = {
    //use:
    /**
     * 删除store中某条数据
     * @method del
     * @param path {string} 需要被删除的属性地址，根据具体的对象结构，例如一个结构为：var data={name:'test',other:{age:18}}的对象，如果想删除age的值应该是这样:this.del('data.other.age')
     * @param modelName {string} model名字，默认是绑定model之后的modelname
     * @return Function
     * @example
        $Control(TestModel)
        class TestControl {
            delTest(data,dispatch,modelJson,model){
                this.del('age')
            }
        }
     */
    del:function(path,data,modelName=this.__modelName){
        path = path.indexOf('.')>=0?path.split('.'):Array.prototype.concat.call([],path)

        return this.dispatch(
            {
                type:this.getModelName('del',true,modelName),//`${DEFAULT}${DEFAULT_METHOD_FIX}${modelName}${DEFAULT_METHOD_FIX}del`,
                path:path,
                data:data
            }
        )
    },
    /**
     * 更新store中某条数据,主要已合并为主，如果是想将新值覆盖旧值，请使用save方法
     * @method update
     * @param path {string} 需要被删除的属性地址，根据具体的对象结构，例如一个结构为：var data={name:'test',other:{age:18}}的对象，如果想修改age的值应该是这样:this.update('data.other.age',20)
     * @param data {string | objaect} 需要合并的值
     * @param modelName {string} model名字，默认是绑定model之后的modelname
     * @return Function
     * @example
        $Control(TestModel)
        class TestControl {
            updateTest(data,dispatch,modelJson,model){
                fetch('/test').then((data)=>{
                    this.update('age',data.age)
                })
            }
        }
     */
    update:function(path,data,modelName=this.__modelName){
        if(arguments.length == 1){
            data = arguments[0]
            path = ''
        }else{
            path = path.indexOf('.')>=0?path.split('.'):Array.prototype.concat.call([],path)
        }

        return this.dispatch(
            {
                type:this.getModelName('update',true,modelName),//`${DEFAULT}${DEFAULT_METHOD_FIX}${modelName}${DEFAULT_METHOD_FIX}update`,
                path:path,
                data:data
            }
        )
    },
    /**
     * 更新store中某条数据，可自定义合并规则
     * @method updateWith
     * @param data {object} 需要合并的值
     * @param merge {function} 自定义合并规则方法 
     * @param modelName {string} model名字，默认是绑定model之后的modelname
     * @return Function
     * @example
        $Control(TestModel)
        class TestControl {
            updateTest(data,dispatch,modelJson,model){
                return 
                    fetch('/test').then((data)=>{
                        this.updateWith({
                            names:['test','test1','test2']
                        },function merger(prev,next){
                            if( Immutable.List.isList(prev) &&  Immutable.List.isList(next)){
                                return next
                            }
                            if(prev && prev.mergeWith){
                                return prev.mergeWith(merger,next)
                            }
                            return next
                        }) 
                    })
                
            }
        }
     */
    updateWith:function(data,merge,modelName=this.__modelName){

        return this.dispatch(
            {
                type:this.getModelName('updateWith',true,modelName),//`${DEFAULT}${DEFAULT_METHOD_FIX}${modelName}${DEFAULT_METHOD_FIX}update`,
                merge:merge||null,
                data:data
            }
        )
    },
    /**
     * 插入store中某条数据
     * @method insert
     * @param path {string} 需要被删除的属性地址，根据具体的对象结构，例如一个结构为：var data={name:'test',other:{age:18}}的对象，如果想要在data中新增一些字段应该这样:this.insert({sex:'男'})
     * @param data {string | object} 需要保存的值，新的值会覆盖之前的值
     * @param isImmutable {boolean} 是否将值转换为Immutable类型，默认为false，如果更新的值为object类型建议设置为true
     * @param modelName {string} model名字，默认是绑定model之后的modelname
     * @return Function
     * @example
        $Control(TestModel)
        class TestControl {
            insertTest(data,dispatch,modelJson,model){
                
                fetch('/test').then((data)=>{
                    this.insert({
                        sex:'男'
                    })
                })
                
            }
        }
     */
    insert:function(path,data,isImmutable=false,modelName=this.__modelName){
        if(arguments.length == 1){
            data = arguments[0]
            path = ''
        }else{
            path = path.indexOf('.')>=0?path.split('.'):Array.prototype.concat.call([],path)
        }

        return this.dispatch(
            {
                type:this.getModelName('update',true,modelName),//`${DEFAULT}${DEFAULT_METHOD_FIX}${modelName}${DEFAULT_METHOD_FIX}update`,
                path:path,
                data:data,
                isImmutable:isImmutable
            }
        )
    },
    /**
     * 保存store中某条数据
     * @method save
     * @param path {string} 跟update一样
     * @param data {string | object} 需要保存的值，新的值会覆盖之前的值
     * @param isImmutable {boolean} 是否将值转换为Immutable类型，默认为false，如果更新的值为object类型建议设置为true
     * @param modelName {string} model名字，默认是绑定model之后的modelname
     * @return Function
     * @example
        $Control(TestModel)
        class TestControl {
            saveTest(data,dispatch,modelJson,model){
                
                fetch('/test').then((data)=>{
                    this.save('age',data.age) 
                })
                
            }
        }
     */
    save:function(path,data,isImmutable=false,modelName=this.__modelName){

        return this.dispatch(
            {
                type: this.getModelName('save',true,modelName),//`${DEFAULT}${DEFAULT_METHOD_FIX}${modelName}${DEFAULT_METHOD_FIX}save`,
                path: path.indexOf('.') >= 0 ? path.split('.') : Array.prototype.concat.call([], path),
                data: data,
                isImmutable:isImmutable
            }
        )
    }
}

//任意类型参数
/**
 * 异步操作，<strong style="color:red">IE9以下不建议使用</strong>，Sync是一个装饰器（Decorator），用于装饰Control类中的方法，将原有的方法变成一个异步成功调用后执行结果方法，被装饰的方法需要返回数据或false，决定是否更新store刷新节点。
 * - 由Sync装饰后的方法，其作用域为Control，依然可以调用类中其他方法
 * - Sync参数error可以为Control中xxxError命名的方法替代，“xxx”命名规则必须与Sync装饰的方法名一致
 * - 被装饰后的方法在View中调用时传入的参数将已第二个为准，第一个参数将永远是异步执行后的结果
 * - 被装饰的方法名要和Model类中方法名对应
 * @method Sync
 * @param anywhere {object|string} 参数为一个字符串时，anywhere为url，当方法拥有2个参数，第一个参数作为url，第二个参数为object类型
 * @param anywhere.dataType {string} 数据返回类型 默认为json
 * @param anywhere.asyn  {boolean} 是否为异步请求，默认为true
 * @param anywhere.method {string} 数据请求方式，默认为GET，可选值有：POST、GET、OPTION、DEL、PUT
 * @param anywhere.timeout {number} 请求超时时间，可选填
 * @param anywhere.credentials {object} 跨域是是否要包含cookie值，可选值：include
 * @param anywhere.error {function} 请求失败回调，可选
 * @param anywhere.header {object} 包含的请求头，可选
 * @param anywhere.body {object} 需要传递给服务端的属性字段值，可选
 * @param anywhere.cache {boolean} 请求数据是否缓存
 * @return function
 * @example
 *      import {Sync,Control} from 'gfs-react-mvc'
 *
 *      class TestControl{
 *          constructor(){}
 *          //这里由于@为文档关键符号，所以下面将以$代替
 *          $Sync('/test',{
 *              method:'get'
 *          })
 *          save(data){
 *              //此处data是异步请求后服务器返回的结果
 *              if(data){
 *                  //返回数据更新页面节点信息
 *                  return data
 *              }
 *              //不做任何改变
 *              return false
 *          } 
 *          $Sync('/del',{
 *              method:'get'
 *          })
 *          del(data){
 *              //此处data是异步请求后服务器返回的结果
 *              if(data){
 *                  //返回数据更新页面节点信息
 *                  return {
 *                      //手动指定model对应方法
 *                      type:this.getModelName('del'),
 *                      data:data
 *                  }
 *              }
 *              //不做任何改变
 *              return false
 *          }
 *          //也可直接使用
 *          $Sync()
 *          update(data){
 *              //此处data是异步请求后服务器返回的结果
 *              if(data){
 *                  //返回数据更新页面节点信息
 *                  return {
 *                      //手动指定model对应方法
 *                      type:this.getModelName('update'),
 *                      data:data
 *                  }
 *              }
 *              //不做任何改变
 *              return false
 *          }
 *      }
 * */
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
                var methodArg = args[args.length-1] || {}

                if(typeof(methodArg)==='object' && methodArg.url){
                    url = methodArg.url
                }

                return (dispatch)=>{
                    if(opts && typeof(opts.method) =='undefined' ){
                        opts.method = 'get'
                    }
                    if(url){
                        fetch(url,extend(opts,methodArg.url ||methodArg.body ?methodArg:{} ) ).then(function(){
                            let result = fn.apply(target,Array.prototype.slice.call(arguments).concat(args) )
                            if(result instanceof Function){
                                result(dispatch)
                            }else if(result && typeof(result) === 'object'){
                                dispatch(extend(result||{},{
                                    type:`${target.__modelName}${DEFAULT_METHOD_FIX}${result.type ? result.type:name}`,
                                    data:result.data? result.data : {}
                                }) )
                            }
                        },error ||  target[name+'Error'] )
                    }else{
                        let result = fn.apply(target,args )
                        if(result && typeof(result) === 'object'){
                            dispatch(extend(result||{},{
                                type:`${target.__modelName}${DEFAULT_METHOD_FIX}${result.type ? result.type:name}`,
                                data:result.data? result.data : {}
                            }) )
                        }
                    }
                }
            }


        })(descriptor.value)

        descriptor.value = fn
        descriptor.enumerable = true
        return descriptor
    }
}
/**
 * 此方法是一个装饰器，只能用于类，被装饰后的类会变成对象列表（JSON）格式，主要目的是传递给组件使用，通过redux connect连接。
 * 被装饰的类将成为一个控制器，处理异步数据逻辑或业务逻辑，将数据传递给视图或服务器
 * @method Control
 * @param modelName {object} 实体类对象
 * @param loadingbar {Loadingbar} 废弃
 * @param mock {Mock} 废弃
 * @return object
 * @example
 *      import {Sync,Control} from 'gfs-react-mvc'
 *      import TestModel from '../model/TestModel'
 *      //这里由于@为文档关键符号，所以下面将以$代替
 *      //@Control(TestModel)
 *      class TestControl{
 *          constructor(){}
 *          $action
 *          changeAge(){
 *
 *               
 *              fetch('/test.json'[,params]).then((data)=>{
 *                  //control中默认提供update、del、insert、save四种操作数据方法，会根据不同的control名生成，如下根据testControl生成的方法testControlUpdate
 *
 *                  dispatch(this.testControlUpdate('age','ajax改变的age：'+data.age) )
 *              })
 *               
 *           }
 *          //不建议使用下列方式
 *          //这里由于@为文档关键符号，所以下面将以$代替
 *          $Sync('/test',{
 *              method:'get'
 *          })
 *          $action
 *          save(data){
 *              //此处data是异步请求后服务器返回的结果
 *              if(data){
 *                  //返回数据更新页面节点信息
 *                  return data
 *              }
 *              //不做任何改变
 *              return false
 *          }
 *      }
 * */
export function Control(model={},loadingbar,mock){

    if(arguments.length === 2 ){
        RTools.addLoadingBar(loadingbar)
    }

    if(arguments.length === 3){
        RTools.addMock(mock)
    }

   return function(target){
       //target = extend(target,curl)
       //let name = ''//target.name||''
      // let control  = new target()
       //循环遍历方法，将返回
       //将方法的作用域改成对象本身
       //postmodel.toJS()
       var t = new target()
       var p ={}
       for(var item in t) {
            (function(item){
                const fnName = item
                p[fnName] = function(){
                    var args = Array.prototype.slice.call(arguments)
                    var _this = this
                    return (dispatch,store)=>{
                        let modelJson = store()[model.modelName]
                        _this.dispatch = dispatch
                        return t[fnName](...args,dispatch,modelJson && typeof(modelJson.toJS)!='undefined'?modelJson.toJS():null,modelJson||null )
                    }
                }.bind(t)
            })(item)
        // p[item] = t[item] instanceof Function ? t[item].bind(t ) : t[item]
       }
       model.controls = p
       controlList[model.modelName] = model

       for(var cItem in curl){
           target.prototype[cItem] = curl[cItem]
       }
       target.prototype.__modelName = target.__modelName = model.modelName
       /**
        * 获取model方法名全名，在未传任何值时返回方法前缀
        * @method getModelName
        * @param actionName {string} default='',方法名，可选
        * @param isDefault {boolean} 是否获取系统中提供的方法名,默认false，可选
        * @param modelName {string} model名字，可选
        * @return string
        */
        target.prototype.getModelName=target.getModelName= function(actionName='',isDefault=false,modelName = target.__modelName){
           return `${isDefault?DEFAULT+DEFAULT_METHOD_FIX:''}${modelName}${DEFAULT_METHOD_FIX}${actionName}`
       }
       return model
       //todo 解决对象私有属性访问，同样是对象丢失造成
       //return {...target.prototype}
   }
}
export function getControl(modelName){

    return controlList[modelName.toLowerCase() ]
}


