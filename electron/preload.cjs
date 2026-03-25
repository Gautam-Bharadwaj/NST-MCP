const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  sendQuery: (query, history) => ipcRenderer.invoke('ai:sendQuery', query, history),
  getUpcomingSchedule: () => ipcRenderer.invoke('mcp:getUpcomingSchedule'),
  getRecentLectures: () => ipcRenderer.invoke('mcp:getRecentLectures'),
  getProgress: () => ipcRenderer.invoke('mcp:getProgress'),
  searchDSA: (topic) => ipcRenderer.invoke('mcp:searchDSA', topic),
  listCourses: () => ipcRenderer.invoke('mcp:listCourses'),
  storeGet: (key) => ipcRenderer.invoke('store:get', key),
  storeSet: (key, val) => ipcRenderer.invoke('store:set', key, val),
  storeDelete: (key) => ipcRenderer.invoke('store:delete', key),
  openSourceFolder: () => ipcRenderer.invoke('system:openSource'),
  onReplyChunk: (callback) => {
    ipcRenderer.removeAllListeners('ai:reply-chunk');
    ipcRenderer.on('ai:reply-chunk', callback);
  },
});
