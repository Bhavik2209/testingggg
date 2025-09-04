# IntrvuFit Chrome Extension

A Chrome extension that helps optimize your resume by analyzing it against LinkedIn job descriptions to improve your job application success rate.

## Features

- **Resume Upload**: Upload your PDF resume (max 3MB)
- **LinkedIn Job Extraction**: Automatically extract job details from LinkedIn job posting pages
- **AI-Powered Analysis**: Get detailed feedback on how well your resume matches the job requirements
- **Comprehensive Feedback**: Receive actionable insights to improve your resume

## Installation

1. Clone this repository
2. Navigate to the `frontend_react` directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Build the extension:
   ```bash
   npm run build
   ```
5. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `build` folder from this project

## Usage

### Step 1: Navigate to a Specific LinkedIn Job Posting
- Go to a specific LinkedIn job posting page with job description (e.g., `https://www.linkedin.com/jobs/collections/recommended/?currentJobId=4295009674`)
- Make sure you're on the actual job description page, not the general jobs listing (`https://www.linkedin.com/jobs/`)
- The URL should contain either `currentJobId=` or `/view/` to indicate a specific job

### Step 2: Open the Extension
- Click on the IntrvuFit extension icon in your Chrome toolbar
- The extension will automatically detect if you're on a LinkedIn job page

### Step 3: Job Details Extraction
- Job details are automatically extracted when you open the extension on a LinkedIn job page:
  - Job title
  - Company name
  - Location
  - Full job description
  - Additional job information (work mode, job type, etc.)

### Step 4: Upload Your Resume
- Upload your PDF resume (must be under 3MB)
- The extension will validate the file format and size

### Step 5: Analyze Job Match
- Once both job details and resume are ready, click "Analyze Job Match"
- The extension will send your resume and the job description to our AI analysis service
- Receive comprehensive feedback on your resume's match with the job requirements

## How It Works

### LinkedIn Job Extraction
The extension automatically detects when you're on a LinkedIn job posting page and uses advanced DOM selectors to extract job information. It automatically detects:

- **Job Title**: Multiple selector fallbacks to ensure reliable extraction
- **Company Name**: Company information from various page elements
- **Location**: Job location details
- **Job Description**: Full job description text using multiple selector strategies
- **Additional Info**: Work mode (Remote/On-site/Hybrid), job type, company details

### Resume Analysis
Your resume and the extracted job description are analyzed using AI to provide:

- Keyword matching analysis
- Skills relevance assessment
- Experience alignment evaluation
- Actionable improvement suggestions

## Technical Details

- **Frontend**: React.js with modern CSS
- **Chrome Extension**: Manifest V3 with content script injection
- **Permissions**: `activeTab` and `scripting` for DOM access
- **Host Permissions**: LinkedIn domains for job page access

## Troubleshooting

### Job Details Not Extracting
- Ensure you're on a specific LinkedIn job posting page (URL should contain `currentJobId=` or `/view/`)
- Avoid general job listing pages like `https://www.linkedin.com/jobs/`
- Look for URLs like `https://www.linkedin.com/jobs/collections/recommended/?currentJobId=4295009674`
- Refresh the page and reopen the extension
- Check if the page has fully loaded the job description
- The extension automatically extracts when opened on a specific LinkedIn job page

### Extension Not Working
- Verify the extension is properly loaded in Chrome
- Check Chrome's developer console for any error messages
- Ensure you have the necessary permissions enabled

### Resume Upload Issues
- Verify the file is a PDF format
- Check that the file size is under 3MB
- Try refreshing the extension popup

## Development

### Project Structure
```
frontend_react/
├── src/
│   ├── components/
│   │   ├── LinkedInJobExtractor.js    # LinkedIn job extraction logic
│   │   ├── UploadSection.js           # Resume upload component
│   │   ├── SubmitSection.js           # Analysis submission
│   │   └── ...                        # Other components
│   ├── App.js                         # Main application component
│   └── App.css                        # Main styles
├── build/                             # Built extension files
├── manifest.json                      # Extension manifest
└── package.json                       # Dependencies
```

### Building for Development
```bash
npm start          # Start development server
npm run build      # Build production extension
npm run eject      # Eject from Create React App (not recommended)
```

### Testing the Extension
1. Build the extension: `npm run build`
2. Load the `build` folder in Chrome extensions
3. Navigate to a LinkedIn job posting
4. Test the extraction functionality
5. Test with different job posting formats

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository or contact the development team.
