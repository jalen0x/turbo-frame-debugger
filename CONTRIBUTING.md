# Contributing to Turbo Frame Debugger

Thank you for your interest in contributing! This document provides guidelines and instructions for development.

## Development Setup

### Prerequisites

- Chrome/Chromium browser
- ImageMagick (for icon generation)
- Git

### Getting Started

1. Fork and clone the repository
   ```bash
   git clone https://github.com/YOUR_USERNAME/turbo-frame-debugger.git
   cd turbo-frame-debugger
   ```

2. Load the extension in Chrome
   - Open `chrome://extensions/`
   - Enable **Developer mode**
   - Click **Load unpacked**
   - Select the `turbo-frame-debugger` folder

## Development Workflow

### Making Changes

1. Create a new branch for your feature/fix
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes to the code

3. Test your changes
   - Go to `chrome://extensions/`
   - Click the reload button (🔄) on the extension card
   - Test on a page with Turbo Frames

4. Commit your changes
   ```bash
   git add .
   git commit -m "Add: your feature description"
   ```

## Testing

### Manual Testing

1. Load the extension in Chrome
2. Visit a page with Turbo Frames (or create a test page)
3. Click the extension icon and toggle debug mode
4. Verify:
   - Red borders appear around `<turbo-frame>` elements
   - Frame attributes are displayed correctly
   - Console logs show frame information
   - Dark mode works properly

### Test Page

You can create a simple test page:

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module">
    import { Turbo } from "https://cdn.skypack.dev/@hotwired/turbo";
  </script>
</head>
<body>
  <turbo-frame id="test-frame" src="/test">
    <h1>Test Frame</h1>
  </turbo-frame>
</body>
</html>
```

## Code Style

- Use clear, descriptive variable names
- Add comments for complex logic
- Follow existing code patterns
- Keep functions focused and small

## Submitting Changes

1. Push your branch to GitHub
   ```bash
   git push origin feature/your-feature-name
   ```

2. Create a Pull Request
   - Provide a clear description of the changes
   - Reference any related issues
   - Include screenshots if UI changes are involved

3. Wait for review
   - Address any feedback
   - Make requested changes in new commits

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
├── icons/               # Extension icons (16, 32, 48, 128px)
└── promo/               # Promotional images for Chrome Web Store
```

## Key Files

- **manifest.json**: Extension configuration and permissions
- **background.js**: Handles script registration/unregistration
- **popup/popup.js**: Controls the debug toggle and stats display
- **scripts/injected.js**: Detects and logs Turbo Frames
- **styles/debug.css**: Provides visual debugging styles

## Debugging Tips

### Service Worker Debugging

- Go to `chrome://extensions/`
- Click "Inspect views: service worker" under your extension
- Check console for background script errors

### Content Script Debugging

- Open DevTools on the page you're debugging
- Injected script logs will appear in the console
- Look for messages prefixed with "🔍 Turbo Frame Debugger"

### Common Issues

**Changes not appearing?**
- Make sure to reload the extension at `chrome://extensions/`
- Clear browser cache if CSS changes aren't showing

**Script injection failing?**
- Check background.js console for errors
- Verify the page isn't restricted (e.g., chrome:// URLs)

## Questions?

Feel free to open an issue for any questions or concerns!
