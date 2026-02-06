/*********************************
 * 🦙 Post-o-llama By BerserkiKun
 * Postman v10+ supported
 * Location: API → Scripts → Post-response
 *********************************/

class PostOLlamaAnalyzer {
    constructor() {
        this.scriptStartTime = Date.now();
        this.apiContext = null;
        this.warnings = {
            auth: '',
            headers: '',
            performance: '✅ Response time is healthy.'
        };
        this.metrics = {
            scriptRuntime: 0,
            totalProcessingTime: 0
        };
    }

    // ================================
    // 1. Validation & Initialization
    // ================================

    validateEnvironment() {
        if (!pm.response) {
            this.renderError('No API response received.');
            return false;
        }
        return true;
    }

    // ================================
    // 2. Response Processing
    // ================================

    parseResponseBody() {
        try {
            return pm.response.json();
        } catch (e) {
            return pm.response.text();
        }
    }

    // ================================
    // 3. Context Building
    // ================================

    buildApiContext() {
        const request = pm.request;
        const response = pm.response;
        
        this.apiContext = {
            method: request.method,
            url: request.url.toString(),
            headers: this.processHeaders(request.headers.toObject()), // Must remain enable
            query: request.url.query?.toObject() || {}, //Optional
            requestBody: request.body ? request.body.toString() : null, //Optional
            status: response.code, // Must remain enable
            responseTimeMs: response.responseTime, // Must remain enable
            response: this.parseResponseBody() //Optional
        };
    }

    processHeaders(headers) {
        // Create a copy to avoid mutating original
        const processedHeaders = { ...headers };
        
        // Mask sensitive headers
        const sensitiveHeaders = ['authorization', 'Authorization', 'x-api-key', 'X-API-Key', 'cookie', 'Cookie'];
        sensitiveHeaders.forEach(header => {
            if (processedHeaders[header]) {
                processedHeaders[header] = '****masked****';
            }
        });
        
        return processedHeaders;
    }

    // ================================
    // 4. Security Analysis
    // ================================

    hasAuthentication(headers) {
        const authIndicators = [
            'authorization',
            'Authorization',
            'x-api-key',
            'X-API-Key',
            'cookie',
            'Cookie'
        ];
        
        return authIndicators.some(indicator => headers[indicator]);
    }

    analyzeSecurity() {
        // Authentication check
        if (!this.hasAuthentication(this.apiContext.headers)) {
            this.warnings.auth = '🚨 No authentication detected for this API.';
        }

        // Response headers check
        const responseHeaders = pm.response.headers.toObject();
        const requiredHeaders = [
            'Content-Security-Policy',
            'Strict-Transport-Security',
            'X-Content-Type-Options',
            'X-Frame-Options',
            'Referrer-Policy',
            'Permissions-Policy'
        ];

        const missingHeaders = requiredHeaders.filter(
            header => !responseHeaders[header]
        );

        if (missingHeaders.length > 0) {
            this.warnings.headers = `🚨 ${missingHeaders.join(', ')}`;
        } else {
            this.warnings.headers = '✅ Standard response headers present.';
        }
    }

    // ================================
    // 5. Performance Analysis
    // ================================

    analyzePerformance() {
        const responseTime = this.apiContext.responseTimeMs;
        
        if (responseTime > 2000) {
            this.warnings.performance = '🚨 Very slow endpoint detected (>2000ms)';
        } else if (responseTime > 800) {
            this.warnings.performance = '🔻 Slow endpoint detected (>800ms)';
        }
    }

    // ================================
    // 6. AI Integration
    // ================================

    buildPrompt() {
        return `
        You are a Senior QA Engineer and API Test Analyst mentoring a trainee tester.
        I will provide an API endpoint and context. Based on that, generate comprehensive test cases for the following categories:

        1. Functional Testing
        2. Negative Testing
        3. Edge / Boundary Testing
        4. Basic Security Checks
        5. Basic Performance Observations

        Requirements (MUST MET)
        1. Provide EXACTLY 10 UNIQUE and valid test cases for EACH category.
        2. Test cases must be realistic, practical, and executable in tools like Postman.
        3. Avoid duplicates or trivial variations.

        Test Case Format -
        Each test case must include:
        1. Test Case Name
        2. Test Scenario / Objective
        3. Preconditions (if applicable)
        4. Test Steps
        5. Request Data / Input
        6. Expected Result
        7. Priority (Low / Medium / High)

        Additional Instructions
        1. Consider common API behaviors such as:
        1.1. Status codes
        1.2. Validation rules
        1.3. Authentication
        1.4. Error handling
        1.5. Data integrity

        2. Assume the tester is a beginner, so explanations should be clear and practical.
        3. If any assumptions are made about the API behavior, state them clearly before the test cases.

        Return the result grouped by testing category with clear headings.

        ${JSON.stringify(this.apiContext, null, 2)}`;
    }

