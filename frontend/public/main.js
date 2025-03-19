const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

require('@electron/remote/main').initialize();

let backendProcess;

function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });

    //win.webContents.openDevTools();

    const jarPath = path.join(__dirname, '../../target/stickerPrinterBackend-1.0-SNAPSHOT.jar');

    // Using spawn instead of exec for better control over the process
    backendProcess = spawn('java', ['-jar', jarPath]);

    const handleBackendData = (data) => {
        console.log(`Backend: ${data}`);
        win.loadURL('http://localhost:3000');
    };

    backendProcess.stdout.on('data', handleBackendData);
    backendProcess.stderr.on('data', handleBackendData);
}

app.on('ready', createWindow);

app.on('before-quit', () => {
    if (backendProcess) {
        closeBackend();
    }
});

//backendProcess.pid

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// On OS X it's common to re-create a window in the app when the dock icon is clicked and there are no other windows open.
app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});



async function closeBackend() {
    console.log("Closing Program...");

    try {
        await fetch(`http://localhost:4567/close-backend`, {
            method: "GET",
        });

        return "Program Closed";
    }
    catch (error) {
        console.error("closeBackend - Backend did not exit properly:", error);
        throw error;
    }
}