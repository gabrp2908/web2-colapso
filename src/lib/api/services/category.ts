import { dispatch } from '../client'
import { TX } from '../tx-registry'
import type { ApiResponse } from '../types'

export const categoryService = {
  get: (id: number): Promise<ApiResponse> =>
    dispatch(TX.CAT_GET, { category_id: id }),
  getAll: (filters?: { category_de?: string; category_type_id?: number }): Promise<ApiResponse> =>
    dispatch(TX.CAT_GET_ALL, filters ?? {}),
  create: (params: { category_de: string; category_type_id: number }): Promise<ApiResponse> =>
    dispatch(TX.CAT_CREATE, params),
  update: (params: { category_id: number; category_de?: string; category_type_id?: number }): Promise<ApiResponse> =>
    dispatch(TX.CAT_UPDATE, params),
  delete: (id: number): Promise<ApiResponse> =>
    dispatch(TX.CAT_DELETE, { category_id: id }),
}
