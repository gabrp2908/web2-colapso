import { dispatch } from '../client'
import { TX } from '../tx-registry'
import type { ApiResponse } from '../types'

export const devolutionService = {
  get: (id: number): Promise<ApiResponse> =>
    dispatch(TX.DEV_GET, { id }),
  getAll: (): Promise<ApiResponse> =>
    dispatch(TX.DEV_GET_ALL, {}),
  create: (params: Record<string, unknown>): Promise<ApiResponse> =>
    dispatch(TX.DEV_CREATE, params),
  update: (params: { id: number; [key: string]: unknown }): Promise<ApiResponse> =>
    dispatch(TX.DEV_UPDATE, params),
  delete: (id: number): Promise<ApiResponse> =>
    dispatch(TX.DEV_DELETE, { id }),
}

export const reportService = {
  get: (id: number): Promise<ApiResponse> =>
    dispatch(TX.REPORT_GET, { report_id: id }),
  getAll: (filters?: Record<string, unknown>): Promise<ApiResponse> =>
    dispatch(TX.REPORT_GET_ALL, filters ?? {}),
  create: (params: Record<string, unknown>): Promise<ApiResponse> =>
    dispatch(TX.REPORT_CREATE, params),
  update: (params: { report_id: number; [key: string]: unknown }): Promise<ApiResponse> =>
    dispatch(TX.REPORT_UPDATE, params),
  delete: (id: number): Promise<ApiResponse> =>
    dispatch(TX.REPORT_DELETE, { report_id: id }),
}

export const propertyService = {
  get: (id: number): Promise<ApiResponse> =>
    dispatch(TX.PROP_GET, { property_id: id }),
  getAll: (filters?: Record<string, unknown>): Promise<ApiResponse> =>
    dispatch(TX.PROP_GET_ALL, filters ?? {}),
  create: (params: Record<string, unknown>): Promise<ApiResponse> =>
    dispatch(TX.PROP_CREATE, params),
  update: (params: { property_id: number; [key: string]: unknown }): Promise<ApiResponse> =>
    dispatch(TX.PROP_UPDATE, params),
  delete: (id: number): Promise<ApiResponse> =>
    dispatch(TX.PROP_DELETE, { property_id: id }),
}
