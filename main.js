const {app, BrowserWindow} = require('electron');
const path = require('path');
const { ipcMain } = require('electron');
const sqlite3 = require('sqlite3');

ipcMain.on('asynchronous-message', (event, arg) => {
    const sql = arg;
    database.all(sql, (err, rows) => {
        event.reply('asynchronous-reply', (err && err.message) || rows);
    });
});

const database = new sqlite3.Database(path.resolve(__dirname, 'database.db'), {fileMustExist: true}, (err) => {
    if (err) console.error('Database opening error: ', err);
});

function createWindow() {
    const win = new BrowserWindow({
        width: 1080,
        height: 720,
        backgroundColor: 'white',
        webPreferences: {
            nodeIntegration: true,
            worldSafeExecuteJavaScript: true,
            contextIsolation: false,
            enableRemoteModule: true,
            //preload: path.join(__dirname, "preload.js")
        }
    })

    win.loadFile(path.join(__dirname + "/index.html"));
}

app.whenReady().then(createWindow);

// // This is called when requested from the view
// ipcMain.on("RequestFromView", (event, args) => {

//     (async () => {

//         // Open sqlite3 database
//         const db = await open({
//             filename: path.join(__dirname, "./database.sqlite3"),
//             driver: sqlite3.Database
//         });

//         const queryResult = await db.get(args.query);
//     })();

//     // send back to the renderer process that we are complete
//     if (typeof win !== "undefined" && win !== null) {
//         win.webContents.send("DoneWithQuery", {
//             myResult: true
//         });
//     }
// });


const ignoreDB = /database|[/\\]\./
//require('electron-reload')(__dirname, {
//    electron: path.join(__dirname, 'node_modules', '.bin', 'electron'), 
//    ignored: [ignoreDB]
//});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

module.exports = {
  webpackFinal: async (config) => {

    // Replaces the webpack rule that loads SVGs as static files to leave out SVG files for us to handle
    const indexOfRuleToRemove = config.module.rules.findIndex(rule => rule.test.toString().includes('svg'))
    config.module.rules.splice(indexOfRuleToRemove, 1, {
      test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/,
      loader: require.resolve('file-loader'),
      options: {
        name: 'static/media/[name].[hash:8].[ext]',
        esModule: false
      }
    })

    config.module.rules.push(
      {
        test: /.svg$/,
        use: ['@svgr/webpack'],
      },

    )
    return config
  },
}