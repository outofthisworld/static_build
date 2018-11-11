"use strict";

var _express = _interopRequireDefault(require("express"));

var _globby = _interopRequireDefault(require("globby"));

var _ejs = _interopRequireDefault(require("ejs"));

var _fs = _interopRequireDefault(require("fs"));

var _util = _interopRequireDefault(require("util"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express.default)();
console.log(_path.default.join(__dirname, '../', 'public'));
app.use(_express.default.static(_path.default.join(__dirname, '../', 'public', 'dist')));
app.listen(5558, function () {
  console.log("Server started");
});
process.on("disconnect", function () {
  console.log("app disconnecting");
});
process.on("exit", function () {
  console.log("app exiting");
});