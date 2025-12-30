import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SystemBlueprint, WorkflowNode, StepStatus } from '../types';

// ============================================
// SUPABASE SERVICE
// Blueprint'leri bulutta sakla, senkronize et
// ============================================

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

let supabase: SupabaseClient | null = null;

// Initialize Supabase client
export const initSupabase = (): SupabaseClient | null => {
    if (!supabaseUrl || !supabaseKey) {
        console.warn('[Supabase] URL veya Key bulunamadı. Cloud özellikler devre dışı.');
        return null;
    }

    if (!supabase) {
        supabase = createClient(supabaseUrl, supabaseKey);
        console.log('[Supabase] Bağlantı kuruldu ✓');
    }

    return supabase;
};

// Check connection
export const checkConnection = async (): Promise<boolean> => {
    try {
        const client = initSupabase();
        if (!client) return false;

        const { error } = await client.from('blueprints').select('count').limit(1);
        return !error;
    } catch {
        return false;
    }
};

// ============================================
// BLUEPRINT CRUD
// ============================================

export interface CloudBlueprint {
    id: string;
    name: string;
    description: string;
    master_goal: string;
    nodes: WorkflowNode[];
    base_knowledge: string;
    category: string;
    version: number;
    test_config: any;
    is_active: boolean;
    schedule_cron: string | null;
    notify_on: string[];
    last_run: string | null;
    last_result: string | null;
    run_count: number;
    created_at: string;
    updated_at: string;
}

// Convert local blueprint to cloud format
const toCloudFormat = (bp: SystemBlueprint, isActive = true): Partial<CloudBlueprint> => ({
    id: bp.id,
    name: bp.name,
    description: bp.description,
    master_goal: bp.masterGoal,
    nodes: bp.nodes,
    base_knowledge: bp.baseKnowledge,
    category: bp.category,
    version: bp.version,
    test_config: bp.testConfig,
    is_active: isActive,
    notify_on: ['error'],
    updated_at: new Date().toISOString()
});

// Convert cloud blueprint to local format
const toLocalFormat = (cloud: CloudBlueprint): SystemBlueprint => ({
    id: cloud.id,
    name: cloud.name,
    description: cloud.description,
    masterGoal: cloud.master_goal,
    nodes: cloud.nodes.map(n => ({ ...n, status: StepStatus.IDLE })),
    baseKnowledge: cloud.base_knowledge,
    category: cloud.category,
    version: cloud.version,
    testConfig: cloud.test_config
});

// Save blueprint to cloud
export const saveBlueprint = async (blueprint: SystemBlueprint): Promise<{ success: boolean; error?: string }> => {
    try {
        const client = initSupabase();
        if (!client) return { success: false, error: 'Supabase bağlantısı yok' };

        const { error } = await client
            .from('blueprints')
            .upsert(toCloudFormat(blueprint), { onConflict: 'id' });

        if (error) {
            console.error('[Supabase] Kayıt hatası:', error);
            return { success: false, error: error.message };
        }

        console.log(`[Supabase] "${blueprint.name}" kaydedildi ✓`);
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
};

// Get all blueprints from cloud
export const getBlueprints = async (): Promise<SystemBlueprint[]> => {
    try {
        const client = initSupabase();
        if (!client) return [];

        const { data, error } = await client
            .from('blueprints')
            .select('*')
            .order('updated_at', { ascending: false });

        if (error) {
            console.error('[Supabase] Okuma hatası:', error);
            return [];
        }

        return (data || []).map(toLocalFormat);
    } catch {
        return [];
    }
};

// Get active blueprints for scheduled execution
export const getActiveBlueprints = async (): Promise<CloudBlueprint[]> => {
    try {
        const client = initSupabase();
        if (!client) return [];

        const { data, error } = await client
            .from('blueprints')
            .select('*')
            .eq('is_active', true);

        if (error) return [];
        return data || [];
    } catch {
        return [];
    }
};

// Get single blueprint
export const getBlueprintById = async (id: string): Promise<SystemBlueprint | null> => {
    try {
        const client = initSupabase();
        if (!client) return null;

        const { data, error } = await client
            .from('blueprints')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) return null;
        return toLocalFormat(data);
    } catch {
        return null;
    }
};

