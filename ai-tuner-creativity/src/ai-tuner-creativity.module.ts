/**
 * AI Tuner Creativity™ — Modular Sub-Brand
 * Middle-Out Creative Prompt Coaching
 * Plug-and-play into existing AI Tuner v3.0
 */

import { AITunerCore, ModuleConfig, CoachingCard, TabConfig } from './ai-tuner-core';

// === CONFIG: Modular Creativity Layer ===

export const CreativityModule: ModuleConfig = {
  name: 'AI Tuner Creativity™',
  version: '1.0.0',
  tagline: 'Middle-Out Creativity for Writers & Makers',
  tiers: ['Novice', 'Amateur', 'Advanced'],
  canvas: {
    enabled: true,
    defaultPreset: 'creativeSpark',
    sliders: ['creativityDepth', 'voiceBlend', 'ideaDiversity'],
  },
  coaching: {
    enabled: true,
    cards: [
      {
        tier: 'Novice',
        title: 'Your First Spark',
        prompt: 'Turn one idea into a 100-word story.',
        preset: 'creative',
        tip: 'Start small. Let the AI surprise you.',
      },
      {
        tier: 'Amateur',
        title: 'Build Your Voice',
        prompt: 'Blend two personas. Write a 3-scene outline.',
        preset: 'empathetic + witty',
        tip: 'Sliders = your tone dial.',
      },
      {
        tier: 'Advanced',
        title: 'Remix & Publish',
        prompt: 'Feed a draft back. Generate 3 variants.',
        preset: 'fullControl',
        tip: 'Iterate like a pro.',
      },
    ],
  },
  ui: {
    tab: {
      label: 'Creativity',
      icon: '✨',
      path: '/creativity',
    },
    radar: {
      axes: ['Idea Depth', 'Voice Strength', 'Remix Power'],
    },
  },
};

// === INTEGRATION: Plug into Core ===

export class AICreativityPlugin {
  constructor(private core: typeof AITunerCore) {
    this.injectModule();
  }

  private injectModule() {
    this.core.registerModule(CreativityModule);
    this.core.addTab(CreativityModule.ui.tab);
    this.core.loadCoachingCards(CreativityModule.coaching.cards);
    console.log('AI Tuner Creativity™ loaded — middle-out activated.');
  }

  getModule(): ModuleConfig {
    return CreativityModule;
  }

  getCoachingCards(): CoachingCard[] {
    return CreativityModule.coaching.cards;
  }
}

