import React, { useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { CreativitySliders } from '../canvas/creativity-canvas';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface CreativityRadarProps {
  sliders: CreativitySliders;
  axes?: string[];
}

export const CreativityRadar: React.FC<CreativityRadarProps> = ({
  sliders,
  axes = ['Idea Depth', 'Voice Strength', 'Remix Power'],
}) => {
  // Map slider values to radar axes
  // creativityDepth -> Idea Depth
  // voiceBlend -> Voice Strength
  // ideaDiversity -> Remix Power

  const data = {
    labels: axes,
    datasets: [
      {
        label: 'Creative Profile',
        data: [
          sliders.creativityDepth, // Idea Depth
          sliders.voiceBlend,      // Voice Strength
          sliders.ideaDiversity,   // Remix Power
        ],
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderColor: '#000000',
        borderWidth: 2,
        pointBackgroundColor: '#000000',
        pointBorderColor: '#ffffff',
        pointHoverBackgroundColor: '#ffffff',
        pointHoverBorderColor: '#000000',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        max: 10,
        ticks: {
          stepSize: 2,
          showLabelBackdrop: false,
          color: '#000000',
        },
        pointLabels: {
          font: {
            size: 14,
            weight: 'bold' as const,
          },
          color: '#000000',
        },
        grid: {
          color: '#000000',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${context.parsed.r}/10`;
          },
        },
      },
    },
  };

  return (
    <div
      className="creativity-radar"
      style={{
        padding: '1.5rem',
        backgroundColor: '#ffffff',
        borderRadius: '0',
        border: '2px solid #000000',
        minHeight: '400px',
      }}
    >
      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#000000' }}>
        Creative Radar
      </h3>
      <div style={{ 
        position: 'relative', 
        height: '400px', 
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ width: '100%', height: '100%', maxWidth: '400px', margin: '0 auto' }}>
          <Radar data={data} options={options} />
        </div>
      </div>
      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem',
          backgroundColor: '#ffffff',
          borderRadius: '0',
          border: '1px solid #000000',
          fontSize: '0.875rem',
          color: '#000000',
        }}
      >
        <strong>Axes:</strong> {axes.join(' • ')}
      </div>
    </div>
  );
};

