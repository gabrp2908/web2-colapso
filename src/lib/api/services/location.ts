import { dispatch } from '../client'
import { TX } from '../tx-registry'
import type { ApiResponse } from '../types'

export const locationService = {
  get: (id: number): Promise<ApiResponse> =>
    dispatch(TX.LOC_GET, { location_id: id }),
  getAll: (filters?: { location_na?: string }): Promise<ApiResponse> =>
    dispatch(TX.LOC_GET_ALL, filters ?? {}),
  create: (params: { location_na: string; location_de?: string }): Promise<ApiResponse> =>
    dispatch(TX.LOC_CREATE, params),
  update: (params: { location_id: number; location_na?: string; location_de?: string }): Promise<ApiResponse> =>
    dispatch(TX.LOC_UPDATE, params),
  delete: (id: number): Promise<ApiResponse> =>
    dispatch(TX.LOC_DELETE, { location_id: id }),
}
