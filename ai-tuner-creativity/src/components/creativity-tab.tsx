import React, { useState, useCallback, useEffect } from 'react';
import { CoachingCards } from './coaching-cards';
import { CreativityCanvas, CreativitySliders } from '../canvas/creativity-canvas';
import { CreativityRadar } from '../radar/creativity-radar';
import { AITunerCore } from '../ai-tuner-core';
import { integrationBridge } from '../integration-bridge';

// Import presets from canvas
const PRESETS: Record<string, CreativitySliders> = {
  creative: {
    creativityDepth: 8,
    voiceBlend: 6,
    ideaDiversity: 7,
  },
  'empathetic + witty': {
    creativityDepth: 6,
    voiceBlend: 8,
    ideaDiversity: 5,
  },
  fullControl: {
    creativityDepth: 9,
    voiceBlend: 9,
    ideaDiversity: 9,
  },
};

interface CreativityTabProps {
  core?: typeof AITunerCore;
}

export const CreativityTab: React.FC<CreativityTabProps> = ({ core }) => {
  const [sliders, setSliders] = useState<CreativitySliders>({
    creativityDepth: 5,
    voiceBlend: 5,
    ideaDiversity: 5,
  });

  // Initialize integration bridge on mount
  useEffect(() => {
    integrationBridge.waitForCore().then(() => {
      console.log('Integration bridge ready');
    });
  }, []);

  // Clean up any extension overlays on mount
  useEffect(() => {
    const cleanupExtensions = () => {
      // Remove any extension overlays that might be injected
      const overlays = document.querySelectorAll('[style*="position: absolute"], [style*="position: fixed"]');
      overlays.forEach(el => {
        const href = el.getAttribute('href') || '';
        const text = el.textContent || '';
        // Only remove if it's clearly an extension overlay (has student/localhost or is a small red dot)
        if ((href.includes('student') || href.includes('localhost/student') || 
             text.includes('student') || 
             (el instanceof HTMLElement && el.offsetWidth < 20 && el.offsetHeight < 20 && 
              window.getComputedStyle(el).backgroundColor.includes('red')))) {
          if (!el.closest('#root')) { // Don't remove our React components
            el.remove();
          }
        }
      });
      
      // Remove any links that trigger student popups
      const studentLinks = document.querySelectorAll('a[href*="student"], a[href*="localhost/student"]');
      studentLinks.forEach(link => {
        if (!link.closest('#root')) {
          link.remove();
        }
      });
    };
    
    // Run cleanup on mount and periodically
    cleanupExtensions();
    const interval = setInterval(cleanupExtensions, 500);
    
    return () => clearInterval(interval);
  }, []);

  const handleSlidersChange = useCallback((newSliders: CreativitySliders) => {
    setSliders(newSliders);
    // Apply sliders to core if bridge is ready
    if (integrationBridge.isReady()) {
      integrationBridge.applyCreativitySliders(newSliders);
    }
  }, []);

  const handlePresetApply = useCallback((preset: string) => {
    console.log(`Applying preset: ${preset}`);
    
    // Apply preset to creativity sliders if available
    if (PRESETS[preset]) {
      const presetSliders = PRESETS[preset];
      setSliders(presetSliders);
      
      // Apply sliders to core if bridge is ready
      if (integrationBridge.isReady()) {
        integrationBridge.applyCreativitySliders(presetSliders);
      }
      
      console.log('Applied creativity preset:', presetSliders);
    } else {
      // Fallback: try to apply to JavaScript core
      if (integrationBridge.isReady()) {
        integrationBridge.applyPreset(preset);
      } else if (core) {
        core.applyPreset(preset);
      }
    }
  }, [core]);

  const handlePromptCopy = useCallback((prompt: string) => {
    navigator.clipboard.writeText(prompt).then(() => {
      console.log('Prompt copied to clipboard');
    });
  }, []);

  const getCoachingCards = () => {
    if (core) {
      return core.getCoachingCards();
    }
    // Default cards if core not available
    return [
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
    ];
  };

  return (
    <div
      className="creativity-tab"
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        backgroundColor: '#ffffff',
        color: '#000000',
        minHeight: '100vh',
      }}
    >
      <header style={{ marginBottom: '2rem' }}>
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            marginBottom: '0.5rem',
            color: '#000000',
          }}
        >
          AI Tuner Creativity™
        </h1>
        <p
          style={{
            fontSize: '1.125rem',
            color: '#000000',
            fontStyle: 'italic',
          }}
        >
          Middle-Out Creativity for Writers & Makers
        </p>
      </header>

      <div style={{ marginBottom: '3rem' }}>
        <CoachingCards
          cards={getCoachingCards()}
          onPresetApply={handlePresetApply}
          onPromptCopy={handlePromptCopy}
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <CreativityCanvas
            defaultPreset="creativeSpark"
            onSlidersChange={handleSlidersChange}
            initialValues={sliders}
          />
        </div>
        <div>
          <CreativityRadar sliders={sliders} />
        </div>
      </div>

      <div
        style={{
          padding: '1.5rem',
          backgroundColor: '#ffffff',
          borderRadius: '0',
          border: '2px solid #000000',
        }}
      >
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.75rem', color: '#000000' }}>
          Generated Prompt
        </h3>
        <pre
          style={{
            backgroundColor: '#ffffff',
            padding: '1rem',
            borderRadius: '0',
            border: '1px solid #000000',
            fontSize: '0.875rem',
            lineHeight: '1.6',
            overflow: 'auto',
            whiteSpace: 'pre-wrap',
            fontFamily: 'monospace',
            color: '#000000',
          }}
        >
          {generatePrompt(sliders)}
        </pre>
        <button
          onClick={() => {
            const prompt = generatePrompt(sliders);
            navigator.clipboard.writeText(prompt).then(() => {
              alert('Prompt copied to clipboard!');
            });
          }}
          style={{
            marginTop: '1rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#000000',
            color: '#ffffff',
            border: '2px solid #000000',
            borderRadius: '0',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 600,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff';
            e.currentTarget.style.color = '#000000';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#000000';
            e.currentTarget.style.color = '#ffffff';
          }}
        >
          Copy Prompt
        </button>
      </div>
    </div>
  );
};

