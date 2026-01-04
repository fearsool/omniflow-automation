
export enum NodeType {
  AGENT_PLANNER = 'planner',
  RESEARCH_WEB = 'research',
  CONTENT_CREATOR = 'creator',
  MEDIA_ENGINEER = 'media',
  VIDEO_ARCHITECT = 'video',
  TRADING_DESK = 'trader',
  SOCIAL_MANAGER = 'social',
  ANALYST_CRITIC = 'analyst',
  LOGIC_GATE = 'logic_gate',
  EXTERNAL_CONNECTOR = 'webhook',
  STATE_MANAGER = 'vault_node',
  HUMAN_APPROVAL = 'approval'
}

export enum StepStatus {
  IDLE = 'idle',
  RUNNING = 'running',
  SUCCESS = 'success',
  REJECTED = 'rejected',
  REPAIRING = 'repairing',
  WAITING_APPROVAL = 'waiting'
}

export interface NodeConnection {
  targetId: string;
  condition?: string;
}

export interface WorkflowNode {
  id: string;
  type: NodeType;
  title: string;
  role: string;
  task: string;
  status: StepStatus;
  inputData?: string;
  outputData?: string;
  variableMap?: Record<string, string>;
  connections: NodeConnection[];
}

export interface MarketOpportunity {
  id: string;
  profession: string;
  painPoint: string;
  solutionName: string;
  solutionLogic: string;
  estimatedRevenue: string;
  startupCost: string;
  difficulty: 'Kolay' | 'Orta' | 'Zor';
}

export interface TestVariable {
  key: string;
  value: string;
}

// API Requirement tanımı (templateService'den import yerine duplicate)
export interface ApiRequirement {
  name: string;
  label: string;
  description: string;
  link?: string;
  required?: boolean;
  placeholder?: string;
}

export interface SystemBlueprint {
  id: string;
  name: string;
  description: string;
  masterGoal: string;
  nodes: WorkflowNode[];
  baseKnowledge: string;
  category: string;
  version: number;
  testConfig?: {
    variables: TestVariable[];
    simulateFailures: boolean;
  };
  // 4 Adımlık İçerik Analizi Sonuçları
  contentScore?: number; // 0-100, hızlı erişim için
  contentAnalysis?: {
    step1Score: number;
    step2Score: number;
    step3Score: number;
    step4Score: number;
    finalScore: number;
    approved: boolean;
    recommendations: string[];
    analyzedAt: string; // ISO date
  };
  // Gerekli API anahtarları (deploy öncesi girilecek)
  requiredApis?: ApiRequirement[];
  // Girilen API değerleri
  apiValues?: Record<string, string>;
}

// ============================================
// AGENT HEALTH & RECOVERY SYSTEM
// Scalable for 30-40+ agents
// ============================================

export enum AgentHealthStatus {
  HEALTHY = 'healthy',
  WARNING = 'warning',
  CRITICAL = 'critical',
  RECOVERING = 'recovering',
  OFFLINE = 'offline',
  CIRCUIT_OPEN = 'circuit_open'
}

export interface AgentHealthState {
  nodeId: string;
  nodeName: string;
  status: AgentHealthStatus;
  lastHeartbeat: number; // timestamp
  consecutiveFailures: number;
  totalExecutions: number;
  successfulExecutions: number;
  successRate: number;
  averageResponseTime: number;
  lastResponseTime: number;
  circuitBreakerOpen: boolean;
  circuitBreakerResetTime: number | null;
  recoveryAttempts: number;
  maxRecoveryAttempts: number;
  lastError: string | null;
  fallbackNodeId: string | null;
  queuedTasks: number;
  memoryUsage: number; // percentage
  cpuLoad: number; // percentage
}

export interface HealthCheckResult {
  nodeId: string;
  success: boolean;
  responseTime: number;
  error?: string;
  timestamp: number;
  checkType: 'heartbeat' | 'execution' | 'manual';
}

export interface RecoveryAction {
  id: string;
  type: 'retry' | 'fallback' | 'reset' | 'skip' | 'restart' | 'manual' | 'circuit_reset';
  nodeId: string;
  nodeName: string;
  timestamp: number;
  success: boolean;
  details: string;
  previousStatus: AgentHealthStatus;
  newStatus: AgentHealthStatus;
  duration: number; // ms
}

export interface AgentMetrics {
  totalAgents: number;
  healthyAgents: number;
  warningAgents: number;
  criticalAgents: number;
  offlineAgents: number;
  recoveringAgents: number;
  averageSuccessRate: number;
  averageResponseTime: number;
  totalExecutions: number;
  totalRecoveries: number;
  successfulRecoveries: number;
  uptime: number; // percentage
  lastUpdated: number;
  systemLoad: 'low' | 'medium' | 'high' | 'critical';
}

export interface AgentCluster {
  id: string;
  name: string;
  agents: string[]; // node IDs
  loadBalancer: 'round-robin' | 'least-connections' | 'weighted';
  healthThreshold: number; // minimum healthy agents percentage
  autoScale: boolean;
  minAgents: number;
  maxAgents: number;
}
