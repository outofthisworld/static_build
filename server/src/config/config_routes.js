
export const Home = {
    route:'/',
    dispatch:[
        function fetchPosts(dispatch,done){
            console.log('fetch users thunk')
            setTimeout(function(){
                dispatch({type:'FETCH_POSTS',posts:[{body:'hello message'}]})
                done();
            },0)
            return 'some thunk return'
        }
    ]
}


export const About = {
    route:'/about',
    dispatch:[
    ]
}


export const Something = {
    route:'/something',
    dispatch:[
    ]
}