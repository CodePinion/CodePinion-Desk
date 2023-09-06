const path = require('path');
const {app,BrowserWindow} = require('electron');

// Create the main window
function createMainWindow () {
  const mainWin = new BrowserWindow({
    title : 'CodePinion Desk',
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // Load the index.html of the app
  mainWin.loadFile(path.join(__dirname, './Renderer/main.html'))

  // Open the DevTools.
  mainWin.webContents.openDevTools()
}

// Call the createMainWindow function when the app is ready
app.whenReady().then(() => {
  createMainWindow();
});