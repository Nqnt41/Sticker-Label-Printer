const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const remoteMain = require('@electron/remote/main');

remoteMain.initialize();

let backendProcess;

let win;

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 1250,
        height: 750,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        },
    });

    remoteMain.enable(win.webContents);
}

function runBackend() {
    const jarPath = app.isPackaged
        ? path.join(process.resourcesPath, 'backend/stickerPrinterBackend.jar')
        : path.join(__dirname, '../../target/stickerPrinterBackend-1.0-SNAPSHOT.jar');

    try {
        backendProcess = spawn('java', ['-jar', jarPath]);

        backendProcess.stdout.on('data', runFrontend);
        backendProcess.stderr.on('data', runFrontend);
    }
    catch (e) {
        console.error("MAIN.JS - runBackend: Error in running backend:", jarPath, err)
    }
}

function runFrontend() {
    const startUrl = app.isPackaged
        ? `file://${path.join(__dirname, '../build/index.html')}`
        : 'http://localhost:3000';

    win.loadURL(startUrl).catch((err) => {
        console.error('MAIN.JS - runFrontend: Failed to load URL:', startUrl, err);
    });
}

app.whenReady().then(() => {
    createWindow();
    if (!app.isPackaged) {
        win.webContents.openDevTools();
    }

    runBackend();
});

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