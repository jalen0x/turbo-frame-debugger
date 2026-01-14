# Turbo Frame Debugger

A Chrome extension that visualizes [Turbo Frame](https://turbo.hotwired.dev/handbook/frames) boundaries and attributes for easier debugging.

## Features

- 🔍 **Visual Debugging**: Shows red dashed borders around all Turbo Frames
- 📊 **Attribute Display**: Displays frame ID, src, loading, and target attributes
- 🌓 **Dark Mode Support**: Adapts to your browser's color scheme
- ⚡ **Zero Refresh**: Toggle debug mode without reloading the page
- 🔄 **Persistent**: Once enabled, works across all tabs and page navigations
- 📝 **Console Logging**: Logs frame details and detects dynamically added frames

## Installation

### Chrome Web Store

Coming soon...

### Manual Installation

1. Download or clone this repository
   ```bash
   git clone https://github.com/paicha/turbo-frame-debugger.git
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable **Developer mode** (toggle in top right)

4. Click **Load unpacked** and select the `turbo-frame-debugger` folder

5. The extension icon should appear in your toolbar

## Usage

1. Click the extension icon in your Chrome toolbar
2. Toggle the switch to enable debug mode
3. Visit any page with Turbo Frames - red borders will appear automatically!

### What You'll See

When debug mode is enabled, each Turbo Frame displays:

```
┌─────────────────────────────────────────────────────────┐
│ Frame #content src=/api/data loading=lazy target=_top  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                  (Frame content)                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Console Output

The extension logs frame information to the browser console:

```
🔍 Turbo Frame Debugger: Found 3 frame(s)
  Frame 1: { id: 'content', src: '/api/data', loading: 'eager', target: '(self)' }
  Frame 2: { id: 'modal', src: '', loading: 'lazy', target: '_top' }
  Frame 3: { id: 'sidebar', src: '/widgets', loading: 'eager', target: '(self)' }
```

## How It Works

This extension uses Chrome's `chrome.scripting.registerContentScripts` API to dynamically register content scripts:

- **Persistence**: Debug mode survives page navigations and browser restarts
- **No flashing**: CSS is injected at `document_start`, before the page renders
- **Reliability**: Works even when the service worker is suspended

## Project Structure

```
turbo-frame-debugger/
├── manifest.json        # Extension configuration (Manifest V3)
├── background.js        # Service worker for script registration
├── popup/               # Extension popup UI
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
├── scripts/
│   └── injected.js      # Content script for frame detection
├── styles/
│   └── debug.css        # Debug visualization styles
└── icons/               # Extension icons (16, 32, 48, 128px)
```

## Browser Compatibility

- ✅ Chrome 102+
- ✅ Edge 102+
- ✅ Brave (latest)
- ✅ Any Chromium-based browser supporting Manifest V3

## Troubleshooting

**Debug borders not showing?**
- Make sure the toggle is ON in the popup
- Verify the page has `<turbo-frame>` elements
- Try reloading the page after enabling

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE)

## Related

- [Turbo Handbook - Frames](https://turbo.hotwired.dev/handbook/frames)
- [Hotwire](https://hotwired.dev/)
