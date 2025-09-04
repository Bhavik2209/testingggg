import React, { useState } from 'react';
import TabContent from './TabContent';
import './Analysis.css';

const DetailedAnalysis = ({ analysis, onBack }) => {
  const [activeTab, setActiveTab] = useState('summary');

  const tabs = [
    { id: 'summary', label: 'Summary' },
    { id: 'keyword', label: 'Keywords' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'structure', label: 'Structure' },
    { id: 'actions', label: 'Action Words' },
    { id: 'results', label: 'Measurable Results' },
    { id: 'bullets', label: 'Bullet Points' }
  ];

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="detailed-analysis-container">
      <div className="analysis-header">
        <button className="back-button" onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Back</span>
        </button>
        <h1>Detailed Analysis</h1>
        <div className="overall-score">
          <div 
            className="score-circle" 
            style={{ 
              background: `conic-gradient(${getScoreColor(analysis.overall_score)} ${analysis.overall_score}%, #e0e0e0 0)` 
            }}
          >
            <span className="score-value">{Math.round(analysis.overall_score)}</span>
          </div>
        </div>
      </div>

      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            data-tab={tab.id}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-contents">
        <TabContent 
          activeTab={activeTab}
          analysis={analysis}
        />
      </div>
    </div>
  );
};

export default DetailedAnalysis;
