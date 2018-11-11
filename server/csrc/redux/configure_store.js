import { createStore, combineReducers } from 'redux';


function todos(state=[],action){
    switch(action.type){
        case "ADD_TODO":
            return [...state,action.todo]
        default:
            return state;
    }
}


const store = createStore(combineReducers({ todos }), typeof window === 'undefined'? {} : (window.__REDUX_STORE__ || {}))

export default store;