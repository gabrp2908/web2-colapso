import { dispatch } from '../client'
import { TX } from '../tx-registry'
import type { ApiResponse } from '../types'

export const lapseService = {
  get: (id: number): Promise<ApiResponse> =>
    dispatch(TX.LAPSE_GET, { lapse_id: id }),
  getAll: (filters?: { lapse_de?: string; lapse_act?: boolean; lapse_start_dt?: string; lapse_close_dt?: string }): Promise<ApiResponse> =>
    dispatch(TX.LAPSE_GET_ALL, filters ?? {}),
  create: (params: { lapse_de: string; lapse_act?: boolean; lapse_start_dt?: string; lapse_close_dt?: string }): Promise<ApiResponse> =>
    dispatch(TX.LAPSE_CREATE, params),
  update: (params: { lapse_id: number; lapse_de?: string; lapse_act?: boolean; lapse_start_dt?: string; lapse_close_dt?: string }): Promise<ApiResponse> =>
    dispatch(TX.LAPSE_UPDATE, params),
  delete: (id: number): Promise<ApiResponse> =>
    dispatch(TX.LAPSE_DELETE, { lapse_id: id }),
}
