import {bindingMixin} from 'gfs-react-redux-twoway-binding'
import { connect } from 'react-redux'
/**
 * 视图
 * @class View
 * */
/**
 * 一个装饰器方法，用于装饰类，被装饰的类为页面视图，或者说是react的component，并不是每一个component都需要被装饰
 * @method View
 * @param action {object} control对象
 * @return class
 * @example
 *
 *       import {View} from 'gfs-react-mvc'
 *       import TestControl from './TestControl'
 *       //这里由于@为文档关键符号，所以下面将以$代替
 *       //@View(TestControl)
 *       $View(TestControl)
         class TestComponent extends Component {
            constructor(props) {
                super(props)
            }

            componentDidMount(){
                setTimeout(()=>{
                    //调用control中的action
                    this.props.save(this)
                },1000)
            }

            static defaultProps={}

            render() {
                console.log('age:',this.props.testmodel.get('age') )
                return (
                    <div>
                        {this.props.testmodel.get('age')}
                    </div>
                )
            }
        }
 * */
export  function View(action){

    return function(target){

        @connect(state => ({
            [`${action.__modelName.split('$$')[0].toLowerCase()}`]: state[action.__modelName]
        }), action)
        @bindingMixin
        class View extends target{
            constructor(props) {
                super(props)
                this.setBinding(action.__modelName )
            }
        }

        return View
    }
}

