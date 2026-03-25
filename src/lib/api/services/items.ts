import { dispatch } from '../client'
import { TX } from '../tx-registry'
import type { ApiResponse } from '../types'

export const componentService = {
  get: (itemId: number): Promise<ApiResponse> =>
    dispatch(TX.COMP_GET, { item_id: itemId }),
  getAll: (filters?: { item_cod?: number; item_na?: string; category_id?: number }): Promise<ApiResponse> =>
    dispatch(TX.COMP_GET_ALL, filters ?? {}),
  create: (params: { item_cod: number; item_na: string; category_id: number }): Promise<ApiResponse> =>
    dispatch(TX.COMP_CREATE, params),
  update: (params: { item_id: number; item_cod?: number; item_na?: string; category_id?: number }): Promise<ApiResponse> =>
    dispatch(TX.COMP_UPDATE, params),
  delete: (itemId: number): Promise<ApiResponse> =>
    dispatch(TX.COMP_DELETE, { item_id: itemId }),
}

export const equipmentService = {
  get: (itemId: number): Promise<ApiResponse> =>
    dispatch(TX.EQUIP_GET, { item_id: itemId }),
  getAll: (filters?: { item_cod?: number; item_na?: string; category_id?: number }): Promise<ApiResponse> =>
    dispatch(TX.EQUIP_GET_ALL, filters ?? {}),
  create: (params: { item_cod: number; item_na: string; category_id: number }): Promise<ApiResponse> =>
    dispatch(TX.EQUIP_CREATE, params),
  update: (params: { item_id: number; item_cod?: number; item_na?: string; category_id?: number }): Promise<ApiResponse> =>
    dispatch(TX.EQUIP_UPDATE, params),
  delete: (itemId: number): Promise<ApiResponse> =>
    dispatch(TX.EQUIP_DELETE, { item_id: itemId }),
}
