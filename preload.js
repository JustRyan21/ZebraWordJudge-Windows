const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    query: function (query) {
        ipcRenderer.send("RequestFromView", {
            query
        });
    },
    doneWithQuery: function (callback) {
        ipcRenderer.on("DoneWithQuery", (event, args) => {
            callback(args);
        });
    }
});