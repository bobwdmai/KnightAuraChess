const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('KnightAuraDesktop', {
  platform: process.platform,
});
