import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  userService, profileService, subsystemService,
  objectService, methodService, menuService,
  optionService, notificationService,
} from '@/lib/api/services/security'

// ── Users ──────────────────────────────────────────

export function useUserList(filters?: Record<string, unknown>) {
  return useQuery({ queryKey: ['users', filters], queryFn: () => userService.getAll(filters) })
}
export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: userService.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }) })
}
export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: userService.update, onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }) })
}
export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id: number) => userService.delete(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }) })
}
export function useAssignProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (p: { userId: number; profileId: number }) => userService.assignProfile(p.userId, p.profileId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })
}
export function useRevokeProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (p: { userId: number; profileId: number }) => userService.revokeProfile(p.userId, p.profileId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })
}

// ── Profiles ───────────────────────────────────────

export function useProfileList(filters?: Record<string, unknown>) {
  return useQuery({ queryKey: ['profiles', filters], queryFn: () => profileService.getAll(filters) })
}
export function useCreateProfile() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: profileService.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['profiles'] }) })
}
export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: profileService.update, onSuccess: () => qc.invalidateQueries({ queryKey: ['profiles'] }) })
}
export function useDeleteProfile() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id: number) => profileService.delete(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['profiles'] }) })
}

// ── Subsystems ─────────────────────────────────────

export function useSubsystemList() {
  return useQuery({ queryKey: ['subsystems'], queryFn: () => subsystemService.getAll() })
}
export function useCreateSubsystem() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: subsystemService.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['subsystems'] }) })
}
export function useUpdateSubsystem() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: subsystemService.update, onSuccess: () => qc.invalidateQueries({ queryKey: ['subsystems'] }) })
}
export function useDeleteSubsystem() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id: number) => subsystemService.delete(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['subsystems'] }) })
}

// ── Objects ────────────────────────────────────────

export function useObjectList() {
  return useQuery({ queryKey: ['objects'], queryFn: () => objectService.getAll() })
}
export function useCreateObject() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: objectService.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['objects'] }) })
}
export function useUpdateObject() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: objectService.update, onSuccess: () => qc.invalidateQueries({ queryKey: ['objects'] }) })
}
export function useDeleteObject() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id: number) => objectService.delete(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['objects'] }) })
}

// ── Methods ────────────────────────────────────────

export function useMethodList() {
  return useQuery({ queryKey: ['methods'], queryFn: () => methodService.getAll() })
}
export function useCreateMethod() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: methodService.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['methods'] }) })
}
export function useUpdateMethod() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: methodService.update, onSuccess: () => qc.invalidateQueries({ queryKey: ['methods'] }) })
}
export function useDeleteMethod() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id: number) => methodService.delete(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['methods'] }) })
}

// ── Menus ──────────────────────────────────────────

export function useMenuList() {
  return useQuery({ queryKey: ['menus'], queryFn: () => menuService.getAll() })
}
export function useCreateMenu() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: menuService.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['menus'] }) })
}

// ── Options ────────────────────────────────────────

export function useOptionList() {
  return useQuery({ queryKey: ['options'], queryFn: () => optionService.getAll() })
}
export function useCreateOption() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: optionService.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['options'] }) })
}

// ── Notifications ──────────────────────────────────

export function useNotificationList() {
  return useQuery({ queryKey: ['notifications'], queryFn: () => notificationService.getAll() })
}
export function useCreateNotification() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: notificationService.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }) })
}
export function useUpdateNotification() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: notificationService.update, onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }) })
}
export function useDeleteNotification() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id: number) => notificationService.delete(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }) })
}
