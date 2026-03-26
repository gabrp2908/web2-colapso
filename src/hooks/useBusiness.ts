import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { devolutionService, reportService } from '@/lib/api/services/business'

// ── Devolutions ────────────────────────────────────

export function useDevolutionList(filters?: Record<string, unknown>) {
  return useQuery({ queryKey: ['devolutions', filters], queryFn: () => devolutionService.getAll(filters) })
}
export function useCreateDevolution() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: devolutionService.register, onSuccess: () => qc.invalidateQueries({ queryKey: ['devolutions'] }) })
}

// ── Reports ────────────────────────────────────────

export function useReportList(filters?: Record<string, unknown>) {
  return useQuery({ queryKey: ['reports', filters], queryFn: () => reportService.getAll(filters) })
}
export function useCreateReport() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: reportService.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['reports'] }) })
}
