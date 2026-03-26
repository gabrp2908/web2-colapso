import { dispatch } from '../client'
import { TX } from '../tx-registry'
import type { ApiResponse } from '../types'

export const userService = {
  get: (id: number): Promise<ApiResponse> =>
    dispatch(TX.USER_GET, { user_id: id }),
  getAll: (filters?: Record<string, unknown>): Promise<ApiResponse> =>
    dispatch(TX.USER_GET_ALL, filters ?? {}),
  create: (params: {
    user_em?: string
    user_pw?: string
    user_na?: string
    email?: string
    password?: string
  }): Promise<ApiResponse> =>
    dispatch(TX.USER_CREATE, {
      ...params,
      user_em: params.user_em ?? params.email,
      user_pw: params.user_pw ?? params.password,
    }),
  update: (params: {
    user_id: number
    user_em?: string
    user_pw?: string
    email?: string
    password?: string
    [key: string]: unknown
  }): Promise<ApiResponse> =>
    dispatch(TX.USER_UPDATE, {
      ...params,
      user_em: params.user_em ?? params.email,
      user_pw: params.user_pw ?? params.password,
    }),
  delete: (id: number): Promise<ApiResponse> =>
    dispatch(TX.USER_DELETE, { user_id: id }),
  assignProfile: (userId: number, profileId: number): Promise<ApiResponse> =>
    dispatch(TX.USER_ASSIGN_PROFILE, { user_id: userId, profile_id: profileId }),
  revokeProfile: (userId: number, profileId: number): Promise<ApiResponse> =>
    dispatch(TX.USER_REVOKE_PROFILE, { user_id: userId, profile_id: profileId }),
}

export const profileService = {
  get: (id: number): Promise<ApiResponse> =>
    dispatch(TX.PROF_GET, { profile_id: id }),
  getAll: (filters?: Record<string, unknown>): Promise<ApiResponse> =>
    dispatch(TX.PROF_GET_ALL, filters ?? {}),
  create: (params: { profile_na: string; profile_de?: string }): Promise<ApiResponse> =>
    dispatch(TX.PROF_CREATE, params),
  update: (params: { profile_id: number; profile_na?: string; profile_de?: string }): Promise<ApiResponse> =>
    dispatch(TX.PROF_UPDATE, params),
  delete: (id: number): Promise<ApiResponse> =>
    dispatch(TX.PROF_DELETE, { profile_id: id }),
  grantPermission: (profileId: number, objectName: string, methodName: string): Promise<ApiResponse> =>
    dispatch(TX.PROF_GRANT_PERM, { profile_id: profileId, object_na: objectName, method_na: methodName }),
  revokePermission: (profileId: number, objectName: string, methodName: string): Promise<ApiResponse> =>
    dispatch(TX.PROF_REVOKE_PERM, { profile_id: profileId, object_na: objectName, method_na: methodName }),
  assignSubsystem: (profileId: number, subsystemId: number): Promise<ApiResponse> =>
    dispatch(TX.PROF_ASSIGN_SUBSYSTEM, { profile_id: profileId, subsystem_id: subsystemId }),
  revokeSubsystem: (profileId: number, subsystemId: number): Promise<ApiResponse> =>
    dispatch(TX.PROF_REVOKE_SUBSYSTEM, { profile_id: profileId, subsystem_id: subsystemId }),
  assignMenu: (profileId: number, menuId: number): Promise<ApiResponse> =>
    dispatch(TX.PROF_ASSIGN_MENU, { profile_id: profileId, menu_id: menuId }),
  revokeMenu: (profileId: number, menuId: number): Promise<ApiResponse> =>
    dispatch(TX.PROF_REVOKE_MENU, { profile_id: profileId, menu_id: menuId }),
  assignOption: (profileId: number, optionId: number): Promise<ApiResponse> =>
    dispatch(TX.PROF_ASSIGN_OPTION, { profile_id: profileId, option_id: optionId }),
  revokeOption: (profileId: number, optionId: number): Promise<ApiResponse> =>
    dispatch(TX.PROF_REVOKE_OPTION, { profile_id: profileId, option_id: optionId }),
}

