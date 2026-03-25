import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { inventoryService } from '@/lib/api/services/inventory'

const KEYS = {
  all: ['inventory'] as const,
  list: (filters?: Record<string, unknown>) => [...KEYS.all, 'list', filters] as const,
  detail: (id: number) => [...KEYS.all, 'detail', id] as const,
}

export function useInventoryList(filters?: { item_id?: number; location_id?: number; category_type_id?: number }) {
  return useQuery({
    queryKey: KEYS.list(filters),
    queryFn: () => inventoryService.getAll(filters),
  })
}

export function useInventoryDetail(id: number) {
  return useQuery({
    queryKey: KEYS.detail(id),
    queryFn: () => inventoryService.get(id),
    enabled: id > 0,
  })
}

export function useCreateInventory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: inventoryService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  })
}

export function useUpdateInventory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: inventoryService.update,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  })
}

export function useDeleteInventory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (inventoryId: number) => inventoryService.delete(inventoryId),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  })
}

export function useAddStock() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ inventoryId, quantity }: { inventoryId: number; quantity: number }) =>
      inventoryService.addStock(inventoryId, quantity),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  })
}

export function useRemoveStock() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ inventoryId, quantity }: { inventoryId: number; quantity: number }) =>
      inventoryService.removeStock(inventoryId, quantity),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  })
}

export function useMoveLocation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ inventoryId, locationId }: { inventoryId: number; locationId: number }) =>
      inventoryService.moveLocation(inventoryId, locationId),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  })
}
