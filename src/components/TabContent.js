import React from 'react';

const TabContent = ({ activeTab, analysis }) => {
  const createScoreBar = (label, percentage, points, maxPoints) => {
    // Coerce to numbers and provide safe defaults to avoid NaN
    const safePoints = Number(points) || 0;
    const safeMaxPoints = Number(maxPoints) || 100;
    // Always calculate fill percent based on points/maxPoints
    let fillPercent = (safePoints / safeMaxPoints) * 100;
    fillPercent = Math.max(0, Math.min(100, fillPercent)); // Clamp between 0 and 100

    // Determine color based on fillPercent
    let scoreColor = 0;
    if (fillPercent >= 80) scoreColor = 3;      // Green
    else if (fillPercent >= 60) scoreColor = 2; // Yellow
    else if (fillPercent >= 40) scoreColor = 1; // Orange
    else scoreColor = 0;                        // Red

    return `
      <div class="score-item">
        <div class="score-label">${label}</div>
        <div class="score-bar-container">
          <div class="score-bar">
            <div class="score-fill" data-score="${scoreColor}" style="width: ${fillPercent}%"></div>
          </div>
          <div class="score-points">${safePoints}/${safeMaxPoints}</div>
        </div>
      </div>
    `;
  };

  const createMatchedList = (items) => {
    if (!items || items.length === 0) {
      return <div className="empty-list">No matched keywords found</div>;
    }
    return (
      <div className="matched-items">
        {items.map((item, index) => {
          if (item && typeof item === 'object') {
            const text = item.keyword || item.skill || JSON.stringify(item);
            return (
              <div key={index} className="matched-item">
                <span className="match-icon">✓</span>
                <span className="match-text">{text}</span>
              </div>
            );
          }
          return (
            <div key={index} className="matched-item">
              <span className="match-icon">✓</span>
              <span className="match-text">{item}</span>
            </div>
          );
        })}
      </div>
    );
  };

  // Helper function to create job info display
  const createJobInfoDisplay = (jobInfo) => {
    if (!jobInfo || Object.keys(jobInfo).length === 0) return '';
    
    let infoHtml = '<div class="job-info-section"><h4>Job Information</h4><div class="job-info-grid">';
    
    if (jobInfo.workMode) {
      infoHtml += `<div class="job-info-item"><span class="info-label">Work Mode:</span> <span class="info-value">${jobInfo.workMode}</span></div>`;
    }
    
    if (jobInfo.jobType) {
      infoHtml += `<div class="job-info-item"><span class="info-label">Job Type:</span> <span class="info-value">${jobInfo.jobType}</span></div>`;
    }
    
    if (jobInfo.companyDetails) {
      infoHtml += `<div class="job-info-item"><span class="info-label">Company Details:</span> <span class="info-value">${jobInfo.companyDetails}</span></div>`;
    }
    
    infoHtml += '</div></div>';
    return infoHtml;
  };

  const createMissingList = (items) => {
    if (!items || items.length === 0) {
      return <div className="empty-list">No missing keywords identified</div>;
    }
    return (
      <div className="missing-items">
        {items.map((item, index) => (
          <div key={index} className="missing-item">
            <span className="missing-icon">×</span>
            <span className="missing-text">{item}</span>
          </div>
        ))}
      </div>
    );
  };

  const createExperienceList = (items, type) => {
    if (!items || items.length === 0) {
      return <div className="empty-list">No {type} experience found</div>;
    }
    return (
      <div className={`${type}-items`}>
        {items.map((item, index) => {
          if (item && typeof item === 'object') {
            const text = item.responsibility || item.text || JSON.stringify(item);
            const notes = item.notes;
            const icon = type === 'matched' ? '✅' : type === 'partial' ? '⚠️' : '❌';
            return (
              <div key={index} className={`${type}-item`}>
                <div className="item-header">
                  <span className={`${type}-icon`}>{icon}</span>
                  <span className="item-title">{text}</span>
                </div>
                {notes && <div className="item-details">{notes}</div>}
              </div>
            );
          }
          const icon = type === 'matched' ? '✅' : type === 'partial' ? '⚠️' : '❌';
          return (
            <div key={index} className={`${type}-item`}>
              <div className="item-header">
                <span className={`${type}-icon`}>{icon}</span>
                <span className="item-title">{item}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const createSkillsList = (items, type) => {
    if (!items || items.length === 0) {
      return <div className="empty-list">No {type} skills found</div>;
    }
    return (
      <div className={`${type}-items`}>
        {items.map((item, index) => {
          if (item && typeof item === 'object') {
            const text = item.skill || item.name || JSON.stringify(item);
            const status = item.status;
            const icon = item.symbol || (type === 'matched' ? '✓' : '×');
            return (
              <div key={index} className={`${type}-item`}>
                <span className={`${type}-icon`}>{icon}</span>
                <span className="item-text">
                  {text}
                  {status && <span className="skill-status"> ({status})</span>}
                </span>
              </div>
            );
          }
          const icon = type === 'matched' ? '✓' : '×';
          return (
            <div key={index} className={`${type}-item`}>
              <span className={`${type}-icon`}>{icon}</span>
              <span className="item-text">{item}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const createCertificationsList = (certifications) => {
    if (!certifications || certifications.length === 0) {
      return <div className="empty-list">No certifications found</div>;
    }
    return (
      <div className="certification-items">
        {certifications.map((cert, index) => {
          if (cert && typeof cert === 'object') {
            const text = cert.name || cert.title || JSON.stringify(cert);
            const status = cert.status === 'Found' ? 'matched' : 'missing';
            const icon = cert.symbol || (cert.status === 'Found' ? '✓' : '×');
            return (
              <div key={index} className={`certification-item ${status}`}>
                <span className="certification-icon">{icon}</span>
                <span className="certification-text">{text}</span>
              </div>
            );
          }
          return (
            <div key={index} className="certification-item">
              <span className="certification-icon">✓</span>
              <span className="certification-text">{cert}</span>
            </div>
          );
        })}
      </div>
    );
  };

  // Helper function for sections
  const createSectionsList = (items) => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return <div className="empty-list">No section data available</div>;
    }
    
    return (
      <div className="section-items">
        {items.map((item, index) => (
          <div key={index} className={`section-item ${item.status === 'Completed' ? 'matched' : 'missing'}`}>
            <span className="section-icon">{item.status === 'Completed' ? '✓' : '×'}</span>
            <span className="section-text">{item.section || ''}</span>
            <span className="section-status">{item.status || ''}</span>
          </div>
        ))}
      </div>
    );
  };

  // Helper function for action verbs
  const createActionVerbsList = (items, type) => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return <div className="empty-list">No {type} action verbs found</div>;
    }
    
    const icons = {
      strong: '✓',
      weak: '⚠',
      missing: '×'
    };
    
    return (
      <div className={`${type}-verbs`}>
        {items.map((item, index) => (
          <div key={index} className={`${type}-verb-item`}>
            <div className="verb-header">
              <span className={`${type}-icon`}>{icons[type]}</span>
              <span className="verb-text">
                {type === 'weak' ? (
                  <>
                    <strong>{item.actionVerb || ''}</strong> → <span className="suggested">{item.suggestedReplacement || ''}</span>
                  </>
                ) : type === 'missing' ? (
                  'Missing action verb'
                ) : (
                  <strong>{item.actionVerb || ''}</strong>
                )}
              </span>
            </div>
            <div className="verb-example">
              {item.bulletPoint || ''}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Helper function for measurable results
  const createMeasurableResultsList = (items) => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return <div className="empty-list">No measurable results found</div>;
    }
    
    return (
      <div className="measurable-results">
        {items.map((item, index) => (
          <div key={index} className="measurable-result-item">
            <div className="result-header">
              <span className="result-icon">✓</span>
              <span className="result-metric">{item.metric || ''}</span>
            </div>
            <div className="result-text">
              {item.bulletPoint || ''}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Helper function for opportunities
  const createOpportunitiesList = (items) => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return <div className="empty-list">No opportunities for metrics found</div>;
    }
    
    return (
      <div className="opportunities">
        {items.map((item, index) => (
          <div key={index} className="opportunity-item">
            <div className="opportunity-header">
              <span className="opportunity-icon">💡</span>
              <span className="opportunity-suggestion">{item.suggestion || ''}</span>
            </div>
            <div className="opportunity-text">
              {item.bulletPoint || ''}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Helper function for bullet points
  const createBulletPointsList = (items, type) => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return <div className="empty-list">No {type} bullet points found</div>;
    }
    
    return (
      <div className={`${type}-bullets`}>
        {items.map((item, index) => (
          <div key={index} className={`${type}-bullet-item`}>
            <div className="bullet-header">
              <span className="bullet-icon">{type === 'effective' ? '✓' : '×'}</span>
              <span className="bullet-count">Word Count: {item.wordCount || 0}</span>
            </div>
            <div className="bullet-text">
              {item.bulletPoint || ''}
            </div>
            <div className="bullet-feedback">
              <strong>{type === 'effective' ? 'Strengths' : 'Issues'}:</strong> 
              {type === 'effective' ? (item.strengths || '') : (item.issues || '')}
            </div>
            {type === 'ineffective' && (
              <div className="bullet-suggestion">
                <strong>Suggested Revision:</strong> 
                {item.suggestedRevision || ''}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'summary':
        return (
          <div id="summary-content" className="tab-content active">
            <div className="score-breakdown">
              <h3>Score Breakdown</h3>
              <div dangerouslySetInnerHTML={{
                __html: `
                  ${createScoreBar('Keyword Match', analysis.keyword_match?.score?.matchPercentage ?? 0, analysis.keyword_match?.score?.pointsAwarded ?? 0, 21)}
                  ${createScoreBar('Job Experience', analysis.job_experience?.score?.alignmentPercentage ?? 0, analysis.job_experience?.score?.pointsAwarded ?? 0, 18)}
                  ${createScoreBar('Education & Certifications', (analysis.skills_certifications?.score?.educationMatchPercentage ?? analysis.skills_certifications?.score?.matchPercentage) ?? 0, (analysis.skills_certifications?.score?.educationPointsAwarded ?? (analysis.skills_certifications?.score?.pointsAwarded ? analysis.skills_certifications?.score?.pointsAwarded * 0.57 : 0)) ?? 0, 12)}
                  ${createScoreBar('Skills & Tools', (analysis.skills_certifications?.score?.skillsMatchPercentage ?? analysis.skills_certifications?.score?.matchPercentage) ?? 0, (analysis.skills_certifications?.score?.skillsPointsAwarded ?? (analysis.skills_certifications?.score?.pointsAwarded ? analysis.skills_certifications?.score?.pointsAwarded * 0.43 : 0)) ?? 0, 9)}
                  ${createScoreBar('Resume Structure', analysis.resume_structure?.score?.pointsAwarded ? (analysis.resume_structure?.score?.pointsAwarded/12)*100 : 0, analysis.resume_structure?.score?.pointsAwarded ?? 0, 12)}
                  ${createScoreBar('Action Words', analysis.action_words?.score?.actionVerbPercentage ?? 0, analysis.action_words?.score?.pointsAwarded ?? 0, 10)}
                  ${createScoreBar('Measurable Results', analysis.measurable_results?.score?.pointsAwarded ? (analysis.measurable_results?.score?.pointsAwarded/10)*100 : 0, analysis.measurable_results?.score?.pointsAwarded ?? 0, 10)}
                  ${createScoreBar('Bullet Points', analysis.bullet_point_effectiveness?.score?.effectiveBulletPercentage ?? 0, analysis.bullet_point_effectiveness?.score?.pointsAwarded ?? 0, 8)}
                `
              }} />
            </div>
            
            {/* Display job information if available */}
            {analysis.jobInfo && (
              <div dangerouslySetInnerHTML={{
                __html: createJobInfoDisplay(analysis.jobInfo)
              }} />
            )}
          </div>
        );

      case 'keyword':
        return (
          <div id="keyword-content" className="tab-content">
            <h3>Keyword Analysis</h3>
            <div className="analysis-section">
              <div className="metric-summary">
                <span className="metric-label">Match Percentage:</span>
                <span className="metric-value">
                  {analysis.keyword_match?.score?.matchPercentage || 0}% 
                  ({analysis.keyword_match?.score?.rating || 'N/A'})
                </span>
              </div>
              
              <h4>Matched Keywords</h4>
              {createMatchedList(analysis.keyword_match?.analysis?.matchedKeywords)}
              
              <h4>Missing Keywords</h4>
              {createMissingList(analysis.keyword_match?.analysis?.missingKeywords)}
              
              <div className="improvement-suggestions">
                <h4>Suggestions</h4>
                <p>{analysis.keyword_match?.analysis?.suggestedImprovements || 'No suggestions available'}</p>
              </div>
            </div>
          </div>
        );

      case 'experience':
        return (
          <div id="experience-content" className="tab-content">
            <h3>Job Experience Analysis</h3>
            <div className="analysis-section">
              <div className="metric-summary">
                <span className="metric-label">Alignment Percentage:</span>
                <span className="metric-value">
                  {analysis.job_experience?.score?.alignmentPercentage || 0}% 
                  ({analysis.job_experience?.score?.rating || 'N/A'})
                </span>
              </div>
              
              <h4>Strong Matches</h4>
              {createExperienceList(analysis.job_experience?.analysis?.strongMatches, 'matched')}
              
              <h4>Partial Matches</h4>
              {createExperienceList(analysis.job_experience?.analysis?.partialMatches, 'partial')}
              
              <h4>Missing Experience</h4>
              {createExperienceList(analysis.job_experience?.analysis?.missingExperience, 'missing')}
              
              <div className="improvement-suggestions">
                <h4>Suggestions</h4>
                <p>{analysis.job_experience?.analysis?.suggestedImprovements || 'No suggestions available'}</p>
              </div>
            </div>
          </div>
        );

      case 'skills':
        return (
          <div id="skills-content" className="tab-content">
            <h3>Skills & Certifications Analysis</h3>
            <div className="analysis-section">
              <div className="metric-summary">
                <span className="metric-label">Match Percentage:</span>
                <span className="metric-value">
                  {analysis.skills_certifications?.score?.matchPercentage || 0}% 
                  ({analysis.skills_certifications?.score?.rating || 'N/A'})
                </span>
              </div>
              
              <h4>Matched Skills</h4>
              {createSkillsList(analysis.skills_certifications?.analysis?.matchedSkills, 'matched')}
              
              <h4>Missing Skills</h4>
              {createSkillsList(analysis.skills_certifications?.analysis?.missingSkills, 'missing')}
              
              <h4>Certifications</h4>
              {createCertificationsList(analysis.skills_certifications?.analysis?.certificationMatch)}
              
              <div className="improvement-suggestions">
                <h4>Suggestions</h4>
                <p>{analysis.skills_certifications?.analysis?.suggestedImprovements || 'No suggestions available'}</p>
              </div>
            </div>
          </div>
        );

      case 'structure':
        return (
          <div id="structure-content" className="tab-content">
            <h3>Resume Structure Analysis</h3>
            <div className="analysis-section">
              <div className="metric-summary">
                <span className="metric-label">Completed Sections:</span>
                <span className="metric-value">
                  {analysis.resume_structure?.score?.completedSections || 0}/{analysis.resume_structure?.score?.totalMustHaveSections || 0}
                </span>
              </div>
              
              <h4>Section Status</h4>
              {createSectionsList(analysis.resume_structure?.analysis?.sectionStatus)}
              
              <div className="improvement-suggestions">
                <h4>Suggestions</h4>
                <p>{analysis.resume_structure?.analysis?.suggestedImprovements || 'No suggestions available'}</p>
              </div>
            </div>
          </div>
        );

      case 'actions':
        return (
          <div id="actions-content" className="tab-content">
            <h3>Action Words Analysis</h3>
            <div className="analysis-section">
              <div className="metric-summary">
                <span className="metric-label">Strong Action Verbs Percentage:</span>
                <span className="metric-value">
                  {analysis.action_words?.score?.actionVerbPercentage || 0}%
                </span>
              </div>
              
              <h4>Strong Action Verbs</h4>
              {createActionVerbsList(analysis.action_words?.analysis?.strongActionVerbs || [], 'strong')}
              
              <h4>Weak Action Verbs</h4>
              {createActionVerbsList(analysis.action_words?.analysis?.weakActionVerbs || [], 'weak')}
              
              <h4>Missing Action Verbs</h4>
              {createActionVerbsList(analysis.action_words?.analysis?.missingActionVerbs || [], 'missing')}
              
              <div className="improvement-suggestions">
                <h4>Suggestions</h4>
                <p>{analysis.action_words?.analysis?.suggestedImprovements || 'No suggestions available'}</p>
              </div>
            </div>
          </div>
        );

      case 'results':
        return (
          <div id="results-content" className="tab-content">
            <h3>Measurable Results Analysis</h3>
            <div className="analysis-section">
              <div className="metric-summary">
                <span className="metric-label">Measurable Results Count:</span>
                <span className="metric-value">
                  {analysis.measurable_results?.score?.measurableResultsCount || 0}
                </span>
              </div>
              
              <h4>Measurable Results Found</h4>
              {createMeasurableResultsList(analysis.measurable_results?.analysis?.measurableResults || [])}
              
              <h4>Opportunities for Metrics</h4>
              {createOpportunitiesList(analysis.measurable_results?.analysis?.opportunitiesForMetrics || [])}
              
              <div className="improvement-suggestions">
                <h4>Suggestions</h4>
                <p>{analysis.measurable_results?.analysis?.suggestedImprovements || 'No suggestions available'}</p>
              </div>
            </div>
          </div>
        );

      case 'bullets':
        return (
          <div id="bullets-content" className="tab-content">
            <h3>Bullet Point Effectiveness</h3>
            <div className="analysis-section">
              <div className="metric-summary">
                <span className="metric-label">Effective Bullets Percentage:</span>
                <span className="metric-value">
                  {analysis.bullet_point_effectiveness?.score?.effectiveBulletPercentage || 0}%
                </span>
              </div>
              
              <h4>Effective Bullet Points</h4>
              {createBulletPointsList(analysis.bullet_point_effectiveness?.analysis?.effectiveBullets || [], 'effective')}
              
              <h4>Ineffective Bullet Points</h4>
              {createBulletPointsList(analysis.bullet_point_effectiveness?.analysis?.ineffectiveBullets || [], 'ineffective')}
              
              <div className="improvement-suggestions">
                <h4>Suggestions</h4>
                <p>{analysis.bullet_point_effectiveness?.analysis?.suggestedImprovements || 'No suggestions available'}</p>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Select a tab to view analysis</div>;
    }
  };

  return (
    <div className="tab-content-wrapper">
      {renderContent()}
    </div>
  );
};

export default TabContent;
