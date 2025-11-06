# Tuner Portal

**Cognitive Co-Pilot OS for AI Chatbots**

Tuner Portal is a standalone desktop application that serves as a seamless, middle-out interface between you and any web-based AI chatbot (ChatGPT, Claude, Grok, Gemini, etc.). It's not a wrapper, not a browser extension, and not a prompt copier — it's a **cognitive cockpit** where you control, tune, and co-create with AI in real time, with zero friction between intent and execution.

## 🎯 Core Concept

The core metaphor is **a recording studio mixing board fused with a live performance stage**. On one side: the **Tuner** — dials, switches, and presets that shape the AI's behavior. On the other: the **Portal** — a live, embedded view of the chosen chatbot, responding *instantly* to every adjustment. There is no copy-paste. No tab-switching. No context loss. The system prompt is **invisibly injected and updated** behind the scenes with every change.

## ✨ Key Features

- **Zero Friction**: No manual prompt management. The system prompt is ephemeral, generative, and invisible.
- **Chatbot Agnostic**: Works with any web-based LLM. Swap from Claude to Grok with one click — all tuning persists.
- **Memory Sovereignty**: User owns what's remembered. Toggle **Full / Session / Off**. Export/import as JSON.
- **Discipline Fluidity**: Switch from **Physicist** to **Poet** to **Engineer** mid-flow — Tuner reloads expert persona on the fly.
- **Live Evolution**: Mid-conversation, drag **Creativity Slider → Wild** — next AI response shifts tone instantly.

## 🚀 Installation

### Prerequisites

- Node.js 18+ and npm
- macOS, Windows, or Linux

### Setup

1. **Install dependencies:**
   ```bash
   cd tuner-portal
   npm install
   ```

2. **Build the application:**
   ```bash
   npm run build
   ```

3. **Run in development:**
   ```bash
   npm run dev
   ```

4. **Package for distribution:**
   ```bash
   # macOS
   npm run package:mac

   # Windows
   npm run package:win

   # Linux
   npm run package:linux
   ```

## 📖 Usage

### First Launch

1. **Select a Chatbot**: Choose from the dropdown in the header (ChatGPT, Claude, Grok, Gemini, etc.)
2. **Choose a Model**: Select your AI model in Step 1 of the Tuner panel
3. **Select a Persona** (optional): Pick a persona like "Therapist", "Truth-Seeker", or "Coder" in Step 2
4. **Fine-Tune**: Adjust the 26 tuning levers in Step 3 to customize behavior
5. **Set Goal** (optional): Enter a goal like "Sci-fi world with emotional AI" to lock focus
6. **Start Chatting**: Type in the unified input bar at the bottom

### Live Tuning

- **Mid-conversation adjustments**: Change any slider, preset, or setting — the next AI response reflects the change instantly
- **No restart required**: All changes take effect immediately
- **Zero context loss**: The system prompt is automatically updated and injected before every message

### Memory Management

- **Full Memory**: Remembers all context from this conversation and previous sessions
- **Session Only**: Remembers context only from the current session
- **Off**: Treats each message independently

### Session Management

- **Save Session**: Click the 💾 button to save your current configuration
- **Load Session**: Click the 📂 button to restore a saved session
- **Auto-Load**: Last session automatically loads on app start

### Export/Import

- **Export Config**: Click 📤 to export your configuration as JSON
- **Import Config**: Click 📥 to import a previously exported configuration

## 🏗️ Architecture

### Main Process (`src/main.ts`)
- Manages Electron window and BrowserView
- Handles chatbot selection and loading
- Implements prompt injection system
- Manages session persistence

### Renderer Process (`renderer/`)
- **index.html**: Main UI structure
- **styles.css**: Modern, clean design
- **app.js**: App logic and session management
- **tuner-integration.js**: Bridges AI Tuner core with Electron
- **js/core/v6-engine.js**: AI Tuner core engine
- **js/data/**: Model, lever, and persona definitions

### Prompt Injection

The system automatically injects the generated system prompt before every message sent to the chatbot. This happens invisibly via:

1. Content script injection into the portal view
2. Fetch API interception
3. Automatic message modification to include system prompt

## 🎨 Design Principles

- **Middle-Out Control**: The human is the center. Tuner shapes the AI *around* the user, not the other way around.
- **Zero Friction**: No manual prompt management. The system prompt is ephemeral, generative, and invisible.
- **Chatbot Agnostic**: Works with any web-based LLM. Swap from Claude to Grok with one click — all tuning persists.
- **Memory Sovereignty**: User owns what's remembered. Toggle **Full / Session / Off**. Export/import as JSON.
- **Discipline Fluidity**: Switch from **Physicist** to **Poet** to **Engineer** mid-flow — Tuner reloads expert persona on the fly.

## 🔧 Development

### Project Structure

```
tuner-portal/
├── src/
│   ├── main.ts          # Electron main process
│   └── preload.ts       # Preload script (IPC bridge)
├── renderer/
│   ├── index.html       # Main UI
│   ├── styles.css       # Styles
│   ├── app.js           # App logic
│   ├── tuner-integration.js  # AI Tuner bridge
│   └── js/
│       ├── core/        # AI Tuner core
│       └── data/        # Models, levers, personas
├── dist/                # Compiled TypeScript
└── package.json
```

### Building

```bash
# Compile TypeScript
npm run build

# Watch mode (auto-rebuild)
npm run watch

# Run in development
npm run dev
```

## 📝 Notes

- **Prompt Injection**: The prompt injection system works by intercepting fetch requests and modifying message payloads. This is chatbot-specific and may require updates for different chatbot implementations.
- **Chatbot Compatibility**: Different chatbots have different API structures. The current implementation targets common patterns but may need customization for specific chatbots.
- **Security**: The app uses context isolation and does not enable node integration in renderer processes for security.

## 🎯 Roadmap

- [ ] Enhanced prompt injection for all major chatbots
- [ ] Custom chatbot URL support
- [ ] Advanced memory management with vector storage
- [ ] UI auto-tune based on user behavior
- [ ] Plugin system for custom personas and presets
- [ ] Multi-chatbot comparison mode

## 📄 License

Apache-2.0

## 🙏 Acknowledgments

Built on top of the AI Tuner v6.0 core engine.

---

**Tuner Portal: Where human intent meets AI execution — seamlessly, instantly, yours.**

