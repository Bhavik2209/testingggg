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
    if (!items || !Array.isArray(items) || items.length === 0) {
      return <div className="empty-list">No matched keywords found</div>;
    }
    return (
      <div className="matched-items">
        {items.map((item, index) => {
          const text = typeof item === 'object' ? (item.keyword || item.skill || item.name || JSON.stringify(item)) : String(item);
          return (
            <div key={index} className="matched-item">
              <span className="match-icon">✓</span>
              <span className="match-text">{text}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const createMissingList = (items) => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return <div className="empty-list">No missing keywords identified</div>;
    }
    return (
      <div className="missing-items">
        {items.map((item, index) => {
          const text = typeof item === 'object' ? (item.keyword || item.skill || item.name || JSON.stringify(item)) : String(item);
          return (
            <div key={index} className="missing-item">
              <span className="missing-icon">×</span>
              <span className="missing-text">{text}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const createExperienceList = (items, type) => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return <div className="empty-list">No {type} experience found</div>;
    }
    return (
      <div className={`experience-list ${type}`}>
        {items.map((item, index) => {
          const text = typeof item === 'object' ? (item.responsibility || item.text || item.description || JSON.stringify(item)) : String(item);
          const notes = typeof item === 'object' ? item.notes : null;
          const status = typeof item === 'object' ? item.status : null;
          const icon = type === 'matched' ? '✅' : type === 'partial' ? '⚠️' : '❌';
          
          return (
            <div key={index} className={`${type}-item`}>
              <div className="item-header">
                <span className={`${type}-icon`}>{icon}</span>
                <span className="item-title">{text}</span>
              </div>
              {notes && <div className="item-details">{notes}</div>}
              {status && <div className="experience-notes">Status: {status}</div>}
            </div>
          );
        })}
      </div>
    );
  };

  const createSkillsList = (items, type) => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return <div className="empty-list">No {type} skills found</div>;
    }
    return (
      <div className={`skills-list ${type}`}>
        {items.map((item, index) => {
          const text = typeof item === 'object' ? (item.skill || item.name || item.title || JSON.stringify(item)) : String(item);
          const status = typeof item === 'object' ? item.status : null;
          const symbol = typeof item === 'object' ? item.symbol : (type === 'matched' ? '✓' : '×');
          
          return (
            <div key={index} className={`${type}-item`}>
              <span className={`${type}-icon`}>{symbol}</span>
              <span className="item-text">
                {text}
                {status && <span className="skill-status"> ({status})</span>}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const createEducationList = (items) => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return <div className="empty-list">No education requirements found</div>;
    }
    return (
      <div className="education-items">
        {items.map((item, index) => {
          const text = typeof item === 'object' ? (item.requirement || item.education || item.title || JSON.stringify(item)) : String(item);
          const status = typeof item === 'object' ? item.status : 'Unknown';
          const symbol = typeof item === 'object' ? item.symbol : '×';
          const isMatched = status === 'Found' || status === 'Completed';
          
          return (
            <div key={index} className={`education-item ${isMatched ? 'matched' : 'missing'}`}>
              <span className="education-icon">{symbol}</span>
              <span className="education-text">
                {text}
                <span className="education-status"> ({status})</span>
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const createCertificationsList = (certifications) => {
    if (!certifications || !Array.isArray(certifications) || certifications.length === 0) {
      return <div className="empty-list">No certifications found</div>;
    }
    return (
      <div className="certifications-list">
        {certifications.map((cert, index) => {
          const text = typeof cert === 'object' ? (cert.name || cert.title || cert.certification || JSON.stringify(cert)) : String(cert);
          const status = typeof cert === 'object' ? cert.status : 'Found';
          const symbol = typeof cert === 'object' ? cert.symbol : '✓';
          const isMatched = status === 'Found' || status === 'Completed';
          
          return (
            <div key={index} className={`certification-item ${isMatched ? 'matched' : 'missing'}`}>
              <span className="certification-icon">{symbol}</span>
              <span className="certification-text">
                {text}
                {status && <span className="certification-status"> ({status})</span>}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const createSectionsList = (items) => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return <div className="empty-list">No section data available</div>;
    }
    
    return (
      <div className="section-items">
        {items.map((item, index) => {
          const sectionName = typeof item === 'object' ? item.section : String(item);
          const status = typeof item === 'object' ? item.status : 'Unknown';
          const symbol = typeof item === 'object' ? item.symbol : (status === 'Completed' ? '✓' : '×');
          const isCompleted = status === 'Completed';
          
          return (
            <div key={index} className={`section-item ${isCompleted ? 'matched' : 'missing'}`}>
              <span className="section-icon">{symbol}</span>
              <span className="section-text">{sectionName}</span>
              <span className="section-status"> ({status})</span>
            </div>
          );
        })}
      </div>
    );
  };

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
        {items.map((item, index) => {
          const verbText = typeof item === 'object' ? item.actionVerb : String(item);
          const bulletPoint = typeof item === 'object' ? item.bulletPoint : '';
          const suggestedReplacement = typeof item === 'object' ? item.suggestedReplacement : '';
          
          return (
            <div key={index} className={`${type}-verb-item`}>
              <div className="verb-header">
                <span className={`${type}-icon`}>{icons[type]}</span>
                <span className="verb-text">
                  {type === 'weak' && suggestedReplacement ? (
                    <>
                      <strong>{verbText}</strong> → <span className="suggested">{suggestedReplacement}</span>
                    </>
                  ) : type === 'missing' ? (
                    'Missing action verb'
                  ) : (
                    <strong>{verbText}</strong>
                  )}
                </span>
              </div>
              {bulletPoint && (
                <div className="verb-example">{bulletPoint}</div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const createMeasurableResultsList = (items) => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return <div className="empty-list">No measurable results found</div>;
    }
    
    return (
      <div className="measurable-results">
        {items.map((item, index) => {
          const metric = typeof item === 'object' ? item.metric : '';
          const bulletPoint = typeof item === 'object' ? item.bulletPoint : String(item);
          
          return (
            <div key={index} className="measurable-result-item">
              <div className="result-header">
                <span className="result-icon">✓</span>
                <span className="result-metric">{metric || 'Measurable Result'}</span>
              </div>
              <div className="result-text">{bulletPoint}</div>
            </div>
          );
        })}
      </div>
    );
  };

  const createOpportunitiesList = (items) => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return <div className="empty-list">No opportunities for metrics found</div>;
    }
    
    return (
      <div className="opportunities">
        {items.map((item, index) => {
          const suggestion = typeof item === 'object' ? item.suggestion : '';
          const bulletPoint = typeof item === 'object' ? item.bulletPoint : String(item);
          
          return (
            <div key={index} className="opportunity-item">
              <div className="opportunity-header">
                <span className="opportunity-icon">💡</span>
                <span className="opportunity-suggestion">{suggestion || 'Opportunity for improvement'}</span>
              </div>
              {bulletPoint && (
                <div className="opportunity-text">{bulletPoint}</div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const createBulletPointsList = (items, type) => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return <div className="empty-list">No {type} bullet points found</div>;
    }
    
    return (
      <div className={`${type}-bullets`}>
        {items.map((item, index) => {
          const bulletPoint = typeof item === 'object' ? item.bulletPoint : String(item);
          const wordCount = typeof item === 'object' ? item.wordCount : 0;
          const strengths = typeof item === 'object' ? item.strengths : '';
          const issues = typeof item === 'object' ? item.issues : '';
          const suggestedRevision = typeof item === 'object' ? item.suggestedRevision : '';
          
          return (
            <div key={index} className={`${type}-bullet-item`}>
              <div className="bullet-header">
                <span className="bullet-icon">{type === 'effective' ? '✓' : '×'}</span>
                <span className="bullet-count">Word Count: {wordCount}</span>
              </div>
              <div className="bullet-text">{bulletPoint}</div>
              {(strengths || issues) && (
                <div className="bullet-feedback">
                  <strong>{type === 'effective' ? 'Strengths' : 'Issues'}:</strong> 
                  {type === 'effective' ? strengths : issues}
                </div>
              )}
              {type === 'ineffective' && suggestedRevision && (
                <div className="bullet-suggestion">
                  <strong>Suggested Revision:</strong> {suggestedRevision}
                </div>
              )}
            </div>
          );
        })}
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
                  ${createScoreBar('Keyword Match', analysis.keyword_match?.score?.matchPercentage || 0, analysis.keyword_match?.score?.pointsAwarded || 0, 21)}
                  ${createScoreBar('Job Experience', analysis.job_experience?.score?.alignmentPercentage || 0, analysis.job_experience?.score?.pointsAwarded || 0, 18)}
                  ${createScoreBar('Education & Certifications', analysis.skills_certifications?.score?.educationMatchPercentage || 0, analysis.skills_certifications?.score?.educationPointsAwarded || 0, 12)}
                  ${createScoreBar('Skills & Tools', analysis.skills_certifications?.score?.skillsMatchPercentage || 0, analysis.skills_certifications?.score?.skillsPointsAwarded || 0, 9)}
                  ${createScoreBar('Resume Structure', (analysis.resume_structure?.score?.pointsAwarded || 0) / 12 * 100, analysis.resume_structure?.score?.pointsAwarded || 0, 12)}
                  ${createScoreBar('Action Words', analysis.action_words?.score?.actionVerbPercentage || 0, analysis.action_words?.score?.pointsAwarded || 0, 10)}
                  ${createScoreBar('Measurable Results', (analysis.measurable_results?.score?.pointsAwarded || 0) / 10 * 100, analysis.measurable_results?.score?.pointsAwarded || 0, 10)}
                  ${createScoreBar('Bullet Points', analysis.bullet_point_effectiveness?.score?.effectiveBulletPercentage || 0, analysis.bullet_point_effectiveness?.score?.pointsAwarded || 0, 8)}
                `
              }} />
            </div>
          </div>
        );

      case 'keyword':
        const keywordAnalysis = analysis.keyword_match?.analysis || {};
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
              {createMatchedList(keywordAnalysis.matchedKeywords)}
              
              <h4>Missing Keywords</h4>
              {createMissingList(keywordAnalysis.missingKeywords)}
              
              <div className="improvement-suggestions">
                <h4>Suggestions</h4>
                <p>{keywordAnalysis.suggestedImprovements || 'No suggestions available'}</p>
              </div>
            </div>
          </div>
        );

      case 'experience':
        const experienceAnalysis = analysis.job_experience?.analysis || {};
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
              {createExperienceList(experienceAnalysis.strongMatches, 'matched')}
              
              <h4>Partial Matches</h4>
              {createExperienceList(experienceAnalysis.partialMatches, 'partial')}
              
              <h4>Missing Experience</h4>
              {createExperienceList(experienceAnalysis.missingExperience, 'missing')}
              
              <div className="improvement-suggestions">
                <h4>Suggestions</h4>
                <p>{experienceAnalysis.suggestedImprovements || 'No suggestions available'}</p>
              </div>
            </div>
          </div>
        );

      case 'skills':
        const skillsAnalysis = analysis.skills_certifications?.analysis || {};
        return (
          <div id="skills-content" className="tab-content">
            <h3>Skills & Certifications Analysis</h3>
            <div className="analysis-section">
              <div className="metric-summary">
                <span className="metric-label">Skills Match Percentage:</span>
                <span className="metric-value">
                  {analysis.skills_certifications?.score?.skillsMatchPercentage || 0}% 
                  ({analysis.skills_certifications?.score?.skillsRating || 'N/A'})
                </span>
              </div>
              
              <div className="metric-summary">
                <span className="metric-label">Education Match Percentage:</span>
                <span className="metric-value">
                  {analysis.skills_certifications?.score?.educationMatchPercentage || 0}% 
                  ({analysis.skills_certifications?.score?.educationRating || 'N/A'})
                </span>
              </div>
              
              <h4>Matched Skills</h4>
              {createSkillsList(skillsAnalysis.matchedSkills, 'matched')}
              
              <h4>Missing Skills</h4>
              {createSkillsList(skillsAnalysis.missingSkills, 'missing')}
              
              <h4>Education Requirements</h4>
              {createEducationList(skillsAnalysis.educationMatch)}
              
              <h4>Certifications</h4>
              {createCertificationsList(skillsAnalysis.certificationMatch)}
              
              <div className="improvement-suggestions">
                <h4>Suggestions</h4>
                <p>{skillsAnalysis.suggestedImprovements || 'No suggestions available'}</p>
              </div>
            </div>
          </div>
        );

      case 'structure':
        const structureAnalysis = analysis.resume_structure?.analysis || {};
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
              {createSectionsList(structureAnalysis.sectionStatus)}
              
              <div className="improvement-suggestions">
                <h4>Suggestions</h4>
                <p>{structureAnalysis.suggestedImprovements || 'No suggestions available'}</p>
              </div>
            </div>
          </div>
        );

      case 'actions':
        const actionWordsAnalysis = analysis.action_words?.analysis || {};
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
              {createActionVerbsList(actionWordsAnalysis.strongActionVerbs, 'strong')}
              
              <h4>Weak Action Verbs</h4>
              {createActionVerbsList(actionWordsAnalysis.weakActionVerbs, 'weak')}
              
              <h4>Missing Action Verbs</h4>
              {createActionVerbsList(actionWordsAnalysis.missingActionVerbs, 'missing')}
              
              <div className="improvement-suggestions">
                <h4>Suggestions</h4>
                <p>{actionWordsAnalysis.suggestedImprovements || 'No suggestions available'}</p>
              </div>
            </div>
          </div>
        );

      case 'results':
        const measurableResultsAnalysis = analysis.measurable_results?.analysis || {};
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
              {createMeasurableResultsList(measurableResultsAnalysis.measurableResults)}
              
              <h4>Opportunities for Metrics</h4>
              {createOpportunitiesList(measurableResultsAnalysis.opportunitiesForMetrics)}
              
              <div className="improvement-suggestions">
                <h4>Suggestions</h4>
                <p>{measurableResultsAnalysis.suggestedImprovements || 'No suggestions available'}</p>
              </div>
            </div>
          </div>
        );

      case 'bullets':
        const bulletAnalysis = analysis.bullet_point_effectiveness?.analysis || {};
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
              {createBulletPointsList(bulletAnalysis.effectiveBullets, 'effective')}
              
              <h4>Ineffective Bullet Points</h4>
              {createBulletPointsList(bulletAnalysis.ineffectiveBullets, 'ineffective')}
              
              <div className="improvement-suggestions">
                <h4>Suggestions</h4>
                <p>{bulletAnalysis.suggestedImprovements || 'No suggestions available'}</p>
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