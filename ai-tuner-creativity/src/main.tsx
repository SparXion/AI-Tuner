import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { CreativityTab } from './components/creativity-tab';
import { MasteryTab } from './components/mastery-tab';
import { AICreativityPlugin } from './ai-tuner-creativity.module';
import { AIMasteryPlugin } from './ai-tuner-mastery.module';
import { AITunerCore } from './ai-tuner-core';
import './index.css';

// Initialize the Plugins
const creativityPlugin = new AICreativityPlugin(AITunerCore);
const masteryPlugin = new AIMasteryPlugin(AITunerCore);

// Root component
const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'creativity' | 'mastery'>('creativity');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Tab Navigation */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: '#ffffff',
          borderBottom: '2px solid #000000',
          padding: '1rem 2rem',
          display: 'flex',
          gap: '1rem',
          zIndex: 100,
        }}
      >
        <button
          onClick={() => setActiveTab('creativity')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: activeTab === 'creativity' ? '#000000' : '#ffffff',
            color: activeTab === 'creativity' ? '#ffffff' : '#000000',
            border: '2px solid #000000',
            borderRadius: '0',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 600,
          }}
        >
          ✨ Creativity
        </button>
        <button
          onClick={() => setActiveTab('mastery')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: activeTab === 'mastery' ? '#000000' : '#ffffff',
            color: activeTab === 'mastery' ? '#ffffff' : '#000000',
            border: '2px solid #000000',
            borderRadius: '0',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 600,
          }}
        >
          🧠 Mastery
        </button>
      </div>

      {/* Tab Content */}
      <div style={{ marginTop: '80px' }}>
        {activeTab === 'creativity' && <CreativityTab core={AITunerCore} />}
        {activeTab === 'mastery' && <MasteryTab core={AITunerCore} plugin={masteryPlugin} />}
      </div>
    </div>
  );
};

// Render the app
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('Root element not found');
}

