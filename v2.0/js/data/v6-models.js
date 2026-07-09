/**
 * AI Tuner - Model Definitions (public)
 *
 * Neutral default lever values. Calibrated profiles are in the private
 * AI-Tuner-Methodology repo (ai-tuner-legacy-calibrated/).
 */

const NEUTRAL_V6_DEFAULTS = {
    hedgingIntensity: 5,
    structuralDensity: 5,
    playfulInjection: 5,
    redirectStrictness: 5,
    selfReferenceLock: 5,
    answerCompleteness: 5,
    mathFormality: 5,
    empathyExpressiveness: 5,
    proactivityLevel: 5,
    formality: 5,
    citationRigidity: 5,
    conciseness: 5,
    teachingMode: 5,
    transparency: 5,
    creativity: 5,
    affirmationFrequency: 5,
    metaCommentary: 5,
    responseDirectness: 5,
    certaintyModulation: 5,
    assertiveness: 5,
    adaptivityToUserTone: 5,
    safetyDisclaimers: 5,
    speedOptimization: 5,
    markdownStructure: 5,
    strictFormatting: 5,
    technicality: 5,
    toolAutonomy: 5
};

window.MODELS_V6 = window.AI_MODELS_V6 = {
    grok: {
        name: 'Grok (xAI)',
        description: 'General assistant',
        defaults: { ...NEUTRAL_V6_DEFAULTS }
    },
    gemini: {
        name: 'Gemini (Google)',
        description: 'General assistant',
        defaults: { ...NEUTRAL_V6_DEFAULTS }
    },
    claude: {
        name: 'Claude (Anthropic)',
        description: 'General assistant',
        defaults: { ...NEUTRAL_V6_DEFAULTS }
    },
    chatgpt: {
        name: 'ChatGPT (OpenAI)',
        description: 'General assistant',
        defaults: { ...NEUTRAL_V6_DEFAULTS }
    },
    perplexity: {
        name: 'Perplexity (Perplexity AI)',
        description: 'Research assistant',
        defaults: { ...NEUTRAL_V6_DEFAULTS }
    },
    mistral: {
        name: 'Mistral (Mistral AI)',
        description: 'General assistant',
        defaults: { ...NEUTRAL_V6_DEFAULTS }
    },
    llama: {
        name: 'Llama 3.1 (Meta)',
        description: 'General assistant',
        defaults: { ...NEUTRAL_V6_DEFAULTS }
    }
};