export const subsystemService = {
  get: (id: number): Promise<ApiResponse> =>
    dispatch(TX.SUB_GET, { subsystem_id: id }),
  getAll: (filters?: Record<string, unknown>): Promise<ApiResponse> =>
    dispatch(TX.SUB_GET_ALL, filters ?? {}),
  create: (params: { subsystem_na: string }): Promise<ApiResponse> =>
    dispatch(TX.SUB_CREATE, params),
  update: (params: { subsystem_id: number; subsystem_na?: string }): Promise<ApiResponse> =>
    dispatch(TX.SUB_UPDATE, params),
  delete: (id: number): Promise<ApiResponse> =>
    dispatch(TX.SUB_DELETE, { subsystem_id: id }),
}

export const objectService = {
  get: (id: number): Promise<ApiResponse> =>
    dispatch(TX.OBJ_GET, { object_id: id }),
  getAll: (filters?: Record<string, unknown>): Promise<ApiResponse> =>
    dispatch(TX.OBJ_GET_ALL, filters ?? {}),
  create: (params: { object_na: string }): Promise<ApiResponse> =>
    dispatch(TX.OBJ_CREATE, params),
  update: (params: { object_id: number; object_na?: string }): Promise<ApiResponse> =>
    dispatch(TX.OBJ_UPDATE, params),
  delete: (id: number): Promise<ApiResponse> =>
    dispatch(TX.OBJ_DELETE, { object_id: id }),
}

export const methodService = {
  get: (id: number): Promise<ApiResponse> =>
    dispatch(TX.METHOD_GET, { method_id: id }),
  getAll: (filters?: Record<string, unknown>): Promise<ApiResponse> =>
    dispatch(TX.METHOD_GET_ALL, filters ?? {}),
  create: (params: { method_na: string; object_id: number }): Promise<ApiResponse> =>
    dispatch(TX.METHOD_CREATE, params),
  update: (params: { method_id: number; method_na?: string }): Promise<ApiResponse> =>
    dispatch(TX.METHOD_UPDATE, params),
  delete: (id: number): Promise<ApiResponse> =>
    dispatch(TX.METHOD_DELETE, { method_id: id }),
}

export const menuService = {
  get: (id: number): Promise<ApiResponse> =>
    dispatch(TX.MENU_GET, { menu_id: id }),
  getAll: (filters?: Record<string, unknown>): Promise<ApiResponse> =>
    dispatch(TX.MENU_GET_ALL, filters ?? {}),
  create: (params: { menu_na: string; subsystem_id: number }): Promise<ApiResponse> =>
    dispatch(TX.MENU_CREATE, params),
  update: (params: { menu_id: number; menu_na?: string }): Promise<ApiResponse> =>
    dispatch(TX.MENU_UPDATE, params),
  delete: (id: number): Promise<ApiResponse> =>
    dispatch(TX.MENU_DELETE, { menu_id: id }),
}

export const optionService = {
  get: (id: number): Promise<ApiResponse> =>
    dispatch(TX.OPT_GET, { option_id: id }),
  getAll: (filters?: Record<string, unknown>): Promise<ApiResponse> =>
    dispatch(TX.OPT_GET_ALL, filters ?? {}),
  create: (params: { option_na: string; method_id?: number }): Promise<ApiResponse> =>
    dispatch(TX.OPT_CREATE, params),
  update: (params: { option_id: number; option_na?: string }): Promise<ApiResponse> =>
    dispatch(TX.OPT_UPDATE, params),
  delete: (id: number): Promise<ApiResponse> =>
    dispatch(TX.OPT_DELETE, { option_id: id }),
}

export const notificationService = {
  get: (id: number): Promise<ApiResponse> =>
    dispatch(TX.NOTIF_GET, { id }),
  getAll: (filters?: Record<string, unknown>): Promise<ApiResponse> =>
    dispatch(TX.NOTIF_GET_ALL, filters ?? {}),
  create: (params: Record<string, unknown>): Promise<ApiResponse> =>
    dispatch(TX.NOTIF_CREATE, params),
  update: (params: { id: number; [key: string]: unknown }): Promise<ApiResponse> =>
    dispatch(TX.NOTIF_UPDATE, params),
  delete: (id: number): Promise<ApiResponse> =>
    dispatch(TX.NOTIF_DELETE, { id }),
}
