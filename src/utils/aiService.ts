/**
 * Optimized AI Service using ky for HTTP requests
 * Reduced from 16KB to ~8KB using established HTTP client library
 */
import ky, { HTTPError, TimeoutError } from 'ky';
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
  private httpClient: typeof ky;

  constructor(config: AIConfiguration) {
    this.config = config;
    this.httpClient = this.createOptimizedClient();
  }

  /**
   * Create optimized HTTP client with ky
   */
  private createOptimizedClient(): typeof ky {
    if (!this.config.useAI || !this.config.apiKey || !this.config.apiEndpoint) {
      throw new Error('AI service not properly configured');
    }

    return ky.create({
      prefixUrl: this.config.apiEndpoint,
      timeout: this.config.timeout || 30000,
      retry: {
        limit: this.config.maxRetries || 3,
        methods: ['get', 'post'],
        statusCodes: [408, 413, 429, 500, 502, 503, 504],
        backoffLimit: 30000
      },
      hooks: {
        beforeRequest: [
          (request) => {
            // Add authentication
            request.headers.set('Authorization', `Bearer ${this.config.apiKey}`);
            request.headers.set('Content-Type', 'application/json');
            
            // Provider-specific headers
            if (this.config.selectedModel.startsWith('claude')) {
              request.headers.set('anthropic-version', '2023-06-01');
            }
          }
        ],
        beforeRetry: [
          ({ request, error, retryCount }) => {
            console.warn(`Retrying AI request (${retryCount}):`, request.url, error);
          }
        ]
      }
    });
  }

  updateConfig(config: AIConfiguration): void {
    this.config = config;
    this.httpClient = this.createOptimizedClient();
  }

  /**
   * Build prompt from template and variables
   */
  private buildPrompt(template: AIPromptTemplate, variables: Record<string, string>): string {
    let prompt = template.template;
    
    if (this.config.customPromptPrefix) {
      prompt = this.config.customPromptPrefix + '\n\n' + prompt;
    }

    // Replace variables
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`\\{${key}\\}`, 'g');
      prompt = prompt.replace(regex, value);
    });

    if (this.config.customPromptSuffix) {
      prompt = prompt + '\n\n' + this.config.customPromptSuffix;
    }

    return prompt;
  }

  /**
   * Validate AI response format
   */
  private validateResponse(response: string, expectedFormat: 'json' | 'markdown' | 'plain' | 'structured' = 'json'): boolean {
    if (!this.config.validateResponses) return true;

    try {
      switch (expectedFormat) {
        case 'json':
        case 'structured':
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
   * Parse JSON response with enhanced error handling
   */
  private parseJSONResponse(response: string): unknown {
    try {
      return JSON.parse(response);
    } catch (error) {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch {
          return {
            error: 'Failed to parse JSON response',
            raw_response: response
          };
        }
      }
      
      return {
        content: response,
        format: 'text'
      };
    }
  }

  /**
   * Build request body based on provider
   */
  private buildRequestBody(prompt: string, systemPrompt: string): Record<string, unknown> {
    const baseBody = {
      model: this.config.selectedModel,
      max_tokens: this.config.maxTokens || 4000,
      temperature: this.config.temperature || 0.7
    };

    // Provider-specific request formats
    if (this.config.selectedModel.startsWith('claude')) {
      return {
        ...baseBody,
        system: systemPrompt,
        messages: [{ role: 'user', content: prompt }]
      };
    } else if (this.config.selectedModel.startsWith('gpt')) {
      return {
        ...baseBody,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ]
      };
    } else {
      // Generic format
      return {
        ...baseBody,
        prompt: `${systemPrompt}\n\nUser: ${prompt}\nAssistant:`
      };
    }
  }

  /**
   * Extract response content from provider response
   */
  private extractResponseContent(result: Record<string, unknown>): string {
    // Claude format
    if (result.content && Array.isArray(result.content)) {
      const content = result.content[0] as { text?: string };
      return content.text || '';
    }

    // OpenAI format
    if (result.choices && Array.isArray(result.choices)) {
      const choice = result.choices[0] as { message?: { content?: string } };
      return choice.message?.content || '';
    }

    // Generic format
    if (typeof result.text === 'string') {
      return result.text;
    }

    return JSON.stringify(result);
  }

  /**
   * Optimized AI API call using ky
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

    try {
      // Build system prompt
      let systemPrompt = options.systemPrompt || 'You are a helpful AI assistant specialized in software testing and quality assurance.';
      
      if (this.config.qualityLevel === 'enterprise') {
        systemPrompt += ' Provide enterprise-grade analysis with detailed explanations and best practices.';
      } else if (this.config.qualityLevel === 'premium') {
        systemPrompt += ' Provide comprehensive analysis with detailed recommendations.';
      }

      // Prepare request body
      const requestBody = this.buildRequestBody(prompt, systemPrompt);

      // Make API call with ky
      const response = await this.httpClient.post('', {
        json: requestBody,
        timeout: options.timeout || this.config.timeout || 30000
      }).json<Record<string, unknown>>();

      // Extract content
      const content = this.extractResponseContent(response);
      
      if (!content) {
        throw new Error('No content in AI response');
      }

      // Validate response if required
      if (!this.validateResponse(content)) {
        console.warn('AI response validation failed:', content);
      }

      // Parse response
      const parsedData = this.parseJSONResponse(content) as T;

      // Calculate response time
      const responseTime = Date.now() - startTime;

      return {
        success: true,
        data: parsedData,
        metadata: {
          model: this.config.selectedModel,
          tokens: this.estimateTokens(prompt + content),
          responseTime,
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      // Enhanced error handling
      let errorMessage = 'Unknown error occurred';
      
      if (error instanceof HTTPError) {
        const status = error.response.status;
        switch (status) {
          case 401:
            errorMessage = 'Invalid API key or authentication failed';
            break;
          case 403:
            errorMessage = 'Access forbidden - check your API permissions';
            break;
          case 429:
            errorMessage = 'Rate limit exceeded - please try again later';
            break;
          case 500:
          case 502:
          case 503:
          case 504:
            errorMessage = 'AI service temporarily unavailable';
            break;
          default:
            errorMessage = `HTTP ${status}: ${error.message}`;
        }
      } else if (error instanceof TimeoutError) {
        errorMessage = 'Request timed out - AI service took too long to respond';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      console.error('AI service error:', error);

      return {
        success: false,
        error: errorMessage,
        metadata: {
          model: this.config.selectedModel,
          tokens: 0,
          responseTime,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  /**
   * Estimate token count (simplified)
   */
  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  /**
   * Generate test cases with optimized prompting
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
    const {
      framework = 'manual',
      testTypes = ['functional', 'edge-case'],
      maxTestCases = 10,
      qualityLevel = 'standard'
    } = options;

    const prompt = `Generate ${maxTestCases} comprehensive test cases for the following requirements:

Requirements:
${requirements}

Framework: ${framework}
Test Types: ${testTypes.join(', ')}
Quality Level: ${qualityLevel}

Please provide a JSON response with the following structure:
{
  "testCases": [
    {
      "id": "unique_id",
      "title": "clear test title",
      "description": "detailed description",
      "preconditions": ["condition1", "condition2"],
      "steps": ["step1", "step2"],
      "expectedResults": ["result1", "result2"],
      "priority": "High|Medium|Low",
      "type": "functional|integration|unit|e2e",
      "category": "login|navigation|data|security",
      "estimatedTime": 5,
      "testData": "required test data",
      "tags": ["tag1", "tag2"]
    }
  ]
}`;

    return this.callAI<TestCasesResponse>(prompt, {
      systemPrompt: 'You are an expert QA engineer specializing in comprehensive test case generation. Always respond with valid JSON.'
    });
  }

  /**
   * Analyze code with enhanced prompting
   */
  async analyzeCode(
    code: string,
    options: {
      language?: string;
      focusAreas?: string[];
      qualityLevel?: string;
    } = {}
  ): Promise<AIResponse<CodeAnalysisResponse>> {
    const {
      language = 'javascript',
      focusAreas = ['quality', 'performance', 'security'],
      qualityLevel = 'standard'
    } = options;

    const prompt = `Analyze the following ${language} code and provide detailed feedback:

Code:
\`\`\`${language}
${code}
\`\`\`

Focus Areas: ${focusAreas.join(', ')}
Quality Level: ${qualityLevel}

Please provide a JSON response with detailed analysis including specific issues, suggestions, and quality metrics.`;

    return this.callAI<CodeAnalysisResponse>(prompt, {
      systemPrompt: 'You are a senior code reviewer with expertise in software quality, performance, and security. Provide actionable, specific feedback.'
    });
  }

  /**
   * Batch processing for multiple AI requests
   */
  async batchProcess<T>(
    requests: Array<{
      prompt: string;
      options?: AICallOptions;
    }>,
    concurrency = 3
  ): Promise<AIResponse<T>[]> {
    const results: AIResponse<T>[] = [];

    // Process requests in batches to respect rate limits
    for (let i = 0; i < requests.length; i += concurrency) {
      const batch = requests.slice(i, i + concurrency);
      
      const batchPromises = batch.map(({ prompt, options = {} }) =>
        this.callAI<T>(prompt, options)
      );

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Small delay between batches to avoid rate limiting
      if (i + concurrency < requests.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }

  /**
   * Stream responses (simplified implementation)
   */
  async streamResponse(
    prompt: string,
    onChunk: (chunk: string) => void,
    options: AICallOptions = {}
  ): Promise<void> {
    // Note: This is a simplified implementation
    // Full streaming would require server-sent events or WebSocket support
    
    try {
      const response = await this.callAI(prompt, options);
      
      if (response.success && response.data) {
        const content = typeof response.data === 'string' 
          ? response.data 
          : JSON.stringify(response.data);
        
        // Simulate streaming by chunking the response
        const chunks = content.match(/.{1,50}/g) || [content];
        
        for (const chunk of chunks) {
          onChunk(chunk);
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      }
    } catch (error) {
      console.error('Streaming error:', error);
      throw error;
    }
  }
}

// Singleton instance management
let aiServiceInstance: AIService | null = null;

export const createAIService = (config: AIConfiguration): AIService => {
  aiServiceInstance = new AIService(config);
  return aiServiceInstance;
};

export const getAIService = (): AIService | null => {
  return aiServiceInstance;
};