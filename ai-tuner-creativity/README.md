# AI Tuner Creativity™

Modular Sub-Brand for Middle-Out Creative Prompt Coaching

## Overview

AI Tuner Creativity™ is a plug-and-play TypeScript/React module that integrates with the existing AI Tuner v3.0 JavaScript core. It provides a specialized interface for creative prompt coaching with a tiered learning path.

## Features

- **3-Tier Coaching Cards**: Novice, Amateur, Advanced learning paths
- **Creative Canvas**: Three sliders for fine-tuning creativity (Depth, Voice Blend, Idea Diversity)
- **Custom Radar Chart**: Visual representation with Idea Depth, Voice Strength, and Remix Power axes
- **Integration Bridge**: Seamlessly connects with existing AI Tuner v3.0 core

## Setup

```bash
cd ai-tuner-creativity
npm install
npm run dev
```

## Structure

```
ai-tuner-creativity/
├── src/
│   ├── ai-tuner-core.ts              # Core integration layer
│   ├── ai-tuner-creativity.module.ts  # Module definition
│   ├── integration-bridge.ts          # Bridge to JS core
│   ├── components/
│   │   ├── creativity-tab.tsx        # Main tab component
│   │   └── coaching-cards.tsx         # Coaching cards UI
│   ├── canvas/
│   │   └── creativity-canvas.tsx      # Slider canvas
│   ├── radar/
│   │   └── creativity-radar.tsx       # Custom radar chart
│   └── main.tsx                        # Entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```

## Integration

The module is designed to work alongside the existing AI Tuner v3.0:

1. **Standalone Mode**: Run as a separate React app on port 3001
2. **Integration Mode**: Connects to existing `window.aiTuner` instance when available
3. **Bridge**: Automatically applies creativity sliders to core lever system

## Usage

### In Your React App

```typescript
import { AICreativityPlugin } from './ai-tuner-creativity.module';
import { AITunerCore } from './ai-tuner-core';

const plugin = new AICreativityPlugin(AITunerCore);
```

### With Existing Core

The module automatically detects and integrates with `window.aiTuner` when available.

## Development

- **Dev Server**: `npm run dev` (runs on port 3001)
- **Build**: `npm run build`
- **Preview**: `npm run preview`

## License

Apache-2.0

