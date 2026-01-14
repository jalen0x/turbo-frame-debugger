if (!window._turboFrameDebuggerInitialized) {
  window._turboFrameDebuggerInitialized = true;
  
  const root = document.documentElement;
  root.setAttribute('data-turbo-frame-debug', '1');
  
  function logFrames() {
    const frames = document.querySelectorAll('turbo-frame');
    if (frames.length > 0) {
      console.log(`🔍 Turbo Frame Debugger: Found ${frames.length} frame(s)`);
      frames.forEach((frame, index) => {
        console.log(`  Frame ${index + 1}:`, {
          id: frame.id || '(no id)',
          src: frame.getAttribute('src') || '(no src)',
          loading: frame.getAttribute('loading') || '(eager)',
          target: frame.getAttribute('target') || '(self)'
        });
      });
    }
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', logFrames);
  } else {
    logFrames();
  }
  
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeName === 'TURBO-FRAME') {
          console.log('🔍 New Turbo Frame detected:', {
            id: node.id || '(no id)',
            src: node.getAttribute('src') || '(no src)',
            loading: node.getAttribute('loading') || '(eager)',
            target: node.getAttribute('target') || '(self)'
          });
        }
      });
    });
  });
  
  observer.observe(document.documentElement, { childList: true, subtree: true });
} else {
  document.documentElement.setAttribute('data-turbo-frame-debug', '1');
}
