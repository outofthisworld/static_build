(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{26:function(e,t,n){"use strict";n.r(t);var o=n(0),r=n.n(o),a=n(10),c=n.n(a),u=n(28),i=n(29),l=function(){return r.a.createElement("p",null,"Home")};function f(e){return(f="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function p(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function m(e){return(m=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function b(e,t){return(b=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function s(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var y=function(e){function t(e){var n;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t,n){t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n}(s(s(n=function(e,t){return!t||"object"!==f(t)&&"function"!=typeof t?s(e):t}(this,m(t).call(this,e)))),"state",{}),n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&b(e,t)}(t,r.a.Component),function(e,t,n){t&&p(e.prototype,t),n&&p(e,n)}(t,[{key:"render",value:function(){return console.log("made about"),r.a.createElement("p",null,"About")}}]),t}(),h=function(){return console.log("made something"),r.a.createElement("p",null,"Something")};var d=function(e){return r.a.createElement(r.a.Fragment,null,r.a.createElement("a",{href:"/"},"Index"),r.a.createElement("a",{href:"/about"},"About"),r.a.createElement("a",{href:"/something"},"Something"),r.a.createElement(u.a,null,r.a.createElement(i.a,{exact:!0,path:"/",component:l}),r.a.createElement(i.a,{path:"/about",component:y}),r.a.createElement(i.a,{path:"/something",component:h})))},w=n(27),E=n(14),g=n(5);function O(e){return function(e){if(Array.isArray(e)){for(var t=0,n=new Array(e.length);t<e.length;t++)n[t]=e[t];return n}}(e)||function(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}var v=Object(g.c)(Object(g.b)({todos:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"ADD_TODO":return O(e).concat([t.todo]);default:return e}}}),"undefined"==typeof window?{}:window.__REDUX_STORE__||{});c.a.hydrate(r.a.createElement(function(){return r.a.createElement(E.a,{store:v},r.a.createElement(w.a,{location:new URL(window.location).pathname,context:{}},r.a.createElement(d,null)))},null),document.getElementById("appMain"))}},[[26,1,2]]]);