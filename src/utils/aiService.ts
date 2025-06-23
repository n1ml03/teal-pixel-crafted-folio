import { AIConfiguration, AIPromptTemplate } from '@/contexts/AIConfigContext';

export interface TestCase {
  id: string;
  title: string;
  description: string;
  preconditions: string[];
  steps: string[];
  expectedResults: string[];
  priority: 'High' | 'Medium' | 'Low';
  type: string;
  category: string;
  estimatedTime: number;
  testData: string;
  tags: string[];
}

export interface TestCasesResponse {
  testCases: TestCase[];
}

export interface CodeIssue {
  id: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  category: 'Quality' | 'Performance' | 'Security' | 'BestPractices';
  title: string;
  description: string;
  lineNumbers: number[];
  currentCode: string;
  suggestedFix: string;
  explanation: string;
}

export interface CodeAnalysisResponse {
  summary: {
    totalIssues: number;
    criticalIssues: number;
    qualityScore: number;
    recommendation: string;
  };
  issues: CodeIssue[];
}

export interface AIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    model: string;
    tokens: number;
    responseTime: number;
    timestamp: string;
  };
}

export interface AICallOptions {
  template?: AIPromptTemplate;
  variables?: Record<string, string>;
  systemPrompt?: string;
  maxRetries?: number;
  timeout?: number;
  stream?: boolean;
}

class AIService {
  private config: AIConfiguration;

  constructor(config: AIConfiguration) {
    this.config = config;
  }

  updateConfig(config: AIConfiguration) {
    this.config = config;
  }

