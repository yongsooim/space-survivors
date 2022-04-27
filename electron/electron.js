const path = require("path");
const { app, BrowserWindow } = require("electron");

const isDev = process.env.IS_DEV == "true" ? true : false;
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "1"; // need to check someday...
app.commandLine.appendSwitch("disable-http-cache");

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 600,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      webSecurity: true,
      allowEval: false, // This is the key!
    },
  });

  // and load the index.html of the app.
  // win.loadFile("index.html");
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../dist/index.html")}`,
    { extraHeaders: "pragma: no-cache\n" }
  );
  // Open the DevTools.
  if (isDev) {
    mainWindow.webContents.openDevTools();
  } else {
    require("electron").Menu.setApplicationMenu(null);
    webContents.reloadIgnoringCache();
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