    async callOllama() {
        const prompt = this.buildPrompt();
        
        try {
            const requestConfig = {
                url: 'http://localhost:11434/api/generate',
                method: 'POST',
                header: { 'Content-Type': 'application/json' },
                body: {
                    mode: 'raw',
                    raw: JSON.stringify({
                        model: 'qwen2.5-coder:7b',
                        prompt: prompt,
                        stream: false
                    })
                }
            };

            return new Promise((resolve, reject) => {
                pm.sendRequest(requestConfig, (err, res) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    
                    try {
                        const aiOutput = res.json()?.response || 'No AI output received.';
                        resolve(aiOutput);
                    } catch (parseError) {
                        reject(new Error('Failed to parse Ollama response'));
                    }
                });
            });
        } catch (error) {
            throw new Error(`Ollama call failed: ${error.message}`);
        }
    }

    // ================================
    // 7. Visualization
    // ================================

    renderError(message) {
        pm.visualizer.set(`
            <h2>🦙 Post-o-llama</h2>
            <p>${message}</p>
            <p>Author:</p><a href='https://github.com/berserkikun'>BerserkiKun</a>
        `);
    }

    calculateMetrics() {
        const scriptEndTime = Date.now();
        this.metrics.scriptRuntime = scriptEndTime - this.scriptStartTime;
        this.metrics.totalProcessingTime = this.apiContext.responseTimeMs + this.metrics.scriptRuntime;
    }

    generateVisualization(aiOutput) {
        const styles = `
            <style>
                body {
                    font-family: Inter, Arial, sans-serif;
                    padding: 16px;
                    background: #0f172a;
                    color: #e5e7eb;
                }
                pre {
                    background: #1e293b;
                    color: #e5e7eb;
                    padding: 14px;
                    border-radius: 8px;
                    white-space: pre-wrap;
                    line-height: 1.45;
                    overflow-x: auto;
                }
                .metric {
                    margin-bottom: 8px;
                    padding: 8px 12px;
                    background: #2d3748;
                    color: #ffffff;
                    border-radius: 6px;
                    border-left: 3px solid #10b981;
                }
                .metric b {
                    color: #ffffff;
                    min-width: 160px;
                    display: inline-block;
                }
                .metric-warning {
                    border-left-color: #f59e0b;
                }
                .metric-error {
                    border-left-color: #ef4444;
                }
                h2 {
                    color: #60a5fa;
                    margin-bottom: 20px;
                }
                hr {
                    border: none;
                    height: 1px;
                    background: #374151;
                    margin: 20px 0;
                }
                .author-note {
                    font-size: 0.9em;
                    color: #9ca3af;
                    margin-top: 20px;
                }
                .ai-output {
                    margin-top: 20px;
                }
            </style>
        `;

        const getMetricClass = (warning) => {
            if (warning.includes('🚨')) return 'metric-error';
            if (warning.includes('🔻')) return 'metric-warning';
            return '';
        };

        const html = `
            ${styles}
            <h2>🦙 Post-o-llama Analysis</h2>

            <div class="metric ${getMetricClass(this.warnings.performance)}">
                <b>Endpoint:</b> ${this.apiContext.method} ${this.apiContext.url}
            </div>
            <div class="metric">
                <b>Status:</b> ${this.apiContext.status}
            </div>
            <div class="metric ${getMetricClass(this.warnings.performance)}">
                <b>API Latency:</b> ${this.apiContext.responseTimeMs} ms | ${this.warnings.performance}
            </div>
            <div class="metric">
                <b>Script Runtime:</b> ${this.metrics.totalProcessingTime} ms
            </div>
            <div class="metric ${this.warnings.auth ? 'metric-error' : ''}">
                <b>Security:</b> ${this.warnings.auth || '✅ Authentication detected.'}
            </div>
            <div class="metric ${this.warnings.headers.includes('🚨') ? 'metric-error' : ''}">
                <b>Missing Headers:</b> ${this.warnings.headers}
            </div>

            <hr>

            <div class="ai-output">
                <h3>🤖 AI Analysis:</h3>
                <pre>${aiOutput}</pre>
            </div>

            <div class="author-note">
                Author: BerserkiKun | https://github.com/berserkikun
            </div>
        `;

        pm.visualizer.set(html);
    }

    // ================================
    // 8. Main Execution Flow
    // ================================

    async execute() {
        // Step 1: Validate environment
        if (!this.validateEnvironment()) {
            return;
        }

        // Step 2: Build API context
        this.buildApiContext();

        // Step 3: Perform analysis
        this.analyzeSecurity();
        this.analyzePerformance();

        // Step 4: Call Ollama for AI analysis - Stateless connection
        try {
            const aiOutput = await this.callOllama();
            
            // Step 5: Calculate final metrics
            this.calculateMetrics();
            
            // Step 6: Generate visualization
            this.generateVisualization(aiOutput);
            
        } catch (error) {
            this.calculateMetrics();
            pm.visualizer.set(`
                <h2>🦙 Post-o-llama</h2>
                <p>❌ Ollama is not reachable. Is it running?</p>
                <p><b>Response time:</b> ${this.metrics.totalProcessingTime} ms</p>
                <p><b>Error:</b> ${error.message}</p>
            `);
        }
    }
}

// ================================
// 9. Script Entry Point
// ================================

// Initialize and execute the analyzer
const analyzer = new PostOLlamaAnalyzer();

// Use Promise-based execution for better async handling
(async () => {
    await analyzer.execute();
})();