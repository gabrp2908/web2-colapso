import { dispatch } from '../client'
import { TX } from '../tx-registry'
import type { ApiResponse } from '../types'

export const locationService = {
  get: (id: number): Promise<ApiResponse> =>
    dispatch(TX.LOC_GET, { location_id: id }),
  getAll: (filters?: { location_de?: string; location_sh?: number; location_dr?: number }): Promise<ApiResponse> =>
    dispatch(TX.LOC_GET_ALL, filters ?? {}),
  create: (params: { location_de: string; location_sh: number; location_dr: number }): Promise<ApiResponse> =>
    dispatch(TX.LOC_CREATE, params),
  update: (params: { location_id: number; location_de?: string; location_sh?: number; location_dr?: number }): Promise<ApiResponse> =>
    dispatch(TX.LOC_UPDATE, params),
  delete: (id: number): Promise<ApiResponse> =>
    dispatch(TX.LOC_DELETE, { location_id: id }),
}
