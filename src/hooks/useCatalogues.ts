import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { locationService } from '@/lib/api/services/location'
import { categoryService } from '@/lib/api/services/category'
import { componentService, equipmentService } from '@/lib/api/services/items'
import { lapseService } from '@/lib/api/services/lapse'

// ── Location ───────────────────────────────────────

export function useLocationList(filters?: { location_na?: string }) {
  return useQuery({ queryKey: ['locations', filters], queryFn: () => locationService.getAll(filters) })
}
export function useCreateLocation() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: locationService.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['locations'] }) })
}
export function useUpdateLocation() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: locationService.update, onSuccess: () => qc.invalidateQueries({ queryKey: ['locations'] }) })
}
export function useDeleteLocation() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id: number) => locationService.delete(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['locations'] }) })
}

// ── Category ───────────────────────────────────────

export function useCategoryList(filters?: { category_de?: string; category_type_id?: number }) {
  return useQuery({ queryKey: ['categories', filters], queryFn: () => categoryService.getAll(filters) })
}
export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: categoryService.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }) })
}
export function useUpdateCategory() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: categoryService.update, onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }) })
}
export function useDeleteCategory() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id: number) => categoryService.delete(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }) })
}

// ── Component ──────────────────────────────────────

export function useComponentList(filters?: { item_cod?: number; item_na?: string; category_id?: number }) {
  return useQuery({ queryKey: ['components', filters], queryFn: () => componentService.getAll(filters) })
}
export function useCreateComponent() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: componentService.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['components'] }) })
}
export function useUpdateComponent() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: componentService.update, onSuccess: () => qc.invalidateQueries({ queryKey: ['components'] }) })
}
export function useDeleteComponent() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id: number) => componentService.delete(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['components'] }) })
}

// ── Equipment ──────────────────────────────────────

export function useEquipmentList(filters?: { item_cod?: number; item_na?: string; category_id?: number }) {
  return useQuery({ queryKey: ['equipment', filters], queryFn: () => equipmentService.getAll(filters) })
}
export function useCreateEquipment() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: equipmentService.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['equipment'] }) })
}
export function useUpdateEquipment() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: equipmentService.update, onSuccess: () => qc.invalidateQueries({ queryKey: ['equipment'] }) })
}
export function useDeleteEquipment() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id: number) => equipmentService.delete(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['equipment'] }) })
}

// ── Lapse ──────────────────────────────────────────

export function useLapseList(filters?: { lapse_de?: string; lapse_act?: boolean }) {
  return useQuery({ queryKey: ['lapses', filters], queryFn: () => lapseService.getAll(filters) })
}
export function useCreateLapse() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: lapseService.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['lapses'] }) })
}
export function useUpdateLapse() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: lapseService.update, onSuccess: () => qc.invalidateQueries({ queryKey: ['lapses'] }) })
}
export function useDeleteLapse() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id: number) => lapseService.delete(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['lapses'] }) })
}
