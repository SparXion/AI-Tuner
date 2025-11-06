import React, { useState, useEffect } from 'react';
import './creativity-canvas.css';

export interface CreativitySliders {
  creativityDepth: number;
  voiceBlend: number;
  ideaDiversity: number;
}

interface CreativityCanvasProps {
  defaultPreset?: string;
  onSlidersChange?: (sliders: CreativitySliders) => void;
  initialValues?: Partial<CreativitySliders>;
}

const defaultSliders: CreativitySliders = {
  creativityDepth: 5,
  voiceBlend: 5,
  ideaDiversity: 5,
};

const presets: Record<string, CreativitySliders> = {
  creativeSpark: {
    creativityDepth: 7,
    voiceBlend: 5,
    ideaDiversity: 6,
  },
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

export const CreativityCanvas: React.FC<CreativityCanvasProps> = ({
  defaultPreset,
  onSlidersChange,
  initialValues,
}) => {
  const [sliders, setSliders] = useState<CreativitySliders>(() => {
    if (initialValues) {
      return { ...defaultSliders, ...initialValues };
    }
    if (defaultPreset && presets[defaultPreset]) {
      return presets[defaultPreset];
    }
    return defaultSliders;
  });
  const [selectedInfo, setSelectedInfo] = useState<string | null>(null);

  // Update sliders when initialValues change
  useEffect(() => {
    if (initialValues) {
      setSliders(prev => {
        const newSliders = { ...defaultSliders, ...initialValues };
        // Only update if values actually changed
        if (JSON.stringify(prev) !== JSON.stringify(newSliders)) {
          return newSliders;
        }
        return prev;
      });
    }
  }, [initialValues]);

  useEffect(() => {
    if (onSlidersChange) {
      onSlidersChange(sliders);
    }
  }, [sliders, onSlidersChange]);

  const handleSliderChange = (key: keyof CreativitySliders, value: number) => {
    const newSliders = { ...sliders, [key]: value };
    setSliders(newSliders);
  };

  const sliderConfig = {
    creativityDepth: {
      label: 'Creativity Depth',
      description: 'How deeply the AI explores creative ideas',
      low: 'Surface ideas',
      high: 'Deep exploration',
      info: 'Controls how deeply the AI explores and develops creative concepts. Low values produce quick, surface-level ideas. High values encourage deep, layered exploration with multiple angles and perspectives.',
    },
    voiceBlend: {
      label: 'Voice Blend',
      description: 'How much the AI blends different writing styles',
      low: 'Single voice',
      high: 'Multi-voice blend',
      info: 'Determines how the AI mixes different writing styles and tones. Low values keep a consistent, single voice. High values blend multiple personas, creating a richer, more varied writing style.',
    },
    ideaDiversity: {
      label: 'Idea Diversity',
      description: 'How varied the generated ideas are',
      low: 'Focused ideas',
      high: 'Wide variety',
      info: 'Controls the range and variety of ideas generated. Low values produce focused, similar ideas. High values generate diverse, varied ideas across different approaches and styles.',
    },
  };

  const handleInfoClick = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedInfo(selectedInfo === key ? null : key);
  };

  const handleCloseInfo = () => {
    setSelectedInfo(null);
  };

  return (
    <div className="creativity-canvas" style={{ padding: '1.5rem', backgroundColor: '#ffffff', borderRadius: '0', border: '2px solid #000000' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', color: '#000000' }}>
        Creative Canvas
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {(Object.keys(sliderConfig) as Array<keyof CreativitySliders>).map((key) => {
          const config = sliderConfig[key];
          const value = sliders[key];

          return (
            <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.25rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label
                    data-gramm="false"
                    data-gramm_editor="false"
                    data-enable-grammarly="false"
                    style={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: '#000000',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    {config.label}
                  </label>
                  <button
                    onClick={(e) => handleInfoClick(key, e)}
                    className="info-btn-creativity"
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: '1px solid #000000',
                      backgroundColor: '#ffffff',
                      color: '#000000',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: 0,
                      lineHeight: 1,
                      position: 'relative',
                      zIndex: 2,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#000000';
                      e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                      e.currentTarget.style.color = '#000000';
                    }}
                  >
                    ℹ
                  </button>
                </div>
                <span
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#000000',
                  }}
                >
                  {value}
                </span>
              </div>
              <p
                style={{
                  fontSize: '0.875rem',
                  color: '#000000',
                  marginBottom: '0.5rem',
                }}
              >
                {config.description}
              </p>
              <input
                type="range"
                min="0"
                max="10"
                value={value}
                onChange={(e) => handleSliderChange(key, parseInt(e.target.value))}
                data-gramm="false"
                data-gramm_editor="false"
                data-enable-grammarly="false"
                style={{
                  width: '100%',
                  height: '8px',
                  borderRadius: '0',
                  background: '#000000',
                  outline: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  zIndex: 1,
                }}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.75rem',
                  color: '#000000',
                }}
              >
                <span>{config.low}</span>
                <span>{config.high}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: '#ffffff',
          borderRadius: '0',
          border: '1px solid #000000',
          fontSize: '0.875rem',
          color: '#000000',
        }}
      >
        <strong>Tip:</strong> Adjust these sliders to fine-tune your creative output. The radar chart
        will update in real-time.
      </div>

      {/* Info Overlay */}
      {selectedInfo && (
        <div
          className="info-overlay-creativity"
          onClick={handleCloseInfo}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              border: '2px solid #000000',
              borderRadius: '0',
              padding: '2rem',
              maxWidth: '500px',
              width: '90%',
              position: 'relative',
            }}
          >
            <button
              onClick={handleCloseInfo}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: '2px solid #000000',
                borderRadius: '0',
                width: '30px',
                height: '30px',
                cursor: 'pointer',
                fontSize: '1.5rem',
                lineHeight: 1,
                color: '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#000000';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.color = '#000000';
              }}
            >
              ×
            </button>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#000000' }}>
              {sliderConfig[selectedInfo as keyof typeof sliderConfig]?.label}
            </h3>
            <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#000000' }}>
              {sliderConfig[selectedInfo as keyof typeof sliderConfig]?.info}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

