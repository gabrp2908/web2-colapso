import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { loanService } from '@/lib/api/services/loan'

const KEYS = {
  requests: ['loan-requests'] as const,
  requestList: (filters?: Record<string, unknown>) => [...KEYS.requests, 'list', filters] as const,
  requestDetail: (id: number) => [...KEYS.requests, 'detail', id] as const,
  loans: ['loans'] as const,
  loanList: (filters?: Record<string, unknown>) => [...KEYS.loans, 'list', filters] as const,
  loanDetail: (id: number) => [...KEYS.loans, 'detail', id] as const,
}

// ── Solicitudes ────────────────────────────────────

export function useRequestList(filters?: { user_id?: number; lapse_id?: number; from_dt?: string; to_dt?: string }) {
  return useQuery({
    queryKey: KEYS.requestList(filters),
    queryFn: () => loanService.getAllRequests(filters),
  })
}

export function useRequestDetail(id: number) {
  return useQuery({
    queryKey: KEYS.requestDetail(id),
    queryFn: () => loanService.getRequest(id, true),
    enabled: id > 0,
  })
}

export function useCreateRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: loanService.requestLoan,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.requests }),
  })
}

export function useAcceptRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: loanService.acceptRequest,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.requests })
      qc.invalidateQueries({ queryKey: KEYS.loans })
    },
  })
}

export function useRejectRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: loanService.rejectRequest,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.requests }),
  })
}

// ── Préstamos ──────────────────────────────────────

export function useLoanList(filters?: { user_id?: number; lapse_id?: number; from_dt?: string; to_dt?: string }) {
  return useQuery({
    queryKey: KEYS.loanList(filters),
    queryFn: () => loanService.getAllLoans(filters),
  })
}

export function useLoanDetail(id: number) {
  return useQuery({
    queryKey: KEYS.loanDetail(id),
    queryFn: () => loanService.getLoan(id, true),
    enabled: id > 0,
  })
}

export function useRegisterLoan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: loanService.registerLoan,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.loans }),
  })
}
