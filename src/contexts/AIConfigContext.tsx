import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface AIModel {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'google' | 'custom';
  description: string;
  maxTokens: number;
  costPer1k: number;
  capabilities: string[];
  recommended?: boolean;
}

export interface AIPromptTemplate {
  id: string;
  name: string;
  description: string;
  category: 'testing' | 'code-review' | 'bug-analysis' | 'api-testing' | 'general';
  template: string;
  variables: string[];
  examples?: string[];
}

export interface AIConfiguration {
  // API Settings
  apiEndpoint: string;
  apiKey: string;
  selectedModel: string;
  maxTokens: number;
  temperature: number;
  timeout: number;
  
  // Generation Settings
  useAI: boolean;
  maxRetries: number;
  enableStreaming: boolean;
  includeContext: boolean;
  
  // Quality Settings
  qualityLevel: 'basic' | 'standard' | 'premium' | 'enterprise';
  includeExamples: boolean;
  validateResponses: boolean;
  
  // Output Settings
  outputFormat: 'json' | 'markdown' | 'plain' | 'structured';
  includeMetrics: boolean;
  addTimestamps: boolean;
  
  // Custom Settings
  customPromptPrefix: string;
  customPromptSuffix: string;
  useCustomTemplates: boolean;
}

interface AIConfigContextType {
  config: AIConfiguration;
  updateConfig: (updates: Partial<AIConfiguration>) => void;
  resetConfig: () => void;
  models: AIModel[];
  templates: AIPromptTemplate[];
  addTemplate: (template: AIPromptTemplate) => void;
  removeTemplate: (templateId: string) => void;
  isConfigured: boolean;
  testConnection: () => Promise<boolean>;
  saveConfig: () => void;
  loadConfig: () => void;
}

const defaultConfig: AIConfiguration = {
  // API Settings
  apiEndpoint: 'https://api.openai.com/v1/chat/completions',
  apiKey: '',
  selectedModel: 'gpt-4o',
  maxTokens: 4000,
  temperature: 0.7,
  timeout: 30000,
  
  // Generation Settings
  useAI: false,
  maxRetries: 3,
  enableStreaming: false,
  includeContext: true,
  
  // Quality Settings
  qualityLevel: 'standard',
  includeExamples: true,
  validateResponses: true,
  
  // Output Settings
  outputFormat: 'json',
  includeMetrics: true,
  addTimestamps: true,
  
  // Custom Settings
  customPromptPrefix: '',
  customPromptSuffix: '',
  useCustomTemplates: false,
};

const availableModels: AIModel[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    description: 'Most advanced GPT-4 model with optimized performance',
    maxTokens: 128000,
    costPer1k: 0.03,
    capabilities: ['code-analysis', 'test-generation', 'bug-detection', 'documentation'],
    recommended: true
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'openai',
    description: 'Fast and capable GPT-4 variant',
    maxTokens: 128000,
    costPer1k: 0.01,
    capabilities: ['code-analysis', 'test-generation', 'bug-detection', 'documentation']
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'openai',
    description: 'Fast and cost-effective for basic tasks',
    maxTokens: 16385,
    costPer1k: 0.002,
    capabilities: ['test-generation', 'bug-detection', 'basic-analysis']
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'anthropic',
    description: 'Anthropic\'s most powerful model for complex reasoning',
    maxTokens: 200000,
    costPer1k: 0.015,
    capabilities: ['code-analysis', 'test-generation', 'bug-detection', 'documentation', 'security-analysis']
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'anthropic',
    description: 'Balanced performance and cost',
    maxTokens: 200000,
    costPer1k: 0.003,
    capabilities: ['code-analysis', 'test-generation', 'bug-detection', 'documentation']
  },
  {
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: 'anthropic',
    description: 'Fast and lightweight for simple tasks',
    maxTokens: 200000,
    costPer1k: 0.00025,
    capabilities: ['test-generation', 'basic-analysis']
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'google',
    description: 'Google\'s advanced multimodal AI model',
    maxTokens: 32768,
    costPer1k: 0.0005,
    capabilities: ['code-analysis', 'test-generation', 'bug-detection']
  }
];

