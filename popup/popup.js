const debugToggle = document.getElementById('debugToggle');
const toggleLabel = document.getElementById('toggleLabel');

async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

function updateTooltip(text) {
  const existingTooltip = toggleLabel.querySelector('.tooltip');
  if (existingTooltip) {
    existingTooltip.remove();
  }
  
  if (text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    toggleLabel.appendChild(tooltip);
  }
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
  
  if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
    debugToggle.disabled = true;
    debugToggle.checked = false;
    toggleLabel.classList.add('disabled');
    updateTooltip('Cannot debug browser internal pages');
    return;
  }
  
  debugToggle.disabled = false;
  toggleLabel.classList.remove('disabled');
  updateTooltip(null);
}

init();
