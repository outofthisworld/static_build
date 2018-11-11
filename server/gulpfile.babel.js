import gulp from "gulp";
import webpack from "webpack";
import del from "delete";
import babel from "gulp-babel";
import { spawn } from "child_process";
import { finished, pipeline } from "stream";
import React from "react";
import { renderToString } from "react-dom/server";
import globby from "globby";
import ejs from "ejs";
import util from "util";
import fs from "fs";
import path from "path";
import { StaticRouter } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import objectHash from "object-hash";


function cleanClientSrc(cb) {
  return del(`csrc/**/*.*`, cb);
}

function cleanClientBuildDir() {
  return function(cb) {
    return del(`public/dist/*.*`, cb);
  };
}

function cleanServerBuildDir(cb) {
  return del(`out/*.*`, cb);
}

function buildFrontEnd(config) {
  return function buildTheFrontEnd(cb) {
    webpack(config, function(err, stats) {
      if (err || stats.hasErrors()) {
        return cb(stats.toJson());
      } else {
        return cb();
      }
    });
  };
}

function buildBackEnd(cb) {
  pipeline(
    gulp.src("src/app.js"),
    babel({
      presets: ["@babel/preset-react", "@babel/preset-env"]
    }),
    gulp.dest("out"),
    cb
  );
}

function copyClientSrc() {
  return gulp.src(`../client/src/**/*.*`).pipe(gulp.dest(`csrc`));
}

function copyFrontEndDistToServer(clientFolder) {
  return function() {
    return gulp
      .src(`../client/public/dist/${clientFolder}/*.*`)
      .pipe(gulp.dest(`public/dist/`));
  };
}

function runServerDev(callback) {
  function createProc() {
    let childProcess = spawn("node", ["out/app.js"], {
      stdio: "inherit",
      env: Object.assign({}, process.env, { NODE_ENV: "development" })
    });

    function mkEvent(eventType) {
      return function onExitOrError(one, two) {
        switch (eventType) {
          case "ERROR":
            return callback(one);
          case "EXIT":
            console.log(
              "Child process exiting with status code " +
                one +
                " with signal " +
                two
            );
            return callback();
        }
      };
    }

    childProcess.on("exit", mkEvent("EXIT"));
    childProcess.on("error", mkEvent("ERROR"));
    return childProcess;
  }

  let childProcess = createProc();
  gulp.watch("src/**/*.js", function(cb) {
    console.log("File changed detected - restarting");
    buildBackEnd(function(err) {
      if (err) {
        console.log(
          "Error building back end (syntax error?), restart terminated."
        );
        cb(err);
      } else {
        childProcess.kill();
        childProcess = createProc();
        console.log("Restarted server new pid: ", childProcess.pid);
        cb();
      }
    });
  });

  return childProcess;
}

function runServerProd() {
  return spawn("node", ["out/app.js"], {
    stdio: "inherit",
    env: Object.assign({}, process.env, { NODE_ENV: "production" })
  });
}

function buildServerStatic() {
  const renderRoute = function(route) {
    const App = require("./csrc/app.js").default;
    const store = require("./csrc/redux/configure_store.js").default;
    const context = {};
    let WrappedApp = (
      <ReduxProvider store={store}>
        <StaticRouter context={context} location={route}>
          <App />
        </StaticRouter>
      </ReduxProvider>
    );
    return [renderToString(WrappedApp), store.getState()];
  };

  let routePath = "/";
  const [html, state] = renderRoute();

  return globby(["public/dist/index.*.ejs"])
    .then(function(paths) {
      if (paths.length === 0) {
        throw new Error("Could not find applicable file");
      }
      let path = paths[0];
      return util.promisify(fs.readFile)(path, "utf8");
    })
    .then(function(fileContents) {
      let statePath = path.join(
        __dirname,
        `public/dist/${routePath === "/" ? "index" : path}_${objectHash(
          state
        )}_store.js`
      );
      const saveStatePromise = util.promisify(fs.writeFile)(
        statePath,
        `
       window.__REDUX_STATE__ = ${JSON.stringify(state)}
    `
      );
      let compiledTemplate = ejs.compile(fileContents);
      const compiledHtml = compiledTemplate({
        body: html,
        beforeScripts: [],
        afterScripts: [],
        headScripts: [`${path.basename(statePath)}`]
      });
      const saveCompiledHtmlPromise = util.promisify(fs.writeFile)(
        path.join(__dirname, "public/dist/index.html"),
        compiledHtml,
        "utf8"
      );
      return Promise.all([saveStatePromise, saveCompiledHtmlPromise]);
    });
}

const copyProductionFiles = copyFrontEndDistToServer("prod");
const copyDevelopmentFiles = copyFrontEndDistToServer("dev");
const cleanDistDir = cleanClientBuildDir();

exports["build::frontend::prod"] = buildFrontEnd(
  require("../client/webpack.prod.config.js")
);
exports["build::frontend::dev"] = buildFrontEnd(
  require("../client/webpack.dev.config.js")
);
exports["build::server"] = buildBackEnd;

exports["copy::client-dist::prod"] = gulp.series(
  cleanDistDir,
  copyProductionFiles
);
exports["copy::client-dist::dev"] = gulp.series(
  cleanDistDir,
  copyDevelopmentFiles
);
exports["build&copy::client-dist::prod"] = gulp.series(
  exports["build::frontend::prod"],
  exports["copy::client-dist::prod"]
);

exports["build&copy::client-dist::dev"] = gulp.series(
  exports["build::frontend::dev"],
  exports["copy::client-dist::dev"]
);

exports["clean::build"] = cleanDistDir;

exports["build::server::dev"] = gulp.parallel(
  gulp.series(
    cleanClientSrc,
    copyClientSrc,
    exports["build&copy::client-dist::dev"],
    buildServerStatic
  ),
  gulp.series(cleanServerBuildDir, exports["build::server"])
);

exports["build::server::prod"] = gulp.series(
  cleanServerBuildDir,
  exports["build::server"]
);

exports["run::server::dev"] = gulp.series(
  exports["build::server::dev"],
  runServerDev
);

exports["run::server::prod"] = gulp.parallel(
  gulp.series(exports["build::server::prod"], runServerProd),
  gulp.series(cleanClientSrc, copyClientSrc),
  exports["build&copy::client-dist::prod"]
);
