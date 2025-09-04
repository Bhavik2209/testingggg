import React, { useState } from 'react';
import ResultsCard from './ResultsCard';
import DetailedAnalysis from './DetailedAnalysis';
import './Analysis.css';

const AnalysisSection = ({ results, onBack }) => {
  const [showDetailed, setShowDetailed] = useState(false);

  if (showDetailed) {
    return (
      <DetailedAnalysis 
        analysis={results.analysis}
        onBack={() => setShowDetailed(false)}
      />
    );
  }

  return (
    <div id="analysisSection" className="analysis-section">
      <ResultsCard 
        results={results}
        onViewDetailed={() => setShowDetailed(true)}
      />
    </div>
  );
};

export default AnalysisSection;
