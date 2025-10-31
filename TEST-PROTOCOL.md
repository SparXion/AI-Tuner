# AI Tuner Web App Test Protocol

## Overview
This document describes the test protocol for the AI Tuner web application. The test suite validates core functionality, UI components, and user interactions.

## Test Files

### Primary Test File
- **`test-web-app.html`** - Comprehensive browser-based test suite
  - Loads `script.js` directly
  - Tests 15+ functionality areas
  - Auto-runs on page load
  - Visual pass/fail indicators

### Test Runner Script
- **`run-tests.sh`** - Bash script to start test server and open browser
  - Starts HTTP server on port 8000
  - Opens test file automatically
  - Handles server lifecycle

## Running the Tests

### Method 1: Using Test Runner (Recommended)
```bash
./run-tests.sh
```
This will:
- Start a local HTTP server on port 8000
- Open the test file in your default browser
- Keep the server running until you press Ctrl+C

### Method 2: Manual Server
```bash
# Start server
python3 -m http.server 8000

# In another terminal or browser, open:
# http://localhost:8000/test-web-app.html
```

### Method 3: Direct File (Limited)
Simply open `test-web-app.html` in your browser (some tests may fail due to CORS restrictions when loading script.js)

## Test Coverage

The test suite validates the following areas:

### 1. Initialization & Structure
- ✅ AITuner class availability
- ✅ Form elements existence
- ✅ Preset buttons presence

### 2. Core Functionality
- ✅ Prompt generation
- ✅ Preset application
- ✅ Setting change triggers
- ✅ Grok query preset detection

### 3. Data Management
- ✅ Custom preset save/load
- ✅ Custom preset rendering
- ✅ localStorage functionality

### 4. UI Components
- ✅ Copy button
- ✅ Download buttons (JSON/Markdown)
- ✅ Info buttons
- ✅ Claude dropdown menu
- ✅ Factory Reset preset

### 5. Prompt Quality
- ✅ Prompt structure validation
- ✅ All sections present (Personality, Cognition, Affect, Interface, Behavioral, Goals)

## Test Output

### Visual Indicators
- **Green (✅)** - Test passed
- **Red (❌)** - Test failed with error message

### Summary Statistics
- Total tests run
- Passed count
- Failed count
- Success rate percentage

## Adding New Tests

To add a new test, add to the `runAllTests()` function in `test-web-app.html`:

```javascript
// Test N: Description
try {
    // Test logic here
    if (condition) {
        logTest('Test Name', true, 'Success message');
    } else {
        logTest('Test Name', false, 'Failure reason');
    }
} catch (e) {
    logTest('Test Name', false, `Error: ${e.message}`);
}
```

## Troubleshooting

### Tests Failing to Load
- Ensure `script.js` is in the same directory
- Check browser console for JavaScript errors
- Verify local server is running (not using `file://` protocol)

### Element Not Found Errors
- Check that `index.html` structure matches expected IDs
- Verify HTML elements exist before tests run
- Add delays if needed: `await new Promise(resolve => setTimeout(resolve, 100));`

### Preset Tests Failing
- Verify preset names match between HTML (`data-preset` attributes) and JavaScript (`presets` object)
- Check that preset buttons have correct event listeners
- Ensure `applyPreset()` function works correctly

## Integration with CI/CD

To integrate into automated testing:

1. **Headless Browser Testing**: Use Puppeteer or Playwright
   ```javascript
   const browser = await puppeteer.launch();
   const page = await browser.newPage();
   await page.goto('http://localhost:8000/test-web-app.html');
   // Wait for tests to complete
   // Extract results
   ```

2. **Node.js Testing**: Extract test logic to separate JS file
   - Can be run with Node.js + jsdom
   - Better for CI/CD pipelines

3. **Visual Regression**: Add screenshot comparisons
   - Capture before/after states
   - Compare prompt output formats

## Test Data

### Preset Names (Current)
- `absolute` - Absolute Mode
- `friendly` - Friendly Assistant
- `analytical` - Analytical Expert
- `minimal` - Minimal Responder
- `creative` - Creative Collaborator
- `coding` - Coding Assistant
- `standard` - Standard Reset
- `factoryReset` - Factory Default

### AI Reset Presets
- Claude dropdown (claudeReset, claudeOpusReset, claudeSonnetReset, claudeHaikuReset)
- `geminiReset`, `geminiProReset`, `geminiUltraReset`, `geminiNanoReset`
- `chatgptReset`, `gpt4Reset`, `gpt35Reset`
- `grokReset`, `grokQueryDefaults`
- `cursorAgentReset`

## Future Enhancements

### Planned Test Additions
- [ ] Download functionality (verify file content)
- [ ] Upload functionality (test file parsing)
- [ ] Cross-browser compatibility
- [ ] Performance benchmarks
- [ ] Accessibility tests (ARIA labels, keyboard navigation)
- [ ] Mobile responsiveness

### Test Automation
- [ ] Nightly regression tests
- [ ] Pre-commit validation
- [ ] GitHub Actions integration
- [ ] Coverage reporting

## Maintenance

### When to Update Tests
- After adding new features
- When preset names change
- When HTML structure changes
- When new form controls are added
- After refactoring core functions

### Version History
- **v1.0** (2025-01-16): Initial test suite with 15 core tests
  - Basic functionality validation
  - UI component checks
  - Preset functionality
  - Custom preset management

## Contact & Documentation

For questions about the test protocol or to report issues:
- Review test output in browser console
- Check browser DevTools for detailed errors
- Verify all dependencies are loaded correctly

---

**Last Updated**: 2025-01-16
**Test Suite Version**: 1.0
