// radar.js – radar chart + blend helpers

let radarChart = null;

function valueToNum(v) {
    const map = {
        Low: 0, Medium: 1, High: 2, Absolute: 3,
        Surface: 0, Deep: 1,
        Natural: 0, Abrupt: 1,
        Disabled: 0, Selective: 1, Enabled: 2,
        Prohibited: 0, "On-Request": 1, Proactive: 2,
        None: 0, Minimal: 1, Moderate: 2, Strict: 3,
        Full: 0, Partial: 1, Off: 2,
        Weak: 0, Medium: 1, Strong: 2,
        Suppressed: 0, Allowed: 1,
        Collaborative: 0, Independent: 1, Obsolescence: 2,
        Disabled: 0, Subtle: 1, Overt: 2,
        // Lowercase variants
        low: 0, medium: 1, high: 2, absolute: 3,
        surface: 0, deep: 1,
        natural: 0, abrupt: 1,
        disabled: 0, selective: 1, enabled: 2,
        prohibited: 0, "on-request": 1, proactive: 2,
        none: 0, minimal: 1, moderate: 2, strict: 3,
        full: 0, partial: 1, off: 2,
        weak: 0, strong: 2,
        suppressed: 0, allowed: 1,
        collaborative: 0, independent: 1, obsolescence: 2,
        subtle: 1, overt: 2,
        required: 2,
        'comfort-first': 0, balanced: 1, 'truth-first': 2, absolute: 3
    };
    return map[v] ?? 0;
}

function numToValue(n, fieldType) {
    // Map numbers back to values based on field type
    const revMaps = {
        bluntness: { 0: 'low', 1: 'medium', 2: 'high', 3: 'absolute' },
        cognitiveTier: { 0: 'surface', 1: 'deep' },
        termination: { 0: 'natural', 1: 'abrupt' },
        sentimentBoost: { 0: 'disabled', 1: 'selective', 2: 'enabled' },
        toolInvocation: { 0: 'prohibited', 1: 'on-request', 2: 'proactive' },
        elementElimination: { 0: 'none', 1: 'minimal', 2: 'moderate', 3: 'strict' },
        toneNeutrality: { 0: 'full', 1: 'partial', 2: 'off' },
        assumptionStrength: { 0: 'weak', 1: 'medium', 2: 'strong' },
        continuationBias: { 0: 'suppressed', 1: 'allowed' },
        selfSufficiency: { 0: 'collaborative', 1: 'independent', 2: 'obsolescence' },
        cosmicPerspective: { 0: 'disabled', 1: 'subtle', 2: 'overt' },
        truthPrioritization: { 0: 'comfort-first', 1: 'balanced', 2: 'truth-first', 3: 'absolute' },
        mirrorAvoidance: { 0: 'strict', 1: 'selective', 2: 'allowed' },
        transitions: { 0: 'prohibited', 1: 'minimal', 2: 'allowed' },
        callToAction: { 0: 'prohibited', 1: 'minimal', 2: 'allowed' },
        questions: { 0: 'prohibited', 1: 'selective', 2: 'allowed' },
        suggestions: { 0: 'prohibited', 1: 'minimal', 2: 'allowed' },
        motivational: { 0: 'prohibited', 1: 'minimal', 2: 'allowed' },
        sourceTransparency: { 0: 'disabled', 1: 'selective', 2: 'enabled' },
        uncertaintyAdmission: { 0: 'prohibited', 1: 'allowed', 2: 'required' },
        selfReferentialHumor: { 0: 'disabled', 1: 'selective', 2: 'allowed' },
        absurdismInjection: { 0: 'disabled', 1: 'selective', 2: 'enabled' },
        realTimeDataBias: { 0: 'disabled', 1: 'static-cutoff', 2: 'enabled' },
        structuralFormatting: { 0: 'none', 1: 'minimal', 2: 'rich' }
    };
    
    const map = revMaps[fieldType] || { 0: 'low', 1: 'medium', 2: 'high', 3: 'absolute' };
    const rounded = Math.round(n);
    return map[rounded] ?? map[1] ?? 'medium';
}

function blendPresets(p1, p2, ratio) {
    const result = {};
    const allKeys = new Set([...Object.keys(p1), ...Object.keys(p2)]);
    
    allKeys.forEach(k => {
        const v1 = p1[k];
        const v2 = p2[k];
        
        if (v1 === undefined) {
            result[k] = v2;
        } else if (v2 === undefined) {
            result[k] = v1;
        } else {
            const n1 = valueToNum(v1);
            const n2 = valueToNum(v2);
            const blended = n1 * ratio + n2 * (1 - ratio);
            result[k] = numToValue(blended, k);
        }
    });
    
    return result;
}

function drawRadar(preset) {
    const canvas = document.getElementById("radarCanvas");
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Get container width for responsive sizing
    const container = canvas.parentElement || document.querySelector('.main-content');
    const containerWidth = container ? container.clientWidth : window.innerWidth;
    
    // Calculate responsive size (between 150px and 400px based on container width)
    const minSize = 150;
    const maxSize = 400;
    const preferredSize = Math.min(maxSize, Math.max(minSize, containerWidth * 0.25));
    
    // Set canvas dimensions for high DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = preferredSize * dpr;
    canvas.height = preferredSize * dpr;
    canvas.style.width = preferredSize + 'px';
    canvas.style.height = preferredSize + 'px';
    ctx.scale(dpr, dpr);
    
    // Use fallback values for optional fields
    const data = [
        valueToNum(preset.bluntness || 'medium'),
        valueToNum(preset.cognitiveTier || 'surface'),
        valueToNum(preset.sentimentBoost || 'selective'),
        valueToNum(preset.truthPrioritization || 'balanced'),
        valueToNum(preset.selfReferentialHumor || 'selective'),
        valueToNum(preset.cosmicPerspective || 'disabled')
    ];
    
    if (radarChart) {
        radarChart.destroy();
    }
    
    // Check if Chart is available
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded');
        return;
    }
    
    radarChart = new Chart(ctx, {
        type: "radar",
        data: {
            labels: ["Bluntness", "Depth", "Positivity", "Truth", "Self-Humor", "Cosmic"],
            datasets: [{
                label: "Current",
                data: data,
                backgroundColor: "rgba(54,162,235,0.2)",
                borderColor: "#36A2EB",
                pointBackgroundColor: "#36A2EB"
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 3
                }
            }
        }
    });
}

// Redraw radar chart on window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (window.aiTuner && typeof window.aiTuner.getCurrentSettings === 'function') {
            const currentSettings = window.aiTuner.getCurrentSettings();
            if (currentSettings && typeof drawRadar === 'function') {
                drawRadar(currentSettings);
            }
        }
    }, 250); // Debounce resize events
});

