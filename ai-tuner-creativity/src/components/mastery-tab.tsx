import React, { useState, useCallback } from 'react';
import { AITunerCore } from '../ai-tuner-core';
import { AIMasteryPlugin } from '../ai-tuner-mastery.module';

interface MasteryTabProps {
  core?: typeof AITunerCore;
  plugin?: AIMasteryPlugin;
}

export const MasteryTab: React.FC<MasteryTabProps> = ({ core, plugin }) => {
  const [selectedTier, setSelectedTier] = useState<string>('novice');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('');
  const [currentPreset, setCurrentPreset] = useState<any>(null);
  const [showToast, setShowToast] = useState<string>('');

  const tiers = ['novice', 'amateur', 'advanced'];
  const disciplines = plugin ? plugin.getAllDisciplines() : [];

  const handleTierChange = useCallback((tier: string) => {
    setSelectedTier(tier);
    // Update available disciplines for this tier
    if (plugin) {
      const tierDisciplines = plugin.getDisciplinesForTier(tier);
      if (tierDisciplines.length > 0 && !tierDisciplines.includes(selectedDiscipline)) {
        setSelectedDiscipline(tierDisciplines[0]);
      }
    }
  }, [plugin, selectedDiscipline]);

  const handleDisciplineChange = useCallback((discipline: string) => {
    setSelectedDiscipline(discipline);
    if (plugin) {
      const preset = plugin.applyPreset(selectedTier, discipline);
      if (preset) {
        setCurrentPreset(preset);
        setShowToast(`${selectedTier.toUpperCase()} ${discipline} loaded`);
        setTimeout(() => setShowToast(''), 3000);
      }
    }
  }, [plugin, selectedTier]);

  // Initialize with first discipline
  React.useEffect(() => {
    if (plugin && !selectedDiscipline) {
      const tierDisciplines = plugin.getDisciplinesForTier(selectedTier);
      if (tierDisciplines.length > 0) {
        const firstDiscipline = tierDisciplines[0];
        setSelectedDiscipline(firstDiscipline);
        const preset = plugin.applyPreset(selectedTier, firstDiscipline);
        if (preset) {
          setCurrentPreset(preset);
        }
      }
    }
  }, [plugin, selectedTier, selectedDiscipline]);

  const getTierLabel = (tier: string): string => {
    return tier.charAt(0).toUpperCase() + tier.slice(1);
  };

  const getDisciplineLabel = (discipline: string): string => {
    if (!plugin) return discipline;
    const preset = plugin.getPreset(selectedTier, discipline);
    return preset?.name || discipline;
  };

  return (
    <div
      className="mastery-tab"
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
          AI Tuner Mastery™
        </h1>
        <p
          style={{
            fontSize: '1.125rem',
            color: '#000000',
            fontStyle: 'italic',
          }}
        >
          From Novice to Mega-Expert — One Preset at a Time
        </p>
      </header>

      {/* Tier and Discipline Selectors */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem',
          marginBottom: '2rem',
        }}
      >
        <div
          style={{
            padding: '1.5rem',
            backgroundColor: '#ffffff',
            borderRadius: '0',
            border: '2px solid #000000',
          }}
        >
          <label
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              marginBottom: '0.75rem',
              display: 'block',
              color: '#000000',
            }}
          >
            Select Tier
          </label>
          <select
            value={selectedTier}
            onChange={(e) => handleTierChange(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #000000',
              borderRadius: '0',
              backgroundColor: '#ffffff',
              color: '#000000',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            {tiers.map(tier => (
              <option key={tier} value={tier}>
                {getTierLabel(tier)}
              </option>
            ))}
          </select>
        </div>

        <div
          style={{
            padding: '1.5rem',
            backgroundColor: '#ffffff',
            borderRadius: '0',
            border: '2px solid #000000',
          }}
        >
          <label
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              marginBottom: '0.75rem',
              display: 'block',
              color: '#000000',
            }}
          >
            Select Discipline
          </label>
          <select
            value={selectedDiscipline}
            onChange={(e) => handleDisciplineChange(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #000000',
              borderRadius: '0',
              backgroundColor: '#ffffff',
              color: '#000000',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            {plugin && plugin.getDisciplinesForTier(selectedTier).map(discipline => (
              <option key={discipline} value={discipline}>
                {getDisciplineLabel(discipline)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Preset Info */}
      {currentPreset && (
        <div
          style={{
            padding: '1.5rem',
            backgroundColor: '#ffffff',
            borderRadius: '0',
            border: '2px solid #000000',
            marginBottom: '2rem',
          }}
        >
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#000000' }}>
            {currentPreset.name}
          </h3>
          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#000000' }}>
              Settings:
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
              {Object.entries(currentPreset)
                .filter(([key]) => key !== 'name' && key !== 'tip')
                .map(([key, value]) => (
                  <div key={key} style={{ fontSize: '0.875rem', color: '#000000' }}>
                    <strong>{key}:</strong> {String(value)}
                  </div>
                ))}
            </div>
          </div>
          {currentPreset.tip && (
            <div
              style={{
                padding: '0.75rem',
                backgroundColor: '#000000',
                color: '#ffffff',
                borderRadius: '0',
                border: '1px solid #000000',
                fontSize: '0.875rem',
                fontStyle: 'italic',
              }}
            >
              💡 {currentPreset.tip}
            </div>
          )}
        </div>
      )}

      {/* Generated Prompt */}
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
          {generatePrompt(currentPreset, selectedTier, selectedDiscipline)}
        </pre>
        <button
          onClick={() => {
            const prompt = generatePrompt(currentPreset, selectedTier, selectedDiscipline);
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

      {/* Toast Notification */}
      {showToast && (
        <div
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            padding: '1rem 1.5rem',
            backgroundColor: '#000000',
            color: '#ffffff',
            border: '2px solid #000000',
            borderRadius: '0',
            fontSize: '1rem',
            fontWeight: 600,
            zIndex: 2000,
            animation: 'fadeInOut 3s ease-in-out',
          }}
        >
          {showToast}
        </div>
      )}
    </div>
  );
};

function generatePrompt(preset: any, tier: string, discipline: string): string {
  if (!preset) {
    return 'Select a tier and discipline to generate a prompt...';
  }

  let prompt = `AI Tuner Mastery™ - ${tier.toUpperCase()} ${discipline.toUpperCase()}\n\n`;
  prompt += `Preset: ${preset.name}\n\n`;
  prompt += 'Configuration:\n';
  prompt += '---\n';

  Object.entries(preset)
    .filter(([key]) => key !== 'name' && key !== 'tip')
    .forEach(([key, value]) => {
      prompt += `- ${key}: ${value}\n`;
    });

  prompt += '\nInstructions:\n';
  prompt += `Apply this ${tier} preset for ${discipline} work. `;
  if (preset.tip) {
    prompt += preset.tip;
  }
  prompt += '\n';

  return prompt;
}


