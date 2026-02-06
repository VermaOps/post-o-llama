[![Postman v10+](https://img.shields.io/badge/Postman-v10%2B-orange?logo=postman)](https://www.postman.com/)
[![Ollama Required](https://img.shields.io/badge/Ollama-Required-cyan)](https://ollama.ai/)

# 🦙 Post-o-llama: AI-Powered API Analysis & Test Case Generator for Postman

## 📖 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [What It Analyzes](#what-it-analyzes)
- [AI Test Case Generation](#ai-test-case-generation)
- [Visualization Dashboard](#visualization-dashboard)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Overview

**Post-o-llama** is an intelligent Postman script that automatically analyzes API request/responses and generates comprehensive test cases using local AI (Ollama). Designed for QA engineers, developers, and API testers, it transforms your Postman workflow into an AI-assisted testing environment.

### Why Post-o-llama?
- **Smart Analysis**: Automatically detects security issues, performance problems, and missing headers
- **AI-Powered Testing**: Generates 50+ structured test cases across 5 categories (Depends on your prompt)
- **Beginner Friendly**: Explains testing concepts clearly for QA engineers
- **Privacy-First**: Uses local Ollama - no API calls to external services
- **Real-time Insights**: Visual dashboard in Postman with color-coded warnings

## Features

### **Automatic API Analysis**
- **Security Scanning**: Detects missing authentication and security headers (CSP, HSTS, etc.)
- **Performance Monitoring**: Categorizes response times with actionable thresholds
- **Sensitive Data Masking**: Automatically obscures API keys and auth tokens

### **AI Test Case Generation**
- Generates **50+ test cases** across 5 categories: 
  1. **Functional Testing** (10 cases)
  2. **Negative Testing** (10 cases)
  3. **Edge/Boundary Testing** (10 cases)
  4. **Basic Security Checks** (10 cases)
  5. **Basic Performance Observations** (10 cases)
- Each test case includes:
  - Clear objective and scenario
  - Step-by-step instructions
  - Request data examples
  - Expected results
  - Priority levels (Low/Medium/High)
- Configurable with your custom prompt.

### **Visual Dashboard**
- Color-coded metrics (Green/Yellow/Red)
- Real-time performance graphs
- Security warning indicators
- Formatted AI output with syntax highlighting
- Total processing time calculations

### **Privacy & Security**
- **100% Local Processing**: Uses your local Ollama instance
- **Data Never Leaves**: All analysis happens on your machine
- **Sensitive Data Protection**: Automatically masks credentials in logs

## Installation

### Prerequisites

1. **Postman v10 or higher** ([Download](https://www.postman.com/downloads/))
2. **Ollama installed locally** ([Installation Guide](https://ollama.ai/download))
3. **AI Model**: `qwen2.5-coder:7b` (installed via Ollama)

### Step 1: Install Ollama & Model
```bash
# Install Ollama (if not already installed)
# Pull the required model
ollama pull qwen2.5-coder:7b

# Verify installation
ollama list
ollama serve
# Keep this terminal open
# Check ollama connection status at localhost:11434 in your browser. 
```

### Step 2: Set Up Postman Script

1. **Clone or download** this repository
2. Open **Postman**
3. Navigate to your **API collection** and pick a specific request
4. Go to the **"scripts"** tab in your request
5. **Copy the entire content** of `Post-o-llama.js` file, You can change the prompt as per your requirements
6. **Paste** it into the Post-response script section
7. Hit **SEND** button and script will start running.
8. Wait for it to finish the execution.
9. Once the execution is done, open **Visualizor** for AI output.
10. Review generated test cases

**Location in Postman:**
```
API Request → scripts Sub-Tab → Post-response Script Section
```

## 📊 What It Analyzes

### Security Analysis
- ✅ Authentication presence/absence
- ✅ Missing security headers:
  - Content-Security-Policy
  - Strict-Transport-Security
  - X-Content-Type-Options
  - X-Frame-Options
  - Referrer-Policy
  - Permissions-Policy
- ✅ Sensitive data exposure risks (Prompt specific only)

### Performance Analysis
- **Green (≤800ms)**: Healthy response time
- **Yellow (801-2000ms)**: Slow endpoint warning
- **Red (>2000ms)**: Critical performance issue

### API Context Capture
- Request method and URL
- Headers (with sensitive data masked)
- Query parameters
- Request body (if present)
- Response status code
- Response time
- Response body (parsed when possible) // Optional to include while Test case generation

## 🤖 AI Test Case Generation

### Prompt Structure
The AI receives a structured prompt containing:
- API context (method, URL, headers, response, etc.)
- Testing requirements and constraints
- Format specifications for test cases
- Beginner-friendly explanations

### Test Case Categories

| Category | Description | Example Focus Areas |
|----------|-------------|---------------------|
| **Functional** | Validates API works as intended | Status codes, data structure, business logic |
| **Negative** | Tests invalid/erroneous inputs | Malformed data, wrong methods, invalid auth |
| **Edge/Boundary** | Tests limits and boundaries | Min/max values, pagination limits, timeouts |
| **Security** | Basic security validations | SQLi, XSS, auth bypass, data exposure |
| **Performance** | Response time observations | Load handling, concurrent requests, timeout |

### Example Test Case Format
```
**Test Case Name**: Verify 400 on Invalid JSON
**Objective**: Ensure API rejects malformed JSON with proper error
**Preconditions**: Valid authentication token
**Test Steps**: 
1. Set Content-Type: application/json
2. Send POST with invalid JSON: `{"name": "test` (unclosed quote)
**Expected Result**: 400 Bad Request with error message
**Priority**: Medium
```

## 🎨 Visualization Dashboard
The dashboard provides:

### Metrics Panel
- **Endpoint**: Method and URL
- **Status**: HTTP status code
- **API Latency**: Response time with color coding
- **Script Runtime**: Total processing time
- **Security**: Authentication status
- **Missing Headers**: List of absent security headers

### AI Output Section
- Formatted test cases in code blocks
- Category-wise organization
- Clear headings and separation
- Copy-paste ready content

### Color Coding System
- **Green**: Healthy/All good
- **Yellow**: Warning/Needs attention
- **Red**: Critical/Must fix immediately

## ⚙️ Configuration

### Default Settings (Modifiable in Code)

```
// Performance Thresholds (ms)
if (responseTime > 2000) → "🚨 Very slow"
if (responseTime > 800) → "🔻 Slow"

// Ollama Configuration (Crucial) - Make sure URL is set to ollama only and not any malicious 3rd party site
url: 'http://localhost:11434/api/generate'
model: 'qwen2.5-coder:7b'

// Security Headers Checked
['Content-Security-Policy', 'Strict-Transport-Security', ...]

// Sensitive Headers Masked
['authorization', 'x-api-key', 'cookie', ...]
```

### Customizing the Script
1. Open `Post-o-llama.js` in a text editor
2. Modify thresholds in `analyzePerformance()` method
3. Adjust security headers in `analyzeSecurity()` method
4. Change AI model in `callOllama()` method
5. Customize styling in `generateVisualization()` method

## 🔧 Troubleshooting

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| **"Ollama is not reachable"** | Ensure Ollama is running: `ollama serve` |
| **Model not found** | Pull the model: `ollama pull qwen2.5-coder:7b` |
| **No visualization tab** | Check Postman version (needs v10+) |
| **Script errors** | Verify full script is copied (no truncation) |
| **Slow AI responses** | Try a smaller model or upgrade hardware |
| **Missing test cases** | Check AI output format in Ollama logs |

### Debugging Steps
1. **Check Ollama Status:**
   ```
   curl http://localhost:11434/api/tags
   # Should return your models
   ```

2. **Verify Postman Script:**
   - Ensure script is in "Post-response" section
   - Check for syntax errors in console (View → Developer → Show DevTools)

3. **Test Ollama Manually:**
   ```
   curl http://localhost:11434/api/generate -d '{
     "model": "qwen2.5-coder:7b",
     "prompt": "Test",
     "stream": false
   }'
   ```

### Performance Tips
- Use smaller models for faster responses
- Adjust performance thresholds based on your API standards
- Consider disabling certain analyses if not needed
- Run Ollama on GPU for better performance
- Adjust the prompt for faster analysis
- Upgrade system hardware e.g. GPU to RTX 5090

## 📁 Project Structure

```
Post-o-llama.js
├── PostOLlamaAnalyzer Class
│   ├── Constructor (Initialization)
│   ├── validateEnvironment()
│   ├── buildApiContext()
│   ├── processHeaders() - Masks sensitive data
│   ├── analyzeSecurity() - Auth & headers check
│   ├── analyzePerformance() - Response time analysis
│   ├── buildPrompt() - Creates AI instruction
│   ├── callOllama() - Calls local AI model
│   ├── calculateMetrics() - Timing calculations
│   └── generateVisualization() - HTML dashboard
├── Main Execution Flow
└── Async Entry Point
```

### Key Methods
- **`execute()`**: Main orchestrator method
- **`processHeaders()`**: Security masking for sensitive data
- **`buildPrompt()`**: Structured prompt for consistent AI output
- **`generateVisualization()`**: Creates the Postman visualizer output

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork** the repository
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

---

<div align="center">

**Built with ❤️ by [BerserkiKun](https://github.com/berserkikun)**

[![GitHub Stars](https://img.shields.io/github/stars/berserkikun/post-o-llama?style=social)](https://github.com/berserkikun/post-o-llama/stargazers)
[![GitHub Issues](https://img.shields.io/github/issues/berserkikun/post-o-llama)](https://github.com/berserkikun/post-o-llama/issues)
[![GitHub Forks](https://img.shields.io/github/forks/berserkikun/post-o-llama?style=social)](https://github.com/berserkikun/post-o-llama/network/members)

**⭐ Star this repo if you find it useful!**

</div>
