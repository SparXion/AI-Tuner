# Tuner Portal - Quick Start Guide

## 🚀 Getting Started

### Step 1: Install Dependencies

```bash
cd tuner-portal
npm install
```

### Step 2: Build

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

### Step 3: Run

```bash
npm run dev
```

Or use the watch mode for development:

```bash
npm run watch  # In one terminal
npm run dev    # In another terminal
```

## 📋 First Use

1. **Launch the app** - You'll see the Tuner panel on the left and an empty Portal view on the right.

2. **Select a Chatbot** - Use the dropdown in the header to choose:
   - ChatGPT
   - Claude
   - Grok
   - Gemini
   - Perplexity
   - Mistral
   - Llama

3. **Choose a Model** - In Step 1 of the Tuner panel, select your AI model.

4. **Select a Persona** (optional) - In Step 2, choose a persona like:
   - Therapist
   - Truth-Seeker
   - Coder
   - Creative Writer
   - etc.

5. **Fine-Tune** - Adjust the sliders in Step 3 to customize behavior:
   - **Beginner Mode**: Shows 12 essential levers
   - **Advanced Mode**: Shows all 26 tuning levers

6. **Set Goal** (optional) - Enter a goal like "Sci-fi world with emotional AI" to lock focus.

7. **Start Chatting** - Type in the unified input bar at the bottom. The system prompt is automatically injected!

## 🎯 Key Features

### Live Tuning
- Change any slider, preset, or setting mid-conversation
- The next AI response reflects the change instantly
- No restart required

### Memory Management
- **Full Memory**: Remembers all context
- **Session Only**: Remembers only current session
- **Off**: Each message is independent

### Session Management
- Click 💾 to save your current configuration
- Click 📂 to load a saved session
- Last session auto-loads on app start

### Export/Import
- Click 📤 to export configuration as JSON
- Click 📥 to import a previously exported configuration

## 🔧 Troubleshooting

### App won't start
- Make sure you've run `npm install` and `npm run build`
- Check that Node.js 18+ is installed

### Portal view is blank
- The chatbot may require login - check the portal view
- Some chatbots may block embedded views - try a different chatbot

### Prompt injection not working
- Prompt injection works by intercepting fetch requests
- Some chatbots use different API structures
- Check the browser console in the portal view for errors

### Chatbot selector not working
- Make sure you're using a supported chatbot
- Check that the URL is correct in `src/main.ts`

## 📝 Development Notes

- The app uses Electron's BrowserView to embed chatbots
- Prompt injection happens via content script injection
- All settings are stored using electron-store
- The AI Tuner core is integrated from the existing codebase

## 🎨 Customization

### Adding a New Chatbot

Edit `src/main.ts` and add to `CHATBOT_URLS`:

```typescript
const CHATBOT_URLS = {
  // ... existing chatbots
  mychatbot: 'https://mychatbot.com'
};
```

### Customizing the UI

- Edit `renderer/styles.css` for styling
- Edit `renderer/index.html` for structure
- Edit `renderer/app.js` for behavior

## 🚢 Packaging

To create distributable packages:

```bash
# macOS
npm run package:mac

# Windows
npm run package:win

# Linux
npm run package:linux
```

Packages will be in the `release/` directory.

---

**Happy Tuning! 🎛️**

