const { app, BrowserWindow } = require('electron');
const path = require('path');
const { fork } = require('child_process');

let mainWindow;
let serverProcess;

// Set name explicitly to avoid any path issues
app.name = "CrowdWise AI";

// Add simple file logger to capture errors in production
const fs = require('fs');
let logFile;
function logToFile(msg) {
  try {
    if (!logFile && app.isReady()) {
      logFile = path.join(app.getPath('userData'), 'crowdwise-log.txt');
    }
    if (logFile) {
      fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${msg}\n`);
    }
    console.log(msg);
  } catch(e) {}
}

function createWindow() {
  logToFile("Creating window...");
  try {
    mainWindow = new BrowserWindow({
      width: 1280,
      height: 800,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
      },
      title: "CrowdWise AI",
      backgroundColor: '#000000',
      show: true // Show immediately
    });

    // Open DevTools immediately so we can see what's happening
    mainWindow.webContents.openDevTools();

    mainWindow.loadURL(`data:text/html;charset=utf-8,
      <body style="background:#09090b;color:white;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;">
        <div style="font-size:24px;margin-bottom:10px;">🛡️ CrowdWise AI</div>
        <div style="color:#71717a;">Initializing Command Center...</div>
        <div id="status" style="margin-top:20px;font-family:monospace;color:#4ade80;">Waiting for background server (localhost:3000)...</div>
        <div id="logs" style="margin-top:20px;font-family:monospace;color:#ef4444;font-size:12px;white-space:pre-wrap;max-width:80%;text-align:center;"></div>
      </body>
    `);

    const http = require('http');
    let attempts = 0;
    const checkServer = () => {
      attempts++;
      http.get('http://localhost:3000', (res) => {
        if (mainWindow) {
          logToFile("Server is up, loading localhost:3000");
          mainWindow.loadURL('http://localhost:3000');
        }
      }).on('error', () => {
        if (attempts % 5 === 0) logToFile(`Waiting for server (attempt ${attempts})...`);
        setTimeout(checkServer, 1000);
      });
    };
    
    // Start checking after a short delay
    setTimeout(checkServer, 1000);

    if (!app.isPackaged) {
      logToFile("Running in development mode...");
    } else {
      startProductionServer();
    }

    mainWindow.on('closed', () => {
      mainWindow = null;
      if (serverProcess) serverProcess.kill();
    });
  } catch (e) {
    logToFile("Failed to create window: " + e.message);
  }
}

function startProductionServer() {
  try {
    // When using asar, we must use the unpacked path since Node cannot execute files inside ASAR
    let rootDir = __dirname;
    if (app.isPackaged && rootDir.includes('app.asar')) {
      rootDir = rootDir.replace('app.asar', 'app.asar.unpacked');
    }
    const standaloneDir = path.join(rootDir, '.next', 'standalone');
    const serverPath = path.join(standaloneDir, 'server.js');
    
    logToFile(`Starting server at: ${serverPath}`);

    const env = { 
      ...process.env, 
      NODE_ENV: 'production',
      PORT: '3000',
      HOSTNAME: 'localhost',
      ELECTRON_RUN_AS_NODE: '1'
    };

    // Use fork instead of spawn(process.execPath) to avoid portable wrapper issues
    serverProcess = fork(serverPath, [], { 
      env,
      cwd: standaloneDir,
      stdio: 'pipe'
    });

    if (serverProcess.stdout) {
      serverProcess.stdout.on('data', (data) => logToFile(`Server: ${data}`));
    }
    if (serverProcess.stderr) {
      serverProcess.stderr.on('data', (data) => logToFile(`Server Error: ${data}`));
    }
    
    serverProcess.on('error', (err) => {
      logToFile(`Spawn Error: ${err.message}`);
    });
    
    serverProcess.on('exit', (code) => {
      logToFile(`Server process exited with code ${code}`);
    });
  } catch (e) {
    logToFile(`Failed to start server: ${e.message}`);
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  if (serverProcess) serverProcess.kill();
});
