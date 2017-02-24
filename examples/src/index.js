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
            console.dir('del')
            return data.merge(Immutable.fromJS(action.data) )
        }
    }
}

class TestAction{
    constructor(){}
    showTest(){
        console.dir('testaction')
    }
}
let action = new TestAction()


@Control(TestModel)
class TestControl {
    //Object.defineProperty(target, key, descriptor);
    @Sync('/test.json',{
        error:(err)=>{
            console.dir(err)
        }
    })
    static saveTest(data,c){
        //this.getChange()('age', 10)


        return this.testControlUpdate('age','ajax改变的age：'+data.age)

        /*data.age = 'ajax改变的age：'+data.age
        action.showTest()
        return {
            type:'save',
            data:data
        }*/
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
            this.props.saveTest(this)
            this.props.testControlInsert({
                name:'xiaomin'
            })
        },1000)

    }

    static defaultProps={}

    render() {

        console.log('age:',this.props.testmodel.get('age') )
        return (
            <div>
                {this.props.testmodel.get('age')}
                <span style={{color:'red'}}>{this.props.testmodel.get('name')}</span>
            </div>
        )
    }
}

page(TestComponent)

