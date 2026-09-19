import { useState, useCallback } from 'react';
import { Lead, PipelineProgressState } from '../types/lead';
import { leadPipeline } from '../services/leadPipelineService';

export interface UseLeadPipelineReturn {
  isProcessing: boolean;
  progress: PipelineProgressState | null;
  logs: string[];
  runPipeline: (query: string, userId?: string) => Promise<Lead[]>;
  resetPipeline: () => void;
}

export function useLeadPipeline(onSuccess?: (newLeads: Lead[]) => void): UseLeadPipelineReturn {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<PipelineProgressState | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const resetPipeline = useCallback(() => {
    setIsProcessing(false);
    setProgress(null);
    setLogs([]);
  }, []);

  const runPipeline = useCallback(
    async (query: string, userId: string = 'demo_workspace_user'): Promise<Lead[]> => {
      setIsProcessing(true);
      setLogs([]);

      try {
        const results = await leadPipeline.runPipeline(query, userId, (state) => {
          setProgress(state);
          setLogs((prev) => {
            if (prev[prev.length - 1] === state.message) return prev;
            return [...prev, state.message];
          });
        });

        if (onSuccess) {
          onSuccess(results);
        }

        return results;
      } catch (err: any) {
        const errorMsg = err?.message || 'Pipeline encountered an unexpected issue.';
        setProgress((prev) =>
          prev
            ? { ...prev, stage: 'error', error: errorMsg }
            : {
                stage: 'error',
                currentStep: 0,
                totalSteps: 10,
                message: errorMsg,
                discoveredCount: 0,
                qualifiedCount: 0,
                error: errorMsg,
              }
        );
        throw err;
      } finally {
        setIsProcessing(false);
      }
    },
    [onSuccess]
  );

  return {
    isProcessing,
    progress,
    logs,
    runPipeline,
    resetPipeline,
  };
}
