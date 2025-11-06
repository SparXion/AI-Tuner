import React, { useState } from 'react';
import { CoachingCard } from '../ai-tuner-core';

interface CoachingCardsProps {
  cards: CoachingCard[];
  onPresetApply?: (preset: string) => void;
  onPromptCopy?: (prompt: string) => void;
}

export const CoachingCards: React.FC<CoachingCardsProps> = ({
  cards,
  onPresetApply,
  onPromptCopy,
}) => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const handleCardClick = (card: CoachingCard) => {
    setSelectedCard(selectedCard === card.tier ? null : card.tier);
    if (onPresetApply && card.preset) {
      onPresetApply(card.preset);
    }
  };

  const handlePromptCopy = (prompt: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPromptCopy) {
      onPromptCopy(prompt);
    } else {
      navigator.clipboard.writeText(prompt).then(() => {
        alert('Prompt copied to clipboard!');
      });
    }
  };

  const tierColors = {
    Novice: { bg: '#ffffff', border: '#000000', text: '#000000' },
    Amateur: { bg: '#ffffff', border: '#000000', text: '#000000' },
    Advanced: { bg: '#000000', border: '#000000', text: '#ffffff' },
  };

  return (
    <div className="coaching-cards-container" style={{ marginBottom: '2rem' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 600, color: '#000000' }}>
        Creative Coaching Path
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {cards.map((card) => {
          const colors = tierColors[card.tier as keyof typeof tierColors] || tierColors.Novice;
          const isSelected = selectedCard === card.tier;

          return (
            <div
              key={card.tier}
              onClick={() => handleCardClick(card)}
                style={{
                  border: `2px solid ${colors.border}`,
                  borderRadius: '0',
                  padding: '1.5rem',
                  backgroundColor: colors.bg,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  transform: isSelected ? 'scale(1.01)' : 'scale(1)',
                  boxShadow: isSelected ? '4px 4px 0 0 #000000' : '2px 2px 0 0 #000000',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  minHeight: '280px',
                }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.75rem',
                }}
              >
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: colors.text,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {card.tier}
                </span>
                {isSelected && (
                  <span style={{ fontSize: '1.2rem', color: colors.text }}>✓</span>
                )}
              </div>

              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                  color: colors.text,
                }}
              >
                {card.title}
              </h3>

              <p
                style={{
                  fontSize: '0.95rem',
                  color: colors.text,
                  marginBottom: '1rem',
                  lineHeight: '1.5',
                  flex: '1',
                  minHeight: '60px',
                }}
              >
                {card.prompt}
              </p>

              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  flexWrap: 'wrap',
                  marginTop: 'auto',
                  paddingTop: '1rem',
                }}
              >
                <button
                  onClick={(e) => handlePromptCopy(card.prompt, e)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: colors.bg === '#000000' ? colors.text : colors.border,
                    color: colors.bg === '#000000' ? colors.border : colors.bg,
                    border: `2px solid ${colors.border}`,
                    borderRadius: '0',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                  onMouseEnter={(e) => {
                    if (colors.bg === '#ffffff') {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                      e.currentTarget.style.color = '#000000';
                    } else {
                      e.currentTarget.style.backgroundColor = '#000000';
                      e.currentTarget.style.color = '#ffffff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.bg === '#000000' ? colors.text : colors.border;
                    e.currentTarget.style.color = colors.bg === '#000000' ? colors.border : colors.bg;
                  }}
                >
                  Copy Prompt
                </button>
                {card.preset && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onPresetApply) {
                        onPresetApply(card.preset);
                      }
                    }}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: colors.bg,
                      color: colors.text,
                      border: `2px solid ${colors.bg === '#000000' ? colors.text : colors.border}`,
                      borderRadius: '0',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                    }}
                    onMouseEnter={(e) => {
                      if (colors.bg === '#ffffff') {
                        e.currentTarget.style.backgroundColor = '#000000';
                        e.currentTarget.style.color = '#ffffff';
                        e.currentTarget.style.border = '2px solid #000000';
                      } else {
                        e.currentTarget.style.backgroundColor = '#ffffff';
                        e.currentTarget.style.color = '#000000';
                        e.currentTarget.style.border = '2px solid #ffffff';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = colors.bg;
                      e.currentTarget.style.color = colors.text;
                      e.currentTarget.style.border = `2px solid ${colors.bg === '#000000' ? colors.text : colors.border}`;
                    }}
                  >
                    Apply Preset
                  </button>
                )}
              </div>

              {isSelected && (
                <div
                  style={{
                    marginTop: '1rem',
                    padding: '0.75rem',
                    backgroundColor: colors.bg === '#000000' ? '#ffffff' : '#000000',
                    borderRadius: '0',
                    border: '1px solid #000000',
                    fontSize: '0.875rem',
                    color: colors.bg === '#000000' ? '#000000' : '#ffffff',
                    fontStyle: 'italic',
                  }}
                >
                  {card.tip}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

