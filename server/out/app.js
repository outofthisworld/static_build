"use strict";

var _express = _interopRequireDefault(require("express"));

var _globby = _interopRequireDefault(require("globby"));

var _ejs = _interopRequireDefault(require("ejs"));

var _fs = _interopRequireDefault(require("fs"));

var _util = _interopRequireDefault(require("util"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express.default)();

var publicBase = _path.default.join(__dirname, '../', 'public', 'dist');

app.use(_express.default.static(publicBase));
app.get('/about', function (req, res) {
  _fs.default.createReadStream(publicBase + req.url + '.html').pipe(res);
});
app.get('/something', function (req, res) {
  _fs.default.createReadStream(publicBase + req.url + '.html').pipe(res);
});
app.listen(5560, function () {
  console.log("Server started");
});
process.on("disconnect", function () {
  console.log("app disconnecting");
});
process.on("exit", function () {
  console.log("app exiting");
});