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
    return del(`public/dist/**`, cb);
  };
}

function cleanServerBuildDir(cb) {
  return del(`out/*.*`, cb);
}

function buildFrontEnd(config) {
  return function buildTheFrontEnd(cb) {
    webpack(config, function(err, stats) {
      if (err || stats.hasErrors()) {
        return cb(stats.toString());
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
      presets: ["@babel/preset-react", "@babel/preset-env"],
      plugins: [
        "@babel/plugin-syntax-dynamic-import",
        "@babel/plugin-proposal-class-properties"
      ]
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
            return callback(one.message);
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
  const renderRoute = function(route, dispatch) {
    return new Promise(function(res) {
      const App = require("./csrc/app.js").default;
      delete require.cache[require.resolve("./csrc/redux/configure_store.js")];
      const store = require("./csrc/redux/configure_store.js").default;

      function render() {
        console.log("Rendering state ", store.getState());
        const context = {};
        let WrappedApp = () => (
          <ReduxProvider store={store}>
            <StaticRouter context={context} location={route}>
              <App />
            </StaticRouter>
          </ReduxProvider>
        );
        res([renderToString(<WrappedApp />), store.getState()]);
      }

      if (dispatch.length === 0) {
        render();
      } else {
        let count = 0;
        for (let i = 0; i < dispatch.length; i++) {
          let f = dispatch[i];
          f.call(null, store.dispatch, function(err) {
            count++;
            if (count === dispatch.length) {
              render();
            }
          });
        }
      }
    });
  };
  const config = require("./src/config/config_routes");

  let routePaths = Object.keys(config).map(function(key) {
    return config[key];
  });
  let build = [];
  routePaths.forEach(({ route: routePath, dispatch }) => {
    build.push(
      renderRoute(routePath, dispatch).then(function([html, state]) {
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
              `public/dist/${routePath === "/"
                ? "index"
                : routePath}_${objectHash(
                Object.assign({}, state, { fileContents, routePath })
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
              path.join(
                __dirname,
                `public/dist/${routePath === "/" ? "index" : routePath}.html`
              ),
              compiledHtml,
              "utf8"
            );
            return Promise.all([saveStatePromise, saveCompiledHtmlPromise]);
          });
      })
    );
  });

  return Promise.all(build).catch(console.error);
}

const copyProductionFiles = copyFrontEndDistToServer("prod");
const copyDevelopmentFiles = copyFrontEndDistToServer("dev");
const cleanDistDir = cleanClientBuildDir();

export const buildFrontEndProd = buildFrontEnd(
  require("../client/webpack.prod.config.js")
);

export const buildFrontEndDev = buildFrontEnd(
  require("../client/webpack.dev.config.js")
);

export const buildServer = buildBackEnd;

export const copyClientDistProd = gulp.series(
  cleanDistDir,
  copyProductionFiles
);
export const copyClientDistDev = gulp.series(
  cleanDistDir,
  copyDevelopmentFiles
);
export const buildAndCopyClientDistProd = gulp.series(
  buildFrontEndProd,
  copyClientDistProd
);

export const buildAndCopyClientDistDev = gulp.series(
  buildFrontEndDev,
  copyClientDistDev
);

export const cleanBuild = cleanDistDir;

export const buildServerDev = gulp.parallel(
  gulp.series(
    cleanClientSrc,
    copyClientSrc,
    buildAndCopyClientDistDev,
    buildServerStatic
  ),
  gulp.series(cleanServerBuildDir, buildServer)
);

export const buildServerProd = gulp.series(cleanServerBuildDir, buildServer);

export const runServerDev = gulp.series(buildServerDev, runServerDev);

export const runServerProd = gulp.parallel(
  gulp.series(buildServerProd, runServerProd),
  gulp.series(buildAndCopyClientDistProd, buildServerStatic)
);
