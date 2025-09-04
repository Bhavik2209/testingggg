import React from 'react';
import './Analysis.css';

const ResultsCard = ({ results, onViewDetailed }) => {
  // Handle error case
  if (results.error) {
    return (
      <div className="error-banner">
        <h3>Error Occurred</h3>
        <p>{results.error}</p>
      </div>
    );
  }

  const { job_context, analysis } = results;
  const overallScore = analysis.overall_score || 0;

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getMatchLevel = (score) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Poor Match';
  };

  return (
    <div className="results-card">
      <div className="results-header">
        <h2>Resume Analysis Results</h2>
        <div className="job-context">
          <p>
            <strong>{job_context.title || 'Job Position'}</strong>
            {job_context.company && job_context.company !== 'Company' 
              ? ` at ${job_context.company}` 
              : ''
            }
          </p>
          {/* Display additional job information if available */}
          {results.jobInfo && (
            <div className="job-context-details">
              {results.jobInfo.workMode && (
                <span className="job-badge work-mode">{results.jobInfo.workMode}</span>
              )}
              {results.jobInfo.jobType && (
                <span className="job-badge job-type">{results.jobInfo.jobType}</span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="score-section">
        <div className="overall-score-container">
          <div 
            className="overall-score-circle" 
            style={{ 
              background: `conic-gradient(${getScoreColor(overallScore)} ${overallScore}%, #e0e0e0 0)` 
            }}
          >
            <div className="overall-score-value">{Math.round(overallScore)}</div>
          </div>
          <div className="overall-score-label">{getMatchLevel(overallScore)}</div>
        </div>
      </div>

      <button 
        className="detail-analysis-button"
        onClick={onViewDetailed}
      >
        📊 View Detailed Analysis
      </button>
    </div>
  );
};

export default ResultsCard;
