import { dispatch } from '../client'
import { TX } from '../tx-registry'
import type { ApiResponse } from '../types'

export const loanService = {
  getRequest: (movementId: number, includeTrace?: boolean): Promise<ApiResponse> =>
    dispatch(TX.LOAN_GET_REQUEST, { movement_id: movementId, include_trace: includeTrace }),

  getAllRequests: (filters?: { user_id?: number; lapse_id?: number; from_dt?: string; to_dt?: string }): Promise<ApiResponse> =>
    dispatch(TX.LOAN_GET_ALL_REQUESTS, filters ?? {}),

  requestLoan: (params: {
    user_id: number
    movement_ob: string
    details: Array<{ inventory_id: number; movement_detail_am: number; movement_detail_ob?: string }>
  }): Promise<ApiResponse> =>
    dispatch(TX.LOAN_REQUEST, params),

  acceptRequest: (params: {
    movement_id: number
    movement_estimated_return_dt: string
    movement_ob?: string
    actor_user_id?: number
  }): Promise<ApiResponse> =>
    dispatch(TX.LOAN_ACCEPT_REQUEST, params),

  rejectRequest: (params: {
    movement_id: number
    movement_ob: string
    actor_user_id?: number
  }): Promise<ApiResponse> =>
    dispatch(TX.LOAN_REJECT_REQUEST, params),

  getLoan: (movementId: number, includeTrace?: boolean): Promise<ApiResponse> =>
    dispatch(TX.LOAN_GET, { movement_id: movementId, include_trace: includeTrace }),

  getAllLoans: (filters?: { user_id?: number; lapse_id?: number; from_dt?: string; to_dt?: string }): Promise<ApiResponse> =>
    dispatch(TX.LOAN_GET_ALL, filters ?? {}),

  registerLoan: (params: {
    movement_id: number
    movement_booking_dt?: string
    movement_ob?: string
    actor_user_id?: number
    details?: Array<{ inventory_id: number; movement_detail_am: number; movement_detail_ob?: string }>
  }): Promise<ApiResponse> =>
    dispatch(TX.LOAN_REGISTER, params),
}
