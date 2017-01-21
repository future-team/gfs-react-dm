import {Model,Control,Sync,View,page} from '../../src/index.js'
import Immutable from 'immutable'

@Model
class TestModel {

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

@Control('test')
class TestControl {

    constructor(){
        this.classNames = 'testcontrol'

    }
    //Object.defineProperty(target, key, descriptor);
    @Sync('/test.json',{
        error:(err)=>{
            console.dir(err)
        }
    })
    save(data,c){
        //this.getChange()('age', 10)

        setTimeout(()=>{
            c.manualChange('age','通过manualChange改变age：10')
        },2000)
        data.age = 'ajax改变的age：'+data.age
        return data
    }
    del(data){

        return data
    }
}


import React, { Component /*,PropTypes*/} from 'react'


@View(TestControl)
class TestComponent extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount(){
        setTimeout(()=>{
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

page(TestComponent)

