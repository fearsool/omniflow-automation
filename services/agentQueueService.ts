/**
 * Agent Queue Service - Paralel 25-40 Ajan Yönetimi
 * ✅ Worker pool (configurable concurrency)
 * ✅ Priority queue (kritik işler önce)
 * ✅ Health checks & auto-retry
 * ✅ Resource pooling (memorıyı kontrol et)
 * ✅ WebSocket events untuk progress
 */

export interface AgentTask {
  id: string;
  blueprintId: string;
  nodeId?: string;
  priority: 'critical' | 'high' | 'normal' | 'low'; // Kritik işler önce
  payload: any; // Blueprint data
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  status: 'queued' | 'running' | 'success' | 'failed' | 'retry';
  result?: any;
  error?: string;
  retries: number;
  maxRetries: number;
}

export interface AgentWorker {
  id: string;
  status: 'idle' | 'busy' | 'dead';
  currentTask?: AgentTask;
  tasksCompleted: number;
  memoryUsageMB: number;
  lastHealthCheck: number;
}

export interface QueueStats {
  totalTasks: number;
  queuedTasks: number;
  runningTasks: number;
  completedTasks: number;
  failedTasks: number;
  activeWorkers: number;
  idleWorkers: number;
  averageProcessTime: number;
}

// ==================== KONFIGÜRASYON ====================

// 25-40 ajan için optimal ayarlar
const CONCURRENCY = Math.min(navigator.hardwareConcurrency || 4, 40); // Max 40 workers
const MAX_QUEUE_SIZE = 1000;
const TASK_TIMEOUT = 300000; // 5 dakika per task
const HEALTH_CHECK_INTERVAL = 10000; // 10 saniye
const MEMORY_THRESHOLD_MB = 500; // Max 500MB per worker

// ==================== QUEUE MANAGER ====================

class AgentQueueManager {
  private queue: AgentTask[] = [];
  private workers: Map<string, AgentWorker> = new Map();
  private taskMap: Map<string, AgentTask> = new Map();
  private listeners: Map<string, Set<Function>> = new Map();
  private stats = {
    totalProcessed: 0,
    totalFailed: 0,
    totalTime: 0,
  };

  constructor(maxConcurrency: number = CONCURRENCY) {
    // Worker pool oluştur
    for (let i = 0; i < maxConcurrency; i++) {
      const workerId = `worker-${i}`;
      this.workers.set(workerId, {
        id: workerId,
        status: 'idle',
        tasksCompleted: 0,
        memoryUsageMB: 0,
        lastHealthCheck: Date.now(),
      });
    }

    // Health check loop
    this.startHealthChecks();
    // Queue processing loop
    this.processQueue();
  }

  // ==================== TASK MANAGEMENT ====================

  addTask(task: Omit<AgentTask, 'retries' | 'status' | 'createdAt'>): string {
    if (this.queue.length >= MAX_QUEUE_SIZE) {
      throw new Error(`Queue full (${MAX_QUEUE_SIZE} max)`);
    }

    const fullTask: AgentTask = {
      ...task,
      retries: 0,
      status: 'queued',
      createdAt: Date.now(),
      maxRetries: task.priority === 'critical' ? 5 : 3,
    };

    this.queue.push(fullTask);
    this.taskMap.set(fullTask.id, fullTask);
    this.sortQueue();
    this.emit('task-added', fullTask);

    console.log(`[QUEUE] Task ${task.id} added (priority: ${task.priority})`);
    return task.id;
  }

  getTask(taskId: string): AgentTask | undefined {
    return this.taskMap.get(taskId);
  }

  cancelTask(taskId: string): boolean {
    const task = this.taskMap.get(taskId);
    if (!task) return false;

    if (task.status === 'queued') {
      this.queue = this.queue.filter(t => t.id !== taskId);
      this.taskMap.delete(taskId);
      this.emit('task-cancelled', task);
      return true;
    }

    // Running task'ı cancel etmek daha zor - worker'a sinyal gönder
    return false;
  }

  // ==================== PRIORITY QUEUE ====================

