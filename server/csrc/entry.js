import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/configure_store';

const Wrapped = () => (
    <Provider store={store}>
        <StaticRouter location={new URL(window.location).pathname} context={{}}>
            <App/>
        </StaticRouter>
    </Provider>
)

ReactDOM.hydrate(<Wrapped/>,document.getElementById("appMain"));
