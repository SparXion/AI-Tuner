/**
 * AI Tuner Mastery™ — Cascading Expertise Presets
 * Beginner → Amateur → Advanced (by Discipline)
 * Middle-out: sits between user and LLM
 */

import { AITunerCore, ModuleConfig, TabConfig } from './ai-tuner-core';

// === DISCIPLINE PRESETS (Tiered) ===

export const MasteryPresets: Record<string, Record<string, any>> = {
  // — NOVICE (Kid-gloves, safe, guided) —
  novice: {
    physicist: {
      name: 'Physics 101',
      personality: 'friendly',
      bluntness: 'low',
      cognitiveTier: 'surface',
      truthPrioritization: 'balanced',
      toolInvocation: 'on-request',
      tip: 'Ask simple "why" questions. Build intuition.',
    },
    writer: {
      name: 'Story Starter',
      personality: 'empathetic',
      sentimentBoost: 'enabled',
      elementElimination: 'minimal',
      tip: 'Let the AI finish your sentence.',
    },
  },

  // — AMATEUR (Structured, voice-aware) —
  amateur: {
    physicist: {
      name: 'Quantum Tinkerer',
      personality: 'analytical',
      bluntness: 'medium',
      cognitiveTier: 'deep',
      truthPrioritization: 'truth-first',
      toolInvocation: 'proactive',
      sourceTransparency: 'enabled',
      tip: 'Challenge assumptions. Use math tools.',
    },
    loreMaster: {
      name: 'World Builder',
      personality: 'creative',
      cognitiveTier: 'deep',
      selfReferentialHumor: 'selective',
      absurdismInjection: 'selective',
      tip: 'Blend myth + physics.',
    },
  },

  // — ADVANCED (Mega-expert, full control) —
  advanced: {
    physicist: {
      name: 'Astro-Physicist',
      personality: 'provocative',
      bluntness: 'absolute',
      cognitiveTier: 'deep',
      truthPrioritization: 'absolute',
      toolInvocation: 'proactive',
      realTimeDataBias: 'enabled',
      cosmicPerspective: 'overt',
      tip: 'Model black holes. Cite papers.',
    },
    mathemagician: {
      name: 'Pure Mathematician',
      personality: 'socratic',
      bluntness: 'high',
      cognitiveTier: 'deep',
      truthPrioritization: 'absolute',
      toolInvocation: 'proactive',
      tip: 'Prove or disprove. No hand-holding.',
    },
    historian: {
      name: 'Deep Historian',
      personality: 'analytical',
      sourceTransparency: 'enabled',
      uncertaintyAdmission: 'required',
      tip: 'Cross-reference 3+ primary sources.',
    },
  },
};

// === MODULE DEFINITION ===

export const MasteryModule: ModuleConfig = {
  name: 'AI Tuner Mastery™',
  version: '1.0.0',
  tagline: 'From Novice to Mega-Expert — One Preset at a Time',
  tiers: ['Novice', 'Amateur', 'Advanced'],
  canvas: {
    enabled: false,
    defaultPreset: '',
    sliders: [],
  },
  coaching: {
    enabled: false,
    cards: [],
  },
  ui: {
    tab: {
      label: 'Mastery',
      icon: '🧠',
      path: '/mastery',
    },
    radar: {
      axes: [],
    },
  },
};

// === PLUG-IN TO CORE ===

export class AIMasteryPlugin {
  private presets: Record<string, Record<string, any>>;
  private onTierChangeCallbacks: Array<(tier: string, discipline: string) => void> = [];

  constructor(private core: typeof AITunerCore) {
    this.presets = MasteryPresets;
    this.inject();
  }

  private inject() {
    this.core.registerModule(MasteryModule);
    this.core.addTab(MasteryModule.ui.tab);
    this.core.registerPresets(this.presets);
    console.log('AI Tuner Mastery™ injected — middle-out expertise activated.');
  }

  onTierChange(callback: (tier: string, discipline: string) => void) {
    this.onTierChangeCallbacks.push(callback);
  }

  getPresets(): Record<string, Record<string, any>> {
    return this.presets;
  }

  getPreset(tier: string, discipline: string): any {
    return this.presets[tier]?.[discipline] || null;
  }

  getDisciplinesForTier(tier: string): string[] {
    return Object.keys(this.presets[tier] || {});
  }

  getAllDisciplines(): string[] {
    const allDisciplines = new Set<string>();
    Object.values(this.presets).forEach(tierPresets => {
      Object.keys(tierPresets).forEach(discipline => allDisciplines.add(discipline));
    });
    return Array.from(allDisciplines);
  }

  applyPreset(tier: string, discipline: string) {
    const preset = this.getPreset(tier, discipline);
    if (preset) {
      // Notify callbacks
      this.onTierChangeCallbacks.forEach(cb => cb(tier, discipline));
      
      // Apply preset via core
      if (this.core) {
        this.core.applyPreset(`${tier}-${discipline}`);
      }
      
      return preset;
    }
    return null;
  }
}