const defaultTemplates: AIPromptTemplate[] = [
  {
    id: 'comprehensive-testing',
    name: 'Comprehensive Test Generation',
    description: 'Generate detailed test cases with comprehensive coverage',
    category: 'testing',
    template: `You are an expert QA engineer. Generate comprehensive test cases for the following requirements:

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
4. Performance considerations
5. Security aspects
6. Accessibility testing

Each test case should have:
- Clear, actionable title
- Detailed description
- Prerequisites
- Step-by-step execution
- Expected results
- Test data
- Priority level
- Estimated time
- Tags

Return JSON format:
{
  "testCases": [
    {
      "id": "unique_id",
      "title": "test_title",
      "description": "detailed_description",
      "prerequisites": ["prerequisite1", "prerequisite2"],
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
    variables: ['requirements', 'framework', 'testTypes', 'qualityLevel', 'maxTestCases'],
    examples: [
      'User login functionality testing',
      'E-commerce checkout process validation',
      'API endpoint security testing'
    ]
  },
  {
    id: 'code-review-analysis',
    name: 'Comprehensive Code Review',
    description: 'Analyze code for quality, security, and performance issues',
    category: 'code-review',
    template: `You are a senior software engineer conducting a comprehensive code review. Analyze the following code:

CODE:
{code}

LANGUAGE: {language}
QUALITY LEVEL: {qualityLevel}
FOCUS AREAS: {focusAreas}

Provide analysis covering:
1. **Code Quality**: Structure, readability, maintainability
2. **Performance**: Optimization opportunities, bottlenecks
3. **Security**: Vulnerabilities, best practices
4. **Best Practices**: Conventions, patterns, standards
5. **Testing**: Testability, coverage suggestions
6. **Documentation**: Comments, clarity

For each issue found, provide:
- Severity level (Critical/High/Medium/Low)
- Description of the issue
- Specific line numbers (if applicable)
- Recommended fix with code example
- Explanation of why it matters

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
      "category": "Quality|Performance|Security|BestPractices|Testing|Documentation",
      "title": "issue_title",
      "description": "detailed_description",
      "lineNumbers": [1, 2, 3],
      "currentCode": "problematic_code",
      "suggestedFix": "improved_code",
      "explanation": "why_this_matters"
    }
  ],
  "suggestions": [
    {
      "category": "category",
      "title": "suggestion_title",
      "description": "suggestion_description",
      "benefit": "expected_benefit"
    }
  ]
}`,
    variables: ['code', 'language', 'qualityLevel', 'focusAreas'],
    examples: [
      'JavaScript React component review',
      'Python API endpoint security analysis',
      'Java class performance optimization'
    ]
  },
  {
    id: 'bug-report-analysis',
    name: 'Intelligent Bug Analysis',
    description: 'Analyze bug reports and suggest investigation steps',
    category: 'bug-analysis',
    template: `You are an expert QA engineer analyzing a bug report. Provide comprehensive analysis and guidance:

BUG REPORT:
{bugReport}

SYSTEM INFO:
- Environment: {environment}
- Browser/Platform: {platform}
- Version: {version}

Analyze and provide:
1. **Severity Assessment**: Impact and urgency analysis
2. **Root Cause Analysis**: Potential causes and investigation areas
3. **Reproduction Steps**: Detailed steps to reproduce
4. **Investigation Plan**: Systematic debugging approach
5. **Testing Strategy**: Additional tests to perform
6. **Prevention Measures**: How to prevent similar issues

Return JSON format:
{
  "analysis": {
    "severity": "Critical|High|Medium|Low",
    "priority": "P1|P2|P3|P4",
    "category": "bug_category",
    "impact": "impact_description",
    "likelihood": "reproduction_likelihood"
  },
  "rootCauseAnalysis": {
    "potentialCauses": ["cause1", "cause2"],
    "investigationAreas": ["area1", "area2"],
    "relatedComponents": ["component1", "component2"]
  },
  "reproductionSteps": [
    {
      "step": number,
      "action": "action_description",
      "expectedResult": "expected_result",
      "actualResult": "actual_result"
    }
  ],
  "investigationPlan": [
    {
      "phase": "phase_name",
      "actions": ["action1", "action2"],
      "tools": ["tool1", "tool2"],
      "expectedOutcome": "outcome_description"
    }
  ],
  "additionalTests": [
    {
      "testType": "test_type",
      "description": "test_description",
      "purpose": "why_test_this"
    }
  ],
  "preventionMeasures": [
    {
      "measure": "prevention_measure",
      "implementation": "how_to_implement",
      "benefit": "expected_benefit"
    }
  ]
}`,
    variables: ['bugReport', 'environment', 'platform', 'version'],
    examples: [
      'Login failure on mobile devices',
      'Performance degradation in checkout process',
      'Data corruption in user profiles'
    ]
  },
  {
    id: 'api-test-generation',
    name: 'API Test Case Generation',
    description: 'Generate comprehensive API test cases',
    category: 'api-testing',
    template: `You are an API testing expert. Generate comprehensive test cases for the API endpoint:

