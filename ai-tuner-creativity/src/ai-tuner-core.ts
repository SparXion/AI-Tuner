/**
 * AI Tuner Core - Integration Layer
 * Wraps existing AITunerV6 JavaScript core to provide TypeScript interface
 */

export interface TabConfig {
  label: string;
  icon: string;
  path: string;
}

export interface CoachingCard {
  tier: string;
  title: string;
  prompt: string;
  preset: string;
  tip: string;
}

export interface ModuleConfig {
  name: string;
  version: string;
  tagline: string;
  tiers: string[];
  canvas: {
    enabled: boolean;
    defaultPreset: string;
    sliders: string[];
  };
  coaching: {
    enabled: boolean;
    cards: CoachingCard[];
  };
  ui: {
    tab: TabConfig;
    radar: {
      axes: string[];
    };
  };
}

export interface AITunerCore {
  registerModule(module: ModuleConfig): void;
  addTab(tab: TabConfig): void;
  loadCoachingCards(cards: CoachingCard[]): void;
  registerPresets(presets: Record<string, Record<string, any>>): void;
  generatePrompt(): string;
  getCurrentSettings(): any;
  applyPreset(presetName: string): void;
}

/**
 * Core wrapper that interfaces with existing JavaScript AITunerV6
 */
export class AITunerCoreImpl implements AITunerCore {
  private modules: Map<string, ModuleConfig> = new Map();
  private tabs: TabConfig[] = [];
  private coachingCards: CoachingCard[] = [];
  private presets: Map<string, Record<string, any>> = new Map();
  private jsCore: any; // Reference to window.AITunerV6 instance

  constructor() {
    // Wait for DOM and existing core to be available
    if (typeof window !== 'undefined') {
      // Access the global AITunerV6 instance if available
      this.jsCore = (window as any).aiTuner;
      
      // Also expose our core instance globally for integration
      (window as any).AITunerCoreTS = this;
    }
  }

  // Method to wait for JS core to be available
  waitForCore(): Promise<void> {
    return new Promise((resolve) => {
      if (this.jsCore) {
        resolve();
        return;
      }
      
      // Poll for core availability
      const checkInterval = setInterval(() => {
        this.jsCore = (window as any).aiTuner;
        if (this.jsCore) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
      
      // Timeout after 5 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        resolve();
      }, 5000);
    });
  }

  registerModule(module: ModuleConfig): void {
    this.modules.set(module.name, module);
    console.log(`Registered module: ${module.name}`);
  }

  addTab(tab: TabConfig): void {
    this.tabs.push(tab);
    console.log(`Added tab: ${tab.label}`);
  }

  loadCoachingCards(cards: CoachingCard[]): void {
    this.coachingCards = [...this.coachingCards, ...cards];
    console.log(`Loaded ${cards.length} coaching cards`);
  }

  registerPresets(presets: Record<string, Record<string, any>>): void {
    Object.keys(presets).forEach(tier => {
      this.presets.set(tier, presets[tier]);
    });
    console.log(`Registered presets for ${Object.keys(presets).length} tiers`);
  }

  generatePrompt(): string {
    if (this.jsCore && typeof this.jsCore.buildPrompt === 'function') {
      return this.jsCore.buildPrompt();
    }
    // Fallback prompt generation
    return this.generateFallbackPrompt();
  }

  getCurrentSettings(): any {
    if (this.jsCore && typeof this.jsCore.getCurrentSettings === 'function') {
      return this.jsCore.getCurrentSettings();
    }
    return {};
  }

  applyPreset(presetName: string): void {
    if (this.jsCore && typeof this.jsCore.loadPreset === 'function') {
      this.jsCore.loadPreset(presetName);
    } else {
      console.warn(`Preset ${presetName} not found or core not available`);
    }
  }

  private generateFallbackPrompt(): string {
    let prompt = 'AI Tuner Creativity™ - Creative Prompt Coaching\n\n';
    prompt += 'This is a creativity-focused prompt module.\n';
    prompt += 'Adjust sliders to customize creative output.\n';
    return prompt;
  }

  getModules(): ModuleConfig[] {
    return Array.from(this.modules.values());
  }

  getTabs(): TabConfig[] {
    return this.tabs;
  }

  getCoachingCards(): CoachingCard[] {
    return this.coachingCards;
  }
}

// Export singleton instance
export const AITunerCore = new AITunerCoreImpl();

