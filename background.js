const SCRIPT_ID = 'turbo-frame-debugger';

chrome.runtime.onInstalled.addListener(async () => {
  const { debugEnabled } = await chrome.storage.sync.get(['debugEnabled']);
  if (debugEnabled) {
    await registerDebugScripts();
  }
});

chrome.runtime.onStartup.addListener(async () => {
  const { debugEnabled } = await chrome.storage.sync.get(['debugEnabled']);
  if (debugEnabled) {
    await registerDebugScripts();
  }
});

chrome.storage.onChanged.addListener(async (changes, namespace) => {
  if (namespace !== 'sync' || !changes.debugEnabled) return;
  
  if (changes.debugEnabled.newValue) {
    await registerDebugScripts();
  } else {
    await unregisterDebugScripts();
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'enable') {
    registerDebugScripts()
      .then(() => sendResponse({ success: true }))
      .catch(err => sendResponse({ success: false, error: err.message }));
    return true;
  } else if (message.action === 'disable') {
    unregisterDebugScripts()
      .then(() => sendResponse({ success: true }))
      .catch(err => sendResponse({ success: false, error: err.message }));
    return true;
  }
});

async function registerDebugScripts() {
  try {
    await chrome.scripting.unregisterContentScripts({ ids: [SCRIPT_ID] });
  } catch (e) {
    if (!e.message?.includes('No content scripts') && 
        !e.message?.includes('not registered')) {
      console.warn('Turbo Frame Debugger: Unexpected error during unregister:', e);
    }
  }
  
  await chrome.scripting.registerContentScripts([{
    id: SCRIPT_ID,
    matches: ['<all_urls>'],
    css: ['styles/debug.css'],
    js: ['scripts/injected.js'],
    runAt: 'document_start',
    persistAcrossSessions: true
  }]);
  
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) continue;
    try {
      await chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ['styles/debug.css']
      });
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['scripts/injected.js']
      });
    } catch (e) {
      if (e.message?.includes('Cannot access') || 
          e.message?.includes('restricted') ||
          e.message?.includes('extension cannot')) {
        return;
      }
      console.warn('Turbo Frame Debugger: Failed to inject into tab', tab.id, ':', e);
    }
  }
}

async function unregisterDebugScripts() {
  try {
    await chrome.scripting.unregisterContentScripts({ ids: [SCRIPT_ID] });
  } catch (e) {
    if (!e.message?.includes('No content scripts') && 
        !e.message?.includes('not registered')) {
      console.warn('Turbo Frame Debugger: Unexpected error during unregister:', e);
    }
  }
  
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) continue;
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          document.documentElement.removeAttribute('data-turbo-frame-debug');
          console.log('🔍 Turbo Frame Debugger: Disabled');
        }
      });
      await chrome.scripting.removeCSS({
        target: { tabId: tab.id },
        files: ['styles/debug.css']
      });
    } catch (e) {
      if (e.message?.includes('Cannot access') || 
          e.message?.includes('restricted') ||
          e.message?.includes('extension cannot')) {
        return;
      }
      console.warn('Turbo Frame Debugger: Failed to clean up tab', tab.id, ':', e);
    }
  }
}
