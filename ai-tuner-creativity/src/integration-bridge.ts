/**
 * Integration Bridge - Connects TypeScript module to existing JavaScript AITunerV6 core
 * This file bridges the gap between the React/TypeScript module and the vanilla JS core
 */

import { AITunerCore } from './ai-tuner-core';
import { CreativitySliders } from './canvas/creativity-canvas';

declare global {
  interface Window {
    aiTuner?: any;
    AITunerV6?: any;
    AITunerCoreTS?: typeof AITunerCore;
  }
}

/**
 * Bridge to integrate with existing AITunerV6 JavaScript core
 */
export class IntegrationBridge {
  private jsCore: any = null;
  private coreReady: boolean = false;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    // Wait for the JavaScript core to be available
    await this.waitForCore();
    this.coreReady = true;
    console.log('Integration bridge initialized');
  }

  waitForCore(): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') {
        resolve();
        return;
      }

      // Check if core is already available
      if (window.aiTuner) {
        this.jsCore = window.aiTuner;
        resolve();
        return;
      }

      // Poll for core availability
      const checkInterval = setInterval(() => {
        if (window.aiTuner) {
          this.jsCore = window.aiTuner;
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

  /**
   * Apply creativity sliders to the core's lever system
   */
  applyCreativitySliders(sliders: CreativitySliders): void {
    if (!this.jsCore) {
      console.warn('JavaScript core not available');
      return;
    }

    // Map creativity sliders to existing levers
    if (this.jsCore.levers) {
      // Map creativityDepth to creativity lever
      if (this.jsCore.levers.creativity !== undefined) {
        this.jsCore.levers.creativity = sliders.creativityDepth;
      }

      // Map voiceBlend to adaptivityToUserTone lever
      if (this.jsCore.levers.adaptivityToUserTone !== undefined) {
        this.jsCore.levers.adaptivityToUserTone = sliders.voiceBlend;
      }

      // Map ideaDiversity to creativity (can be combined or use playfulness)
      if (this.jsCore.levers.playfulness !== undefined) {
        // Use playfulness as a proxy for idea diversity
        this.jsCore.levers.playfulness = Math.floor(sliders.ideaDiversity * 0.8);
      }

      // Update UI sliders if they exist
      this.updateUISliders();
      
      // Generate prompt with new values
      if (typeof this.jsCore.generatePrompt === 'function') {
        this.jsCore.generatePrompt();
      }
    }
  }

  /**
   * Update UI sliders in the DOM if they exist
   */
  private updateUISliders(): void {
    if (typeof document === 'undefined') return;

    // Update creativity lever slider
    const creativitySlider = document.getElementById('lever-creativity');
    if (creativitySlider && this.jsCore.levers.creativity !== undefined) {
      (creativitySlider as HTMLInputElement).value = String(this.jsCore.levers.creativity);
      const valueDisplay = document.getElementById('lever-value-creativity');
      if (valueDisplay) {
        valueDisplay.textContent = String(this.jsCore.levers.creativity);
      }
    }

    // Update adaptivity slider
    const adaptivitySlider = document.getElementById('lever-adaptivityToUserTone');
    if (adaptivitySlider && this.jsCore.levers.adaptivityToUserTone !== undefined) {
      (adaptivitySlider as HTMLInputElement).value = String(this.jsCore.levers.adaptivityToUserTone);
      const valueDisplay = document.getElementById('lever-value-adaptivityToUserTone');
      if (valueDisplay) {
        valueDisplay.textContent = String(this.jsCore.levers.adaptivityToUserTone);
      }
    }

    // Update playfulness slider
    const playfulnessSlider = document.getElementById('lever-playfulness');
    if (playfulnessSlider && this.jsCore.levers.playfulness !== undefined) {
      (playfulnessSlider as HTMLInputElement).value = String(this.jsCore.levers.playfulness);
      const valueDisplay = document.getElementById('lever-value-playfulness');
      if (valueDisplay) {
        valueDisplay.textContent = String(this.jsCore.levers.playfulness);
      }
    }
  }

  /**
   * Apply a preset from the core system
   */
  applyPreset(presetName: string): void {
    if (!this.jsCore) {
      console.warn('JavaScript core not available');
      return;
    }

    // Try to use existing preset system
    if (typeof this.jsCore.loadPreset === 'function') {
      this.jsCore.loadPreset(presetName);
    } else if (typeof window.applyPreset === 'function') {
      window.applyPreset(presetName);
    } else {
      console.warn(`Preset ${presetName} cannot be applied - core methods not available`);
    }
  }

  /**
   * Generate a prompt that includes creativity settings
   */
  generatePrompt(sliders: CreativitySliders): string {
    let prompt = 'AI Tuner Creativity™ - Creative Prompt Configuration\n\n';
    
    // Add creativity-specific settings
    prompt += 'Creative Canvas Settings:\n';
    prompt += `- Creativity Depth: ${sliders.creativityDepth}/10\n`;
    prompt += `- Voice Blend: ${sliders.voiceBlend}/10\n`;
    prompt += `- Idea Diversity: ${sliders.ideaDiversity}/10\n\n`;

    // If JS core is available, merge with its prompt
    if (this.jsCore && typeof this.jsCore.buildPrompt === 'function') {
      const corePrompt = this.jsCore.buildPrompt();
      prompt += '---\n';
      prompt += 'Core Tuner Settings:\n';
      prompt += corePrompt;
    } else {
      prompt += 'Instructions:\n';
      prompt += 'Generate creative content that explores ideas deeply, blends multiple voices, and offers diverse perspectives.\n';
      prompt += 'Adjust the depth, blend, and diversity based on the settings above.\n';
    }

    return prompt;
  }

  /**
   * Check if core is ready
   */
  isReady(): boolean {
    return this.coreReady && this.jsCore !== null;
  }

  /**
   * Get the JavaScript core instance
   */
  getCore(): any {
    return this.jsCore;
  }
}

// Export singleton instance
export const integrationBridge = new IntegrationBridge();

