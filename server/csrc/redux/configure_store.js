import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";

function todos(state = [], action) {
  switch (action.type) {
    case "ADD_TODO":
      return [...state, action.todo];
    default:
      return state;
  }
}

function posts(state = [], action) {
  switch (action.type) {
    case "FETCH_POSTS":
      return [...state, action.posts];
    default:
      return state;
  }
}

const store = createStore(
  combineReducers({ todos, posts }),
  typeof window === "undefined" ? {} : window.__REDUX_STORE__ || {},
  applyMiddleware(
      thunk
  )
);
export default store;