  /**
   * Build prompt from template and variables
   */
  private buildPrompt(template: AIPromptTemplate, variables: Record<string, string>): string {
    let prompt = template.template;
    
    // Add custom prefix if configured
    if (this.config.customPromptPrefix) {
      prompt = this.config.customPromptPrefix + '\n\n' + prompt;
    }

    // Replace variables
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`\\{${key}\\}`, 'g');
      prompt = prompt.replace(regex, value);
    });

    // Add custom suffix if configured
    if (this.config.customPromptSuffix) {
      prompt = prompt + '\n\n' + this.config.customPromptSuffix;
    }

    return prompt;
  }

  /**
   * Validate AI response based on expected format
   */
  private validateResponse(response: string, expectedFormat: 'json' | 'markdown' | 'plain' | 'structured' = 'json'): boolean {
    if (!this.config.validateResponses) return true;

    try {
      switch (expectedFormat) {
        case 'json':
          JSON.parse(response);
          return true;
        case 'structured':
          // Structured format should be valid JSON with specific structure
          JSON.parse(response);
          return true;
        case 'markdown':
          return response.includes('#') || response.includes('*') || response.includes('-');
        case 'plain':
          return response.length > 0;
        default:
          return true;
      }
    } catch {
      return false;
    }
  }

  /**
   * Parse JSON response with error handling
   */
  private parseJSONResponse(response: string): unknown {
    try {
      // Try to parse the entire response as JSON
      return JSON.parse(response);
    } catch (error) {
      // If that fails, try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch {
          // If extraction fails, return a structured error
          return {
            error: 'Failed to parse JSON response',
            raw_response: response
          };
        }
      }
      
      // If no JSON found, return the raw response wrapped in an object
      return {
        content: response,
        format: 'text'
      };
    }
  }

  /**
   * Make API call to configured AI endpoint
   */
  async callAI<T = unknown>(
    prompt: string,
    options: AICallOptions = {}
  ): Promise<AIResponse<T>> {
    if (!this.config.useAI || !this.config.apiKey || !this.config.apiEndpoint) {
      return {
        success: false,
        error: 'AI is not configured or disabled'
      };
    }

    const startTime = Date.now();
    const maxRetries = options.maxRetries ?? this.config.maxRetries;
    const timeout = options.timeout ?? this.config.timeout;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        // Build system prompt
        let systemPrompt = options.systemPrompt || 'You are a helpful AI assistant specialized in software testing and quality assurance.';
        
        if (this.config.qualityLevel === 'enterprise') {
          systemPrompt += ' Provide enterprise-grade analysis with detailed explanations and best practices.';
        } else if (this.config.qualityLevel === 'premium') {
          systemPrompt += ' Provide comprehensive analysis with detailed recommendations.';
        }

        // Prepare request body based on provider
        const requestBody = this.buildRequestBody(prompt, systemPrompt);

        const response = await fetch(this.config.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiKey}`,
            ...(this.config.selectedModel.startsWith('claude') && {
              'anthropic-version': '2023-06-01'
            })
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        const aiResponse = this.extractResponseContent(result);
        const responseTime = Date.now() - startTime;

        // Validate response if enabled
        if (this.config.validateResponses && !this.validateResponse(aiResponse, this.config.outputFormat)) {
          throw new Error('Response validation failed');
        }

        // Parse response based on expected format
        let parsedData: T;
        if (this.config.outputFormat === 'json') {
          parsedData = this.parseJSONResponse(aiResponse) as T;
        } else {
          parsedData = aiResponse as T;
        }

        return {
          success: true,
          data: parsedData,
          metadata: {
            model: this.config.selectedModel,
            tokens: this.estimateTokens(prompt + aiResponse),
            responseTime,
            timestamp: new Date().toISOString()
          }
        };

      } catch (error: any) {
        if (attempt === maxRetries) {
          return {
            success: false,
            error: `AI call failed after ${maxRetries + 1} attempts: ${error.message}`
          };
        }
        
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }

    return {
      success: false,
      error: 'Unexpected error occurred'
    };
  }

  /**
   * Build request body based on AI provider
   */
  private buildRequestBody(prompt: string, systemPrompt: string): Record<string, unknown> {
    const baseBody = {
      max_tokens: this.config.maxTokens,
      temperature: this.config.temperature,
      stream: this.config.enableStreaming
    };

    if (this.config.selectedModel.startsWith('gpt')) {
      return {
        model: this.config.selectedModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        ...baseBody
      };
    } else if (this.config.selectedModel.startsWith('claude')) {
      return {
        model: this.config.selectedModel,
        messages: [
          { role: 'user', content: `${systemPrompt}\n\n${prompt}` }
        ],
        ...baseBody
      };
    } else if (this.config.selectedModel.startsWith('gemini')) {
      return {
        model: this.config.selectedModel,
        contents: [
          {
            parts: [
              { text: `${systemPrompt}\n\n${prompt}` }
            ]
          }
        ],
        generationConfig: {
          maxOutputTokens: this.config.maxTokens,
          temperature: this.config.temperature
        }
      };
    }

    // Default format (OpenAI compatible)
    return {
      model: this.config.selectedModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      ...baseBody
    };
  }

  /**
   * Extract response content based on provider format
   */
  private extractResponseContent(result: Record<string, unknown>): string {
    // OpenAI format
    if (result.choices && result.choices[0] && result.choices[0].message) {
      return result.choices[0].message.content;
    }

    // Claude format
    if (result.content && result.content[0] && result.content[0].text) {
      return result.content[0].text;
    }

    // Gemini format
    if (result.candidates && result.candidates[0] && result.candidates[0].content) {
      return result.candidates[0].content.parts[0].text;
    }

    // Fallback - try to find any text content
    if (typeof result === 'string') {
      return result;
    }

    return JSON.stringify(result);
  }

  /**
   * Estimate token count (rough approximation)
   */
  private estimateTokens(text: string): number {
    // Rough estimation: 1 token ≈ 4 characters for English text
    return Math.ceil(text.length / 4);
  }

  /**
   * Generate test cases using AI
   */
  async generateTestCases(
    requirements: string,
    options: {
      framework?: string;
      testTypes?: string[];
      maxTestCases?: number;
      qualityLevel?: string;
    } = {}
  ): Promise<AIResponse<TestCasesResponse>> {
    const template = {
      id: 'test-generation',
      name: 'Test Case Generation',
      description: 'Generate comprehensive test cases',
      category: 'testing' as const,
      template: `Generate comprehensive test cases for the following requirements:

REQUIREMENTS:
{requirements}

CONTEXT:
- Framework: {framework}
- Test Types: {testTypes}
- Quality Level: {qualityLevel}
- Max Test Cases: {maxTestCases}

Generate test cases that include:
1. Happy path scenarios
2. Edge cases and boundary conditions
3. Error handling and negative scenarios
4. Performance considerations (if applicable)
5. Security aspects (if applicable)

Return JSON format:
{
  "testCases": [
    {
      "id": "unique_id",
      "title": "test_title",
      "description": "detailed_description",
      "preconditions": ["prerequisite1", "prerequisite2"],
      "steps": ["step1", "step2", "step3"],
      "expectedResults": ["result1", "result2"],
      "priority": "High|Medium|Low",
      "type": "test_type",
      "category": "category",
      "estimatedTime": minutes,
      "testData": "test_data_description",
      "tags": ["tag1", "tag2"]
    }
  ]
}`,
      variables: ['requirements', 'framework', 'testTypes', 'qualityLevel', 'maxTestCases']
    };

    const variables = {
      requirements,
      framework: options.framework || 'Traditional',
      testTypes: options.testTypes?.join(', ') || 'Functional',
      qualityLevel: options.qualityLevel || this.config.qualityLevel,
      maxTestCases: (options.maxTestCases || 20).toString()
    };

    const prompt = this.buildPrompt(template, variables);
    return this.callAI(prompt, { template });
  }

  /**
   * Analyze code for review
   */
  async analyzeCode(
    code: string,
    options: {
      language?: string;
      focusAreas?: string[];
      qualityLevel?: string;
    } = {}
  ): Promise<AIResponse<CodeAnalysisResponse>> {
    const template = {
      id: 'code-analysis',
      name: 'Code Analysis',
      description: 'Analyze code for quality and issues',
      category: 'code-review' as const,
      template: `Analyze the following code for quality, security, and performance issues:

CODE:
{code}

LANGUAGE: {language}
QUALITY LEVEL: {qualityLevel}
FOCUS AREAS: {focusAreas}

Provide comprehensive analysis covering:
1. Code Quality: Structure, readability, maintainability
2. Performance: Optimization opportunities, bottlenecks
3. Security: Vulnerabilities, best practices
4. Best Practices: Conventions, patterns, standards

Return JSON format:
{
  "summary": {
    "totalIssues": number,
    "criticalIssues": number,
    "qualityScore": number,
    "recommendation": "string"
  },
  "issues": [
    {
      "id": "issue_id",
      "severity": "Critical|High|Medium|Low",
      "category": "Quality|Performance|Security|BestPractices",
      "title": "issue_title",
      "description": "detailed_description",
      "lineNumbers": [1, 2, 3],
      "currentCode": "problematic_code",
      "suggestedFix": "improved_code",
      "explanation": "why_this_matters"
    }
  ]
}`,
      variables: ['code', 'language', 'qualityLevel', 'focusAreas']
    };

    const variables = {
      code,
      language: options.language || 'javascript',
      qualityLevel: options.qualityLevel || this.config.qualityLevel,
      focusAreas: options.focusAreas?.join(', ') || 'all areas'
    };

    const prompt = this.buildPrompt(template, variables);
    return this.callAI(prompt, { template });
  }

  /**
   * Analyze bug report
   */
  async analyzeBugReport(
    bugReport: string,
    options: {
      environment?: string;
      platform?: string;
      version?: string;
    } = {}
  ): Promise<AIResponse<Record<string, unknown>>> {
    const template = {
      id: 'bug-analysis',
      name: 'Bug Analysis',
      description: 'Analyze bug reports and suggest solutions',
      category: 'bug-analysis' as const,
      template: `Analyze the following bug report and provide comprehensive guidance:

BUG REPORT:
{bugReport}

SYSTEM INFO:
- Environment: {environment}
- Platform: {platform}
- Version: {version}

Provide analysis including:
1. Severity Assessment
2. Root Cause Analysis
3. Reproduction Steps
4. Investigation Plan
5. Prevention Measures

Return JSON format with detailed analysis and recommendations.`,
      variables: ['bugReport', 'environment', 'platform', 'version']
    };

    const variables = {
      bugReport,
      environment: options.environment || 'production',
      platform: options.platform || 'web',
      version: options.version || 'latest'
    };

    const prompt = this.buildPrompt(template, variables);
    return this.callAI(prompt, { template });
  }

  /**
   * Generate API tests
   */
  async generateAPITests(
    apiSpec: string,
    options: {
      endpoint?: string;
      method?: string;
      authType?: string;
    } = {}
  ): Promise<AIResponse<Record<string, unknown>>> {
    const template = {
      id: 'api-testing',
      name: 'API Test Generation',
      description: 'Generate comprehensive API test cases',
      category: 'api-testing' as const,
      template: `Generate comprehensive API test cases for:

API SPECIFICATION:
{apiSpec}

ENDPOINT: {endpoint}
METHOD: {method}
AUTHENTICATION: {authType}

Generate test cases covering:
1. Happy Path scenarios
2. Authentication testing
3. Input validation
4. Error handling
5. Performance testing
6. Security testing

Return JSON format with detailed test scenarios.`,
      variables: ['apiSpec', 'endpoint', 'method', 'authType']
    };

    const variables = {
      apiSpec,
      endpoint: options.endpoint || '/api/endpoint',
      method: options.method || 'GET',
      authType: options.authType || 'Bearer Token'
    };

    const prompt = this.buildPrompt(template, variables);
    return this.callAI(prompt, { template });
  }
}

// Export singleton instance
let aiServiceInstance: AIService | null = null;

export const createAIService = (config: AIConfiguration): AIService => {
  if (!aiServiceInstance) {
    aiServiceInstance = new AIService(config);
  } else {
    aiServiceInstance.updateConfig(config);
  }
  return aiServiceInstance;
};

export const getAIService = (): AIService | null => {
  return aiServiceInstance;
};

export default AIService; 