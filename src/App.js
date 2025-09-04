import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import LinkedInJobExtractor from './components/LinkedInJobExtractor';
import SubmitSection from './components/SubmitSection';
import AnalysisSection from './components/AnalysisSection';
import Footer from './components/Footer';
import FeedbackLink from './components/FeedbackLink';
import './App.css';

function App() {
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeStatus, setResumeStatus] = useState('No file selected');
  const [jobData, setJobData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [extVersion, setExtVersion] = useState('0.0.5');

  useEffect(() => {
    // Set extension version
    setExtVersion('0.0.5');
  }, []);

  const handleFileUpload = (file) => {
    setResumeFile(file);
    setResumeStatus(file ? `${file.name} selected` : 'No file selected');
  };

  const handleSubmit = async () => {
    if (!resumeFile) {
      alert('Please upload your resume first.');
      return;
    }

    if (!jobData) {
      alert('Please extract job details from LinkedIn first.');
      return;
    }

    setIsAnalyzing(true);
    setShowWarning(true);

    try {
      // Create form data for API request
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('jobData', JSON.stringify(jobData));

      // Send request to the API
      const response = await fetch('http://127.0.0.1:8000/api/analyze', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const responseData = await response.json();
      setAnalysisResults(responseData);
      setIsAnalyzing(false);
      setShowWarning(false);

    } catch (error) {
      console.error('Analysis failed:', error);
      setAnalysisResults({
        error: `Failed to analyze job match: ${error.message}`
      });
      setIsAnalyzing(false);
      setShowWarning(false);
    }
  };

  const handleJobDataExtracted = (extractedJobData) => {
    setJobData(extractedJobData);
  };

  // Auto-scroll to analysis section when results are ready
  useEffect(() => {
    if (analysisResults) {
      // Wait for section to render
      setTimeout(() => {
        const el = document.getElementById('analysisSection');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [analysisResults]);

  return (
    <div className="App">
      <div className="container">
        <FeedbackLink />
        <Header />
        
        <div className="main-content">
          <div className="full-width-panel">
            <UploadSection 
              onFileUpload={handleFileUpload}
              resumeStatus={resumeStatus}
            />
          
            <SubmitSection 
              onSubmit={handleSubmit}
              disabled={!resumeFile || !jobData || isAnalyzing}
              isAnalyzing={isAnalyzing}
              showWarning={showWarning}
              hasResume={!!resumeFile}
              hasJobData={!!jobData}
            />
            
            {!analysisResults && (
              <LinkedInJobExtractor 
                onJobDataExtracted={handleJobDataExtracted}
                isExtracting={isAnalyzing}
              />
            )}
          </div>
        </div>

        {analysisResults && (
          <AnalysisSection 
            results={analysisResults}
            onBack={() => setAnalysisResults(null)}
          />
        )}

        <Footer version={extVersion} />
      </div>
    </div>
  );
}

export default App;
