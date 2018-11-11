import express from "express";
import globby from "globby";
import ejs from "ejs";
import fs from "fs";
import util from "util";
import path from "path";


const app = express();
console.log(path.join(__dirname,'../','public'))
app.use(express.static(path.join(__dirname,'../','public','dist')))
app.listen(5558, function() {
  console.log("Server started");
});

process.on("disconnect", function() {
  console.log("app disconnecting");
});

process.on("exit", function() {
  console.log("app exiting");
});
