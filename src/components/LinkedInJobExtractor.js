import React, { useState, useEffect } from 'react';
import './LinkedInJobExtractor.css';

const LinkedInJobExtractor = ({ onJobDataExtracted, isExtracting }) => {
  const [jobData, setJobData] = useState(null);
  const [extractionStatus, setExtractionStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    // Reset all state when component mounts to ensure fresh extraction
    const resetAndExtract = async () => {
      try {
        // Reset all state first
        setJobData(null);
        setExtractionStatus('idle');
        setError(null);
        setCurrentUrl('');
        
        // Get fresh tab info
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        console.log('Component mounted, current tab URL:', tab.url);
        setCurrentUrl(tab.url);
        
        // Check if we should extract immediately
        const shouldExtract = tab.url && (
          (tab.url.includes('linkedin.com/jobs/') && (tab.url.includes('currentJobId=') || tab.url.includes('/view/'))) ||
          tab.url.includes('linkedin.com/job/') ||
          (tab.url.includes('linkedin.com/company/') && tab.url.includes('/jobs/') && (tab.url.includes('currentJobId=') || tab.url.includes('/view/')))
        );
        
        if (shouldExtract) {
          console.log('✅ Valid job page detected - starting extraction in 1 second');
          setTimeout(() => {
            extractJobDetails();
          }, 1000); // Give more time for page to be fully loaded
        } else {
          console.log('❌ Not a valid job page - setting error state');
          setError('Please navigate to a specific LinkedIn job posting page (with job description) to extract job details.');
          setExtractionStatus('error');
        }
      } catch (error) {
        console.error('Failed to initialize extraction:', error);
      }
    };
    
    resetAndExtract();
  }, []);

  const isLinkedInJobPage = async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      return tab.url && (
        // Specific job with ID in URL
        (tab.url.includes('linkedin.com/jobs/') && (tab.url.includes('currentJobId=') || tab.url.includes('/view/'))) ||
        // Direct job URL pattern
        tab.url.includes('linkedin.com/job/') ||
        // Company job with specific ID
        (tab.url.includes('linkedin.com/company/') && tab.url.includes('/jobs/') && (tab.url.includes('currentJobId=') || tab.url.includes('/view/')))
      );
    } catch (error) {
      console.error('Error checking LinkedIn job page:', error);
      return false;
    }
  };

  const extractJobDetails = async () => {
    setExtractionStatus('extracting');
    setError(null);

    try {
      // Always get fresh tab info - don't rely on any cached state
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      console.log('=== FRESH EXTRACTION ATTEMPT ===');
      console.log('Current tab URL:', tab.url);
      console.log('Previous cached URL:', currentUrl);
      
      // Update current URL state
      setCurrentUrl(tab.url);
      
      // Check if we're on a specific LinkedIn job description page
      const isSpecificJobPage = tab.url && (
        // Specific job with ID in URL
        (tab.url.includes('linkedin.com/jobs/') && (tab.url.includes('currentJobId=') || tab.url.includes('/view/'))) ||
        // Direct job URL pattern
        tab.url.includes('linkedin.com/job/') ||
        // Company job with specific ID
        (tab.url.includes('linkedin.com/company/') && tab.url.includes('/jobs/') && (tab.url.includes('currentJobId=') || tab.url.includes('/view/')))
      );

      console.log('Is specific job page:', isSpecificJobPage);
      console.log('URL contains currentJobId:', tab.url?.includes('currentJobId='));
      console.log('URL contains /view/:', tab.url?.includes('/view/'));
      console.log('URL contains /job/:', tab.url?.includes('/job/'));

      if (!isSpecificJobPage) {
        console.log('❌ Not a specific job page - stopping extraction');
        setError('Please navigate to a specific LinkedIn job posting page (with job description) to extract job details. The current page appears to be a general jobs listing.');
        setExtractionStatus('error');
        return;
      }

      console.log('✅ Specific job page detected - proceeding with extraction');
      console.log('About to execute chrome.scripting.executeScript...');

      console.log('Executing script on tab ID:', tab.id);
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => {
          // LinkedIn job details extraction function
          const extractJobInfo = () => {
            // Job title selectors (multiple possible selectors)
            const jobTitleSelectors = [
              '.t-24.t-bold.inline a',
              '.job-details-jobs-unified-top-card__job-title',
              'h1.t-24.t-bold.inline',
              '.jobs-unified-top-card__job-title',
              '.jobs-unified-top-card__title',
              'h1[class*="job-title"]',
              '.job-details-jobs-unified-top-card__job-title',
              '.jobs-unified-top-card__job-title',
              '.jobs-unified-top-card__title',
              'h1[class*="job-title"]'
            ];

            // Company name selectors
            const companySelectors = [
              '.job-details-jobs-unified-top-card__company-name a',
              '.artdeco-entity-lockup__title a',
              '.jobs-unified-top-card__company-name',
              '.jobs-unified-top-card__subtitle-primary-grouping',
              '.jobs-unified-top-card__subtitle-primary-grouping a',
              '.jobs-unified-top-card__company-name a',
              '.jobs-unified-top-card__subtitle-primary-grouping a'
            ];

            // Location selectors
            const locationSelectors = [
              '.tvm__text.tvm__text--low-emphasis',
              '.jobs-unified-top-card__bullet',
              '.jobs-unified-top-card__subtitle-primary-grouping',
              '.jobs-unified-top-card__subtitle-primary-grouping span',
              '.jobs-unified-top-card__subtitle-primary-grouping .jobs-unified-top-card__bullet',
              '.jobs-unified-top-card__subtitle-primary-grouping .jobs-unified-top-card__bullet'
            ];

            // Job description selectors (prioritized by reliability)
            const descriptionSelectors = [
              '.jobs-box__html-content',
              '.jobs-description-content__text',
              '.jobs-description__content',
              '.jobs-box--full-width',
              '.jobs-description--reformatted',
              '.jobs-description__container',
              '.jobs-description-content',
              '.jobs-box__html-content.avQjLrmhdKIBkffLUgEiVobqKdExpZiJsAoIJ',
              '.jobs-description-content__text--stretch',
              '#job-details',
              '.jobs-box--with-cta-large',
              '.jobs-description__content .jobs-box__html-content',
              '.jobs-description-content__text--stretch',
              '.jobs-box__html-content.avQjLrmhdKIBkffLUgEiVobqKdExpZiJsAoIJ',
              // Additional selectors for better coverage
              '[data-job-description]',
              '.job-description',
              '.job-description-content',
              '.jobs-description',
              '.jobs-box__html-content p',
              '.jobs-description__content p'
            ];

            // Extract job title
            let jobTitle = '';
            for (const selector of jobTitleSelectors) {
              const element = document.querySelector(selector);
              if (element && element.textContent.trim()) {
                jobTitle = element.textContent.trim();
                break;
              }
            }

            // Extract company name
            let company = '';
            for (const selector of companySelectors) {
              const element = document.querySelector(selector);
              if (element && element.textContent.trim()) {
                company = element.textContent.trim();
                break;
              }
            }

            // Extract location
            let location = '';
            for (const selector of locationSelectors) {
              const element = document.querySelector(selector);
              if (element && element.textContent.trim()) {
                const text = element.textContent.trim();
                // Filter out company name and get location
                if (text && !text.includes(company) && text.length < 100) {
                  location = text;
                  break;
                }
              }
            }

            // Extract job description
            let jobDescription = '';
            for (const selector of descriptionSelectors) {
              const element = document.querySelector(selector);
              if (element && element.textContent.trim().length > 200) {
                jobDescription = element.textContent.trim();
                break;
              }
            }

            // If still no description, try alternative approach
            if (!jobDescription) {
              const contentContainers = document.querySelectorAll('.jobs-box__html-content, .jobs-description-content__text, .jobs-description__content, .job-description, .jobs-description');
              for (const container of contentContainers) {
                if (container.textContent.trim().length > 200) {
                  jobDescription = container.textContent.trim();
                  break;
                }
              }
            }

            // Last resort: try to find any large text block that might contain the job description
            if (!jobDescription) {
              const allElements = document.querySelectorAll('p, div, section');
              for (const element of allElements) {
                const text = element.textContent.trim();
                if (text.length > 500 && (text.includes('responsibilities') || text.includes('requirements') || text.includes('qualifications') || text.includes('experience'))) {
                  jobDescription = text;
                  break;
                }
              }
            }

            // Extract additional job information
            const jobInfo = {};
            
            // Job type and work mode
            const jobTypeButtons = document.querySelectorAll('.job-details-fit-level-preferences button, .jobs-unified-top-card__job-insight button');
            jobTypeButtons.forEach(button => {
              const text = button.textContent.trim();
              if (text.includes('Remote') || text.includes('On-site') || text.includes('Hybrid')) {
                jobInfo.workMode = text;
              }
              if (text.includes('Internship') || text.includes('Full-time') || text.includes('Part-time') || text.includes('Contract')) {
                jobInfo.jobType = text;
              }
            });

            // Company size and industry
            const companyInfoElements = document.querySelectorAll('.jobs-company__box .t-14, .jobs-unified-top-card__subtitle-primary-grouping .t-14');
            companyInfoElements.forEach(element => {
              const text = element.textContent.trim();
              if (text.includes('employees') || text.includes('followers') || text.includes('industry')) {
                jobInfo.companyDetails = text;
              }
            });

            // Posted date
            const postedDateElement = document.querySelector('.jobs-unified-top-card__subtitle-secondary-grouping .t-14');
            if (postedDateElement) {
              jobInfo.postedDate = postedDateElement.textContent.trim();
            }

            // Seniority level
            const seniorityElement = document.querySelector('.jobs-unified-top-card__job-insight .jobs-unified-top-card__job-insight');
            if (seniorityElement) {
              jobInfo.seniority = seniorityElement.textContent.trim();
            }

            return {
              jobTitle: jobTitle || 'Job Title Not Found',
              company: company || 'Company Not Found',
              location: location || 'Location Not Found',
              description: jobDescription || 'Job description not found. Please ensure you are on a LinkedIn job posting page.',
              url: window.location.href,
              jobInfo,
              extractedAt: new Date().toISOString()
            };
          };

          return extractJobInfo();
        }
      });

      console.log('Script execution completed. Results:', results);
      const extractedData = results[0].result;
      
      // Log extracted data for debugging
      console.log('Extracted job data:', extractedData);
      
      // Validate extracted data
      if (!extractedData.description || extractedData.description.length < 100) {
        console.log('Description validation failed:', {
          hasDescription: !!extractedData.description,
          descriptionLength: extractedData.description?.length || 0
        });
        setError('Could not extract a valid job description. Please ensure you are on a LinkedIn job posting page with a complete job description. Try refreshing the page and extracting again.');
        setExtractionStatus('error');
        return;
      }

      setJobData(extractedData);
      setExtractionStatus('success');
      
      // Pass the extracted data to parent component
      onJobDataExtracted(extractedData);

    } catch (error) {
      console.error('Failed to extract job details:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to extract job details. ';
      if (error.message.includes('Cannot access')) {
        errorMessage += 'Please ensure you have permission to access this page and try again.';
      } else if (error.message.includes('tab')) {
        errorMessage += 'Please refresh the page and try again.';
      } else {
        errorMessage += `Error: ${error.message}. Please try again.`;
      }
      
      setError(errorMessage);
      setExtractionStatus('error');
    }
  };



  const handleRetry = () => {
    setExtractionStatus('idle');
    setError(null);
    setJobData(null);
    // Actually retry the extraction
    setTimeout(() => {
      extractJobDetails();
    }, 100);
  };

  const getPageStatusMessage = () => {
    if (extractionStatus === 'extracting') return '🔄 Extracting job details from LinkedIn...';
    if (extractionStatus === 'success') return '✅ Job details extracted successfully!';
    if (extractionStatus === 'error') return '❌ Extraction failed. Please try again.';
    if (!currentUrl) return '🔍 Checking current page...';
    // Check if current URL is a specific job page
    const isSpecificJob = currentUrl && (
      (currentUrl.includes('linkedin.com/jobs/') && (currentUrl.includes('currentJobId=') || currentUrl.includes('/view/'))) ||
      currentUrl.includes('linkedin.com/job/') ||
      (currentUrl.includes('linkedin.com/company/') && currentUrl.includes('/jobs/') && (currentUrl.includes('currentJobId=') || currentUrl.includes('/view/')))
    );
    if (isSpecificJob) return '✅ Specific LinkedIn job page detected. Ready to extract.';
    return '❌ Please navigate to a specific LinkedIn job posting page (with job description) to extract job details.';
  };

  const getStatusIndicatorClass = () => {
    if (extractionStatus === 'extracting') return 'status-extracting';
    if (extractionStatus === 'success') return 'status-valid';
    if (extractionStatus === 'error') return 'status-invalid';
    if (!currentUrl) return 'status-checking';
    // Check if current URL is a specific job page
    const isSpecificJob = currentUrl && (
      (currentUrl.includes('linkedin.com/jobs/') && (currentUrl.includes('currentJobId=') || currentUrl.includes('/view/'))) ||
      currentUrl.includes('linkedin.com/job/') ||
      (currentUrl.includes('linkedin.com/company/') && currentUrl.includes('/jobs/') && (currentUrl.includes('currentJobId=') || currentUrl.includes('/view/')))
    );
    if (isSpecificJob) return 'status-valid';
    return 'status-invalid';
  };

  return (
    <div className="linkedin-job-extractor">
      <div className="extractor-header">
        <h3>LinkedIn Job Details Extractor</h3>
        <p>Extract job details from the current LinkedIn job posting page</p>
      </div>

      <div className="page-status">
        <div className={`status-indicator ${getStatusIndicatorClass()}`}>
          {getPageStatusMessage()}
        </div>
      </div>

      {extractionStatus === 'idle' && (
        <div className="extractor-actions">
          <div className="extractor-hint">
            💡 {currentUrl && (
              (currentUrl.includes('linkedin.com/jobs/') && (currentUrl.includes('currentJobId=') || currentUrl.includes('/view/'))) ||
              currentUrl.includes('linkedin.com/job/') ||
              (currentUrl.includes('linkedin.com/company/') && currentUrl.includes('/jobs/') && (currentUrl.includes('currentJobId=') || currentUrl.includes('/view/')))
            ) ? 'Automatically extracting job details from LinkedIn...' : 'Please navigate to a specific LinkedIn job posting page (with job description) to extract job details.'}
          </div>
          <button 
            className="refresh-btn secondary-btn"
            onClick={() => {
              setJobData(null);
              setExtractionStatus('idle');
              setError(null);
              setTimeout(() => extractJobDetails(), 100);
            }}
          >
            🔄 Refresh & Extract
          </button>
        </div>
      )}

      {extractionStatus === 'extracting' && (
        <div className="extraction-status">
          <div className="loading-spinner"></div>
          <p>Extracting job details from LinkedIn...</p>
        </div>
      )}

             {extractionStatus === 'success' && jobData && (
         <div className="extracted-data">
           <div className="success-message">
             ✅ Job details extracted successfully!
           </div>
           
           <div className="job-summary">
             <div className="job-title">{jobData.jobTitle}</div>
             <div className="company-name">{jobData.company}</div>
             <div className="job-location">{jobData.location}</div>
           </div>

           <div className="extraction-info">
             <div className="description-length">
               Job Description: {jobData.description.length} characters extracted
             </div>
           </div>

           <div className="extraction-actions">
             <button className="retry-btn secondary-btn" onClick={handleRetry}>
               Extract Again
             </button>
           </div>
         </div>
       )}

      {extractionStatus === 'error' && (
        <div className="extraction-error">
          <div className="error-message">
            ❌ {error}
          </div>
          <button className="retry-btn secondary-btn" onClick={handleRetry}>
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default LinkedInJobExtractor;
