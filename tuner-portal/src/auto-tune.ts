/**
 * Auto-Tune Context Detection System
 * Dual-mode cognitive engine that reads user intent and adapts the Tuner
 */

export interface AutoTuneDetection {
  discipline: string;
  confidence: number;
  suggestedPreset: string;
  suggestedPersona: string;
  suggestedLevers: Record<string, number>;
}

export interface DisciplinePattern {
  keywords: string[];
  discipline: string;
  preset: string;
  persona: string;
  levers: Record<string, number>;
}

// Discipline detection patterns
const DISCIPLINE_PATTERNS: DisciplinePattern[] = [
  {
    keywords: ['quantum', 'physics', 'relativity', 'particle', 'wave', 'electron', 'photon', 'atom', 'nucleus'],
    discipline: 'Physics',
    preset: 'Advanced Physicist',
    persona: 'researcher',
    levers: {
      technicality: 9,
      citationRigidity: 8,
      teachingMode: 7,
      creativity: 3,
      formality: 8
    }
  },
  {
    keywords: ['poem', 'poetry', 'verse', 'stanza', 'rhyme', 'meter', 'sonnet', 'haiku', 'lyric'],
    discipline: 'Poetry',
    preset: 'Creative Writer',
    persona: 'creative-writer',
    levers: {
      creativity: 9,
      playfulness: 7,
      formality: 2,
      structuralDensity: 3,
      conciseness: 6
    }
  },
  {
    keywords: ['code', 'function', 'variable', 'algorithm', 'debug', 'syntax', 'api', 'class', 'method', 'programming'],
    discipline: 'Programming',
    preset: 'Coder',
    persona: 'coder',
    levers: {
      technicality: 10,
      conciseness: 8,
      structuralDensity: 9,
      responseDirectness: 9,
      teachingMode: 6
    }
  },
  {
    keywords: ['story', 'narrative', 'character', 'plot', 'scene', 'dialogue', 'fiction', 'novel', 'chapter'],
    discipline: 'Creative Writing',
    preset: 'Creative Writer',
    persona: 'creative-writer',
    levers: {
      creativity: 9,
      empathyExpressiveness: 8,
      playfulness: 6,
      structuralDensity: 4,
      answerCompleteness: 8
    }
  },
  {
    keywords: ['research', 'study', 'analysis', 'data', 'hypothesis', 'experiment', 'methodology', 'findings'],
    discipline: 'Research',
    preset: 'Truth-Seeker',
    persona: 'truth-seeker',
    levers: {
      citationRigidity: 10,
      hedgingIntensity: 5,
      transparency: 9,
      technicality: 7,
      formality: 8
    }
  },
  {
    keywords: ['therapy', 'counseling', 'mental health', 'emotion', 'feel', 'anxiety', 'depression', 'support'],
    discipline: 'Therapy',
    preset: 'Therapist',
    persona: 'therapist',
    levers: {
      empathyExpressiveness: 9,
      proactivityLevel: 7,
      affirmationFrequency: 8,
      formality: 3,
      teachingMode: 2
    }
  },
  {
    keywords: ['business', 'strategy', 'marketing', 'revenue', 'profit', 'customer', 'product', 'market'],
    discipline: 'Business',
    preset: 'Business Analyst',
    persona: 'researcher',
    levers: {
      formality: 8,
      structuralDensity: 8,
      conciseness: 7,
      assertiveness: 8,
      technicality: 6
    }
  },
  {
    keywords: ['math', 'equation', 'calculate', 'formula', 'algebra', 'calculus', 'geometry', 'theorem'],
    discipline: 'Mathematics',
    preset: 'Mathematician',
    persona: 'researcher',
    levers: {
      technicality: 10,
      structuralDensity: 9,
      citationRigidity: 7,
      formality: 8,
      conciseness: 7
    }
  },
  {
    keywords: ['sci-fi', 'science fiction', 'futuristic', 'space', 'alien', 'dystopia', 'cyberpunk', 'speculative'],
    discipline: 'Science Fiction',
    preset: 'Creative Writer',
    persona: 'creative-writer',
    levers: {
      creativity: 10,
      playfulness: 7,
      structuralDensity: 5,
      answerCompleteness: 9,
      empathyExpressiveness: 7
    }
  },
  {
    keywords: ['philosophy', 'ethics', 'morality', 'existential', 'metaphysics', 'epistemology', 'logic'],
    discipline: 'Philosophy',
    preset: 'Truth-Seeker',
    persona: 'truth-seeker',
    levers: {
      transparency: 9,
      hedgingIntensity: 6,
      teachingMode: 8,
      formality: 7,
      creativity: 6
    }
  }
];

export class AutoTuneEngine {
  private mode: 'auto' | 'manual' = 'auto';
  private detectionHistory: AutoTuneDetection[] = [];

  /**
   * Detect discipline from user input
   */
  detectContext(input: string): AutoTuneDetection | null {
    if (!input || input.trim().length === 0) {
      return null;
    }

    // Get first 3-5 words
    const words = input.toLowerCase().trim().split(/\s+/).slice(0, 5);
    const inputLower = input.toLowerCase();

    let bestMatch: DisciplinePattern | null = null;
    let bestScore = 0;

    // Score each pattern
    for (const pattern of DISCIPLINE_PATTERNS) {
      let score = 0;
      let matches = 0;

      for (const keyword of pattern.keywords) {
        if (inputLower.includes(keyword)) {
          matches++;
          // Early position keywords get higher weight
          const position = inputLower.indexOf(keyword);
          const positionWeight = position < 20 ? 2 : 1;
          score += positionWeight;
        }
      }

      // Calculate confidence based on matches
      const confidence = Math.min(matches / pattern.keywords.length, 1);
      score *= confidence;

      if (score > bestScore) {
        bestScore = score;
        bestMatch = pattern;
      }
    }

    if (!bestMatch || bestScore < 0.3) {
      return null; // Low confidence, don't suggest
    }

    const confidence = Math.min(bestScore / 5, 1); // Normalize to 0-1

    const detection: AutoTuneDetection = {
      discipline: bestMatch.discipline,
      confidence,
      suggestedPreset: bestMatch.preset,
      suggestedPersona: bestMatch.persona,
      suggestedLevers: { ...bestMatch.levers }
    };

    // Store in history (ephemeral, not persisted)
    this.detectionHistory.push(detection);
    if (this.detectionHistory.length > 10) {
      this.detectionHistory.shift(); // Keep last 10
    }

    return detection;
  }

  /**
   * Get mode
   */
  getMode(): 'auto' | 'manual' {
    return this.mode;
  }

  /**
   * Set mode
   */
  setMode(mode: 'auto' | 'manual'): void {
    this.mode = mode;
  }

  /**
   * Get detection history (ephemeral)
   */
  getDetectionHistory(): AutoTuneDetection[] {
    return [...this.detectionHistory];
  }

  /**
   * Clear detection history
   */
  clearHistory(): void {
    this.detectionHistory = [];
  }
}

// Export singleton instance
export const autoTuneEngine = new AutoTuneEngine();

