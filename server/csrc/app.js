
import React from 'react'
import {Switch,Route,Link} from 'react-router-dom';
import Home from './components/home';
import About from './components/about';
import Something from './components/something';

class AsyncComponent extends React.Component{
    constructor(props){
        super(props);
        this.import = props.import;
        this.component = null;
    }

    componentDidMount(){
        this.import.then((component)=>{
            console.log('loaded component')
            console.log(component)
            this.component = component.default;
            this.forceUpdate();
        })
    }

    render(){
        let ComponentToRender = this.component;

        return (
            <React.Fragment>
                {ComponentToRender?<ComponentToRender/>:null}
            </React.Fragment>
        )
    }
}

const asyncLoad = (pathName,prom)=>(props)=>{
 console.log('loading async component ', pathName)
 return (<AsyncComponent {...props} import={prom}/>)
}

let AboutPage; 
let SomethingPage;


export default (props)=>(
    <>
        <a href={'/'}>Index</a>
        <a href={'/about'}>About</a>
        <a href={'/something'}>Something</a>
        <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/about" component={About}/>
            <Route path="/something" component={Something}/>
        </Switch>
    </>
)