API SPECIFICATION:
{apiSpec}

ENDPOINT: {endpoint}
METHOD: {method}
AUTHENTICATION: {authType}
QUALITY LEVEL: {qualityLevel}

Generate test cases covering:
1. **Happy Path**: Valid requests and responses
2. **Authentication**: Auth scenarios and edge cases
3. **Validation**: Input validation and error handling
4. **Performance**: Load and response time testing
5. **Security**: Security vulnerabilities and attacks
6. **Edge Cases**: Boundary conditions and limits

For each test case, include:
- Test scenario name
- Request details (headers, body, params)
- Expected response (status, body, headers)
- Validation points
- Test data
- Security considerations

Return JSON format:
{
  "endpoint": "endpoint_path",
  "method": "HTTP_METHOD",
  "testSuite": [
    {
      "id": "test_id",
      "name": "test_name",
      "category": "Happy Path|Authentication|Validation|Performance|Security|Edge Cases",
      "description": "test_description",
      "request": {
        "headers": {"header": "value"},
        "body": "request_body",
        "params": {"param": "value"},
        "authentication": "auth_details"
      },
      "expectedResponse": {
        "statusCode": 200,
        "body": "expected_body",
        "headers": {"header": "value"},
        "responseTime": "max_time_ms"
      },
      "validations": [
        {
          "field": "field_path",
          "condition": "validation_rule",
          "expectedValue": "expected_value"
        }
      ],
      "testData": "test_data_description",
      "securityConsiderations": ["consideration1", "consideration2"]
    }
  ]
}`,
    variables: ['apiSpec', 'endpoint', 'method', 'authType', 'qualityLevel'],
    examples: [
      'REST API user management endpoints',
      'GraphQL query testing',
      'WebSocket connection testing'
    ]
  }
];

const AIConfigContext = createContext<AIConfigContextType | undefined>(undefined);

export const useAIConfig = () => {
  const context = useContext(AIConfigContext);
  if (!context) {
    throw new Error('useAIConfig must be used within an AIConfigProvider');
  }
  return context;
};

interface AIConfigProviderProps {
  children: ReactNode;
}

export const AIConfigProvider: React.FC<AIConfigProviderProps> = ({ children }) => {
  const [config, setConfig] = useState<AIConfiguration>(defaultConfig);
  const [templates, setTemplates] = useState<AIPromptTemplate[]>(defaultTemplates);

  // Load configuration from localStorage on mount
  useEffect(() => {
    loadConfig();
  }, []);

  const updateConfig = (updates: Partial<AIConfiguration>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
    localStorage.removeItem('ai-config');
  };

  const addTemplate = (template: AIPromptTemplate) => {
    setTemplates(prev => [...prev, template]);
  };

  const removeTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
  };

  const isConfigured = config.apiKey.length > 0 && config.apiEndpoint.length > 0;

  const testConnection = async (): Promise<boolean> => {
    if (!isConfigured) return false;

    try {
      const response = await fetch(config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
          model: config.selectedModel,
          messages: [{ role: 'user', content: 'Hello, this is a connection test.' }],
          max_tokens: 10
        })
      });

      return response.ok;
    } catch (error) {
      console.error('AI connection test failed:', error);
      return false;
    }
  };

  const saveConfig = () => {
    localStorage.setItem('ai-config', JSON.stringify({
      config,
      templates: templates.filter(t => !defaultTemplates.find(dt => dt.id === t.id))
    }));
  };

  const loadConfig = () => {
    try {
      const saved = localStorage.getItem('ai-config');
      if (saved) {
        const { config: savedConfig, templates: savedTemplates } = JSON.parse(saved);
        setConfig(prev => ({ ...prev, ...savedConfig }));
        if (savedTemplates && Array.isArray(savedTemplates)) {
          setTemplates(prev => [...prev, ...savedTemplates]);
        }
      }
    } catch (error) {
      console.error('Failed to load AI config:', error);
    }
  };

  const contextValue: AIConfigContextType = {
    config,
    updateConfig,
    resetConfig,
    models: availableModels,
    templates,
    addTemplate,
    removeTemplate,
    isConfigured,
    testConnection,
    saveConfig,
    loadConfig
  };

  return (
    <AIConfigContext.Provider value={contextValue}>
      {children}
    </AIConfigContext.Provider>
  );
};

export default AIConfigProvider; 