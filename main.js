const {app, BrowserWindow} = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        backgroundColor: 'white',
        webPreferences: {
            nodeIntegration: false,
            worldSafeExecuteJavaScript: true,
            contextIsolation: true
        }
    })

    // win.loadURL('http://localhost:3000');
    win.loadFile('./public/index.html');
}

app.whenReady().then(createWindow);

require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
});

// app.on('window-all-closed', function () {
//     if (process.platform !== 'darwin') {
//         app.quit();
//     }
// });



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