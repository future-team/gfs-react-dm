import {bindingMixin} from 'gfs-react-redux-twoway-binding'
import { connect } from 'react-redux'

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

