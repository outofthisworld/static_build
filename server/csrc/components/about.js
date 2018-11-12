import React from 'react';

export default class About extends React.Component{

    state = {}

    constructor(props){
        super(props);
    }

    render(){
        console.log('made about')
        return (<p>About</p>)
    }
}