import React from 'react';

const SubmitSection = ({ onSubmit, disabled, isAnalyzing, showWarning, hasResume, hasJobData }) => {
  const getButtonText = () => {
    if (isAnalyzing) return 'Analyzing...';
    if (!hasResume) return 'Upload Resume First';
    if (!hasJobData) return 'Extract Job Details First';
    return 'Analyze Job Match';
  };

  const getStatusMessage = () => {
    if (!hasResume) return 'Please upload your resume to continue.';
    if (!hasJobData) return 'Please extract job details from LinkedIn to continue.';
    return 'Ready to analyze your resume against the job description.';
  };

  return (
    <div className="submit-section">
      {isAnalyzing && (
        <div id="progressBar" className="progress-bar">
          <div className="progress-bar-fill"></div>
        </div>
      )}
      
      {showWarning && (
        <div id="warningMessage" className="warning-message">
          Please stay on this tab while the extension processes your data. Switching tabs or navigating away might cause it to close and lose your progress.
        </div>
      )}

      <div className="status-message">
        {getStatusMessage()}
      </div>
      
      <button 
        id="submit-button" 
        className="primary-button" 
        disabled={disabled}
        onClick={onSubmit}
      >
        {getButtonText()}
      </button>
    </div>
  );
};

export default SubmitSection;
