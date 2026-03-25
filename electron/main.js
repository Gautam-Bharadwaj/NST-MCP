/* global process */
import { app, BrowserWindow, ipcMain, Notification, Tray, Menu, nativeImage, shell } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import isDev from 'electron-is-dev';
import Store from 'electron-store';

// Disable security warnings during development
if (isDev) {
  process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';
}

// Services
import { handleAiRequest } from './services/ai-service.js';
import * as mcpService from './services/mcp-service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const store = new Store();

let mainWindow;
let tray;

function createTray() {
  // Simple brain-like dot for the menu bar (16x16)
  const icon = nativeImage.createFromDataURL('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAWklEQVQ4y2P8//8/Ay0BEwONAQMtzf8ZGGhuACv++P8fA42NIAbAGPD///9DDAy0NoAnA/7//98A1ID/6BpAnIAXAxkgD0A7AR+GFmBgoLkBLBkMNLeAFbMUMAAA00wa9v3G3eMAAAAASUVORK5CYII=');
  tray = new Tray(icon.resize({ width: 16, height: 16 }));
  
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Newton AI Student Assistant', enabled: false },
    { type: 'separator' },
    { label: 'Show Dashboard', click: () => mainWindow.show() },
    { label: 'Ask Newton (Quick Chat)', click: () => {
        mainWindow.show();
        mainWindow.webContents.send('nav:to', '/chat');
    }},
    { type: 'separator' },
    { label: 'Check Schedule', click: () => {
        mainWindow.show();
        mainWindow.webContents.send('nav:to', '/schedule');
    }},
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() }
  ]);

  tray.setToolTip('Newton AI Student Assistant');
  tray.setContextMenu(contextMenu);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    show: false, // Don't show immediately
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 16, y: 16 },
  });

  const url = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, '../dist/index.html')}`;

  mainWindow.loadURL(url);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
}

async function checkAssignmentsForNotifications() {
  const assignments = await mcpService.getAssignments();
  const overdue = assignments.filter((a) => a.status === 'overdue');
  
  if (overdue.length > 0 && Notification.isSupported()) {
    new Notification({
      title: 'Action Required: Assignments!',
      body: `You have ${overdue.length} overdue assignment(s). Let's handle them?`,
    }).show();
  }
}

app.whenReady().then(() => {
  createWindow();
  createTray();
  
  setTimeout(checkAssignmentsForNotifications, 5000);

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// IPC Handlers
ipcMain.handle('ai:sendQuery', async (event, query, history) => {
  return await handleAiRequest(event, query, history);
});

ipcMain.handle('mcp:getUpcomingSchedule', async () => mcpService.getUpcomingSchedule());
ipcMain.handle('mcp:getRecentLectures', async () => mcpService.getRecentLectures());
ipcMain.handle('mcp:getProgress', async () => mcpService.getSubjectProgress());
ipcMain.handle('mcp:searchDSA', async (event, topic) => mcpService.searchPracticeQuestions(topic));
ipcMain.handle('mcp:listCourses', async () => mcpService.listCourses());
ipcMain.handle('system:openSource', () => {
    shell.openPath(process.cwd());
    return true;
});

ipcMain.handle('store:get', (event, key) => store.get(key));
ipcMain.handle('store:set', (event, key, val) => {
  store.set(key, val);
  return true;
});
ipcMain.handle('store:delete', (event, key) => {
  store.delete(key);
  return true;
});