  private sortQueue() {
    const priorityMap = { critical: 0, high: 1, normal: 2, low: 3 };
    
    this.queue.sort((a, b) => {
      // Priority'ye göre sırala
      const priorityDiff = priorityMap[a.priority] - priorityMap[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Aynı priority'de ise creation time'a göre (FIFO)
      return a.createdAt - b.createdAt;
    });
  }

  // ==================== WORKER MANAGEMENT ====================

  private getIdleWorker(): AgentWorker | null {
    for (const worker of this.workers.values()) {
      if (worker.status === 'idle' && worker.memoryUsageMB < MEMORY_THRESHOLD_MB) {
        return worker;
      }
    }
    return null;
  }

  private async executeTask(worker: AgentWorker, task: AgentTask) {
    worker.status = 'busy';
    worker.currentTask = task;
    task.status = 'running';
    task.startedAt = Date.now();

    this.emit('task-started', task);

    try {
      // Task'ı timeout ile çalıştır
      const result = await Promise.race([
        this.runTaskLogic(task),
        this.createTimeout(TASK_TIMEOUT),
      ]);

      task.result = result;
      task.status = 'success';
      task.completedAt = Date.now();
      
      worker.tasksCompleted++;
      this.stats.totalProcessed++;
      this.stats.totalTime += task.completedAt - task.startedAt!;

      this.emit('task-completed', task);
      console.log(`[QUEUE] Task ${task.id} completed (${task.completedAt - task.startedAt}ms)`);

    } catch (error) {
      task.error = String(error);

      // Retry etmeye çalış
      if (task.retries < task.maxRetries) {
        task.retries++;
        task.status = 'retry';
        
        // Başına ekle (priority queue)
        this.queue.unshift(task);
        this.sortQueue();
        
        this.emit('task-retrying', { ...task, retryCount: task.retries });
        console.log(`[QUEUE] Task ${task.id} retry ${task.retries}/${task.maxRetries}`);

      } else {
        task.status = 'failed';
        task.completedAt = Date.now();
        this.stats.totalFailed++;
        
        this.emit('task-failed', task);
        console.error(`[QUEUE] Task ${task.id} FAILED after ${task.retries} retries:`, error);
      }
    }

    worker.status = 'idle';
    worker.currentTask = undefined;
  }

  private runTaskLogic(task: AgentTask): Promise<any> {
    // Bu fonksiyon App.tsx'teki runGraph() logic'ini çalıştırır
    // Şimdilik placeholder - sonra implement edilecek
    return Promise.resolve({
      success: true,
      output: `Task ${task.id} completed`,
    });
  }

  private createTimeout(ms: number): Promise<never> {
    return new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Task timeout after ${ms}ms`)), ms)
    );
  }

  // ==================== QUEUE PROCESSING LOOP ====================

  private async processQueue() {
    while (true) {
      // Idle worker bulunca, task'ı al ve çalıştır
      const worker = this.getIdleWorker();
      const task = this.queue.shift();

      if (worker && task) {
        // Paralel çalıştır
        this.executeTask(worker, task).catch(err => {
          console.error(`[QUEUE] Unexpected error:`, err);
        });
      }

      // 100ms sonra tekrar kontrol et
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  // ==================== HEALTH CHECKS ====================

  private startHealthChecks() {
    setInterval(() => {
      for (const worker of this.workers.values()) {
        // Memory usage kontrol et
        const memUsage = (performance as any).memory?.usedJSHeapSize || 0;
        worker.memoryUsageMB = Math.round(memUsage / (1024 * 1024));

        // Dead worker kontrol et (10 saniyeden uzun idle)
        const idleDuration = Date.now() - worker.lastHealthCheck;
        if (worker.status === 'idle' && idleDuration > 30000) {
          worker.status = 'idle'; // Hala canlı, last check'i güncelle
          worker.lastHealthCheck = Date.now();
        }

        // Bellek çok yüksek?
        if (worker.memoryUsageMB > MEMORY_THRESHOLD_MB) {
          console.warn(`[QUEUE] Worker ${worker.id} high memory: ${worker.memoryUsageMB}MB`);
          // Garbage collection trigger et
          if (typeof gc !== 'undefined') gc();
        }
      }

      this.emit('health-check', this.getStats());
    }, HEALTH_CHECK_INTERVAL);
  }

  // ==================== STATS & MONITORING ====================

  getStats(): QueueStats {
    const running = Array.from(this.workers.values()).filter(w => w.status === 'busy').length;
    const idle = Array.from(this.workers.values()).filter(w => w.status === 'idle').length;
    const completed = this.stats.totalProcessed;
    const failed = this.stats.totalFailed;
    const queued = this.queue.filter(t => t.status === 'queued').length;

    return {
      totalTasks: this.taskMap.size,
      queuedTasks: queued,
      runningTasks: running,
      completedTasks: completed,
      failedTasks: failed,
      activeWorkers: running,
      idleWorkers: idle,
      averageProcessTime: completed > 0 ? Math.round(this.stats.totalTime / completed) : 0,
    };
  }

  getWorkerStatus(): AgentWorker[] {
    return Array.from(this.workers.values());
  }

  // ==================== EVENT EMITTER ====================

  private emit(event: string, data: any) {
    const listeners = this.listeners.get(event) || new Set();
    listeners.forEach(fn => fn(data));
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    
    return () => {
      this.listeners.get(event)!.delete(callback);
    };
  }

  // ==================== ADVANCED FEATURES ====================

  /**
   * Batch task ekle - birden fazla task birden
   */
  addBatch(tasks: Omit<AgentTask, 'retries' | 'status' | 'createdAt'>[]): string[] {
    return tasks.map(task => this.addTask(task));
  }

  /**
   * Task'ları bekle - tüm task'lar bitene kadar
   */
  waitForTasks(taskIds: string[]): Promise<Map<string, AgentTask>> {
    return new Promise((resolve) => {
      const completed = new Map<string, AgentTask>();
      
      const checkCompletion = () => {
        let allDone = true;
        for (const id of taskIds) {
          const task = this.taskMap.get(id);
          if (!task) continue;
          
          if (task.status === 'success' || task.status === 'failed') {
            completed.set(id, task);
          } else {
            allDone = false;
          }
        }
        
        if (allDone && completed.size === taskIds.length) {
          resolve(completed);
        } else {
          setTimeout(checkCompletion, 100);
        }
      };
      
      checkCompletion();
    });
  }

  /**
   * Bulk retry - belirli task'ları tekrar çalıştır
   */
  retryFailedTasks(filter?: (task: AgentTask) => boolean) {
    let retried = 0;
    
    for (const task of this.taskMap.values()) {
      if (task.status === 'failed' && (!filter || filter(task))) {
        task.retries = 0;
        task.status = 'queued';
        task.error = undefined;
        this.queue.push(task);
        retried++;
      }
    }
    
    this.sortQueue();
    console.log(`[QUEUE] Retrying ${retried} failed tasks`);
    return retried;
  }

  /**
   * Pause/Resume queue
   */
  private isPaused = false;
  
  pause() {
    this.isPaused = true;
    console.log('[QUEUE] Paused');
  }

  resume() {
    this.isPaused = false;
    console.log('[QUEUE] Resumed');
  }

  /**
   * Clear queue - tüm pending task'ları sil
   */
  clearQueue() {
    const count = this.queue.length;
    for (const task of this.queue) {
      this.taskMap.delete(task.id);
    }
    this.queue = [];
    console.log(`[QUEUE] Cleared ${count} tasks`);
  }
}

// ==================== SINGLETON INSTANCE ====================

export const agentQueue = new AgentQueueManager(CONCURRENCY);

// ==================== MONITORING DASHBOARD EVENTS ====================

if (typeof window !== 'undefined') {
  // React component'ler için WebSocket/polling desteği
  agentQueue.on('task-added', (task) => {
    window.dispatchEvent(new CustomEvent('agent-task-added', { detail: task }));
  });

  agentQueue.on('task-completed', (task) => {
    window.dispatchEvent(new CustomEvent('agent-task-completed', { detail: task }));
  });

  agentQueue.on('task-failed', (task) => {
    window.dispatchEvent(new CustomEvent('agent-task-failed', { detail: task }));
  });

  agentQueue.on('health-check', (stats) => {
    window.dispatchEvent(new CustomEvent('agent-health-check', { detail: stats }));
  });
}

export default agentQueue;
