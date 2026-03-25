import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { devolutionService, reportService } from '@/lib/api/services/business'

// ── Devolutions ────────────────────────────────────

export function useDevolutionList() {
  return useQuery({ queryKey: ['devolutions'], queryFn: () => devolutionService.getAll() })
}
export function useCreateDevolution() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: devolutionService.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['devolutions'] }) })
}

// ── Reports ────────────────────────────────────────

export function useReportList(filters?: Record<string, unknown>) {
  return useQuery({ queryKey: ['reports', filters], queryFn: () => reportService.getAll(filters) })
}
export function useCreateReport() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: reportService.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['reports'] }) })
}
