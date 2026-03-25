import { dispatch } from '../client'
import { TX } from '../tx-registry'
import type { ApiResponse } from '../types'

export const inventoryService = {
  get: (inventoryId: number): Promise<ApiResponse> =>
    dispatch(TX.INV_GET, { inventory_id: inventoryId }),

  getAll: (filters?: { item_id?: number; location_id?: number; category_type_id?: number }): Promise<ApiResponse> =>
    dispatch(TX.INV_GET_ALL, filters ?? {}),

  create: (params: { item_id: number; location_id: number; inventory_qt: number }): Promise<ApiResponse> =>
    dispatch(TX.INV_CREATE, params),

  update: (params: { inventory_id: number; inventory_qt?: number; location_id?: number }): Promise<ApiResponse> =>
    dispatch(TX.INV_UPDATE, params),

  delete: (inventoryId: number): Promise<ApiResponse> =>
    dispatch(TX.INV_DELETE, { inventory_id: inventoryId }),

  addStock: (inventoryId: number, quantity: number): Promise<ApiResponse> =>
    dispatch(TX.INV_ADD_STOCK, { inventory_id: inventoryId, quantity }),

  removeStock: (inventoryId: number, quantity: number): Promise<ApiResponse> =>
    dispatch(TX.INV_REMOVE_STOCK, { inventory_id: inventoryId, quantity }),

  moveLocation: (inventoryId: number, locationId: number): Promise<ApiResponse> =>
    dispatch(TX.INV_MOVE_LOCATION, { inventory_id: inventoryId, location_id: locationId }),
}