// Delete blueprint
export const deleteBlueprint = async (id: string): Promise<boolean> => {
    try {
        const client = initSupabase();
        if (!client) return false;

        const { error } = await client
            .from('blueprints')
            .delete()
            .eq('id', id);

        return !error;
    } catch {
        return false;
    }
};

// Update blueprint status
export const updateBlueprintStatus = async (
    id: string,
    updates: { is_active?: boolean; last_run?: string; last_result?: string; run_count?: number }
): Promise<boolean> => {
    try {
        const client = initSupabase();
        if (!client) return false;

        const { error } = await client
            .from('blueprints')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id);

        return !error;
    } catch {
        return false;
    }
};

// Set schedule for blueprint
export const setSchedule = async (id: string, cron: string | null): Promise<boolean> => {
    try {
        const client = initSupabase();
        if (!client) return false;

        const { error } = await client
            .from('blueprints')
            .update({ schedule_cron: cron, updated_at: new Date().toISOString() })
            .eq('id', id);

        return !error;
    } catch {
        return false;
    }
};

// ============================================
// EXECUTION LOGS
// ============================================

export interface ExecutionLog {
    id?: string;
    blueprint_id: string;
    started_at: string;
    finished_at?: string;
    status: 'running' | 'success' | 'error';
    node_results?: any;
    error_message?: string;
}

// Log execution start
export const logExecutionStart = async (blueprintId: string): Promise<string | null> => {
    try {
        const client = initSupabase();
        if (!client) return null;

        const { data, error } = await client
            .from('execution_logs')
            .insert({
                blueprint_id: blueprintId,
                started_at: new Date().toISOString(),
                status: 'running'
            })
            .select('id')
            .single();

        if (error || !data) return null;
        return data.id;
    } catch {
        return null;
    }
};

// Log execution end
export const logExecutionEnd = async (
    logId: string,
    status: 'success' | 'error',
    nodeResults?: any,
    errorMessage?: string
): Promise<boolean> => {
    try {
        const client = initSupabase();
        if (!client) return false;

        const { error } = await client
            .from('execution_logs')
            .update({
                finished_at: new Date().toISOString(),
                status,
                node_results: nodeResults,
                error_message: errorMessage
            })
            .eq('id', logId);

        return !error;
    } catch {
        return false;
    }
};

// Get execution history
export const getExecutionHistory = async (blueprintId: string, limit = 10): Promise<ExecutionLog[]> => {
    try {
        const client = initSupabase();
        if (!client) return [];

        const { data, error } = await client
            .from('execution_logs')
            .select('*')
            .eq('blueprint_id', blueprintId)
            .order('started_at', { ascending: false })
            .limit(limit);

        if (error) return [];
        return data || [];
    } catch {
        return [];
    }
};

// ============================================
// SYNC UTILITIES
// ============================================

// Sync all local blueprints to cloud
export const syncToCloud = async (localBlueprints: SystemBlueprint[]): Promise<{ synced: number; errors: string[] }> => {
    const errors: string[] = [];
    let synced = 0;

    for (const bp of localBlueprints) {
        const result = await saveBlueprint(bp);
        if (result.success) {
            synced++;
        } else {
            errors.push(`${bp.name}: ${result.error}`);
        }
    }

    return { synced, errors };
};

// Download all from cloud
export const downloadFromCloud = async (): Promise<SystemBlueprint[]> => {
    return getBlueprints();
};

export default {
    initSupabase,
    checkConnection,
    saveBlueprint,
    getBlueprints,
    getBlueprintById,
    deleteBlueprint,
    updateBlueprintStatus,
    setSchedule,
    getActiveBlueprints,
    logExecutionStart,
    logExecutionEnd,
    getExecutionHistory,
    syncToCloud,
    downloadFromCloud
};