function generatePrompt(sliders: CreativitySliders): string {
  // Use integration bridge if available, otherwise fallback
  if (integrationBridge.isReady()) {
    return integrationBridge.generatePrompt(sliders);
  }
  
  // Fallback prompt generation
  let prompt = 'AI Tuner Creativity™ - Creative Prompt Configuration\n\n';
  prompt += 'Creative Canvas Settings:\n';
  prompt += `- Creativity Depth: ${sliders.creativityDepth}/10 (${getDepthDescription(sliders.creativityDepth)})\n`;
  prompt += `- Voice Blend: ${sliders.voiceBlend}/10 (${getBlendDescription(sliders.voiceBlend)})\n`;
  prompt += `- Idea Diversity: ${sliders.ideaDiversity}/10 (${getDiversityDescription(sliders.ideaDiversity)})\n\n`;
  prompt += 'Instructions:\n';
  prompt += 'Generate creative content that explores ideas deeply, blends multiple voices, and offers diverse perspectives.\n';
  prompt += 'Adjust the depth, blend, and diversity based on the settings above.\n';
  return prompt;
}

function getDepthDescription(value: number): string {
  if (value <= 3) return 'Surface exploration';
  if (value <= 7) return 'Moderate depth';
  return 'Deep creative exploration';
}

function getBlendDescription(value: number): string {
  if (value <= 3) return 'Single voice';
  if (value <= 7) return 'Blended voices';
  return 'Multi-voice blend';
}

function getDiversityDescription(value: number): string {
  if (value <= 3) return 'Focused ideas';
  if (value <= 7) return 'Varied ideas';
  return 'Wide variety';
}

