const debugToggle = document.getElementById('debugToggle');
const statsDiv = document.getElementById('stats');

async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

async function init() {
  const result = await chrome.storage.sync.get(['debugEnabled']);
  debugToggle.checked = result.debugEnabled || false;
  await updateStats();
}

debugToggle.addEventListener('change', async function() {
  const enabled = debugToggle.checked;
  await chrome.storage.sync.set({ debugEnabled: enabled });
  
  try {
    const response = await chrome.runtime.sendMessage({ 
      action: enabled ? 'enable' : 'disable' 
    });
    if (response?.success) {
      await updateStats();
    }
  } catch (e) {
    console.error('Failed to communicate with background:', e);
    await updateStats();
  }
});

async function updateStats() {
  const tab = await getCurrentTab();
  
  if (!tab.url || tab.url.startsWith('chrome://')) {
    statsDiv.classList.remove('active');
    statsDiv.innerHTML = '<p class="stats-text">Cannot debug this page</p>';
    return;
  }
  
  if (debugToggle.checked) {
    try {
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => document.querySelectorAll('turbo-frame').length
      });
      const count = results[0]?.result || 0;
      statsDiv.classList.add('active');
      statsDiv.innerHTML = `<p class="stats-text">✓ Found ${count} Turbo Frame(s)</p>`;
    } catch (e) {
      statsDiv.classList.add('active');
      statsDiv.innerHTML = '<p class="stats-text">✓ Debug enabled (reload to apply)</p>';
    }
  } else {
    statsDiv.classList.remove('active');
    statsDiv.innerHTML = '<p class="stats-text">Debug mode disabled</p>';
  }
}

init();
