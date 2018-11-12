import express from "express";
import globby from "globby";
import ejs from "ejs";
import fs from "fs";
import util from "util";
import path from "path";


const app = express();
const publicBase = path.join(__dirname,'../','public','dist')

app.use(express.static(publicBase))


app.get('/about',function(req,res){
  fs.createReadStream(publicBase + req.url + '.html').pipe(res)

})

app.get('/something',function(req,res){
  fs.createReadStream(publicBase + req.url + '.html').pipe(res)
})

app.listen(5560, function() {
  console.log("Server started");
});

process.on("disconnect", function() {
  console.log("app disconnecting");
});

process.on("exit", function() {
  console.log("app exiting");
});
