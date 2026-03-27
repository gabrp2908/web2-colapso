/**
 * Registro de transacciones (TX).
 *
 * Mapea BO.method → número de transacción.
 * Valores provisionales desde spec.json del backend.
 * Actualizar tras ejecutar `pnpm run db seed --registerBOs` si cambian.
 */
export const TX = {
  // ── Auth (1-9) ───────────────────────────────────
  AUTH_GET_NAVIGATION: 1,
  AUTH_REGISTER: 2,
  AUTH_REQUEST_EMAIL_VERIFICATION: 3,
  AUTH_REQUEST_PASSWORD_RESET: 4,
  AUTH_REQUEST_USERNAME: 5,
  AUTH_RESET_PASSWORD: 6,
  AUTH_SWITCH_PROFILE: 7,
  AUTH_VERIFY_EMAIL: 8,
  AUTH_VERIFY_PASSWORD_RESET: 9,

  // ── Category (10-14) ─────────────────────────────
  CAT_CREATE: 10,
  CAT_DELETE: 11,
  CAT_GET: 12,
  CAT_GET_ALL: 13,
  CAT_UPDATE: 14,

  // ── Component (15-19) ────────────────────────────
  COMP_CREATE: 15,
  COMP_DELETE: 16,
  COMP_GET: 17,
  COMP_GET_ALL: 18,
  COMP_UPDATE: 19,

  // ── Devolution (20-28) ───────────────────────────
  DEV_CREATE: 20,
  DEV_DELETE: 21,
  DEV_GET: 22,
  DEV_GET_ALL: 23,
  DEV_GET_ALL_DEVOLUTIONS: 24,
  DEV_GET_DEVOLUTION: 25,
  DEV_GET_USER_DEVOLUTION: 26,
  DEV_REGISTER_DEVOLUTION: 27,
  DEV_UPDATE: 28,

  // ── Equipment (29-33) ────────────────────────────
  EQUIP_CREATE: 29,
  EQUIP_DELETE: 30,
  EQUIP_GET: 31,
  EQUIP_GET_ALL: 32,
  EQUIP_UPDATE: 33,

  // ── Inventory (34-41) ────────────────────────────
  INV_ADD_STOCK: 34,
  INV_CREATE: 35,
  INV_DELETE: 36,
  INV_GET: 37,
  INV_GET_ALL: 38,
  INV_MOVE_LOCATION: 39,
  INV_REMOVE_STOCK: 40,
  INV_UPDATE: 41,

  // ── Lapse (42-46) ────────────────────────────────
  LAPSE_CREATE: 42,
  LAPSE_DELETE: 43,
  LAPSE_GET: 44,
  LAPSE_GET_ALL: 45,
  LAPSE_UPDATE: 46,

  // ── Loan (47-54) ─────────────────────────────────
  LOAN_ACCEPT_REQUEST: 47,
  LOAN_GET_ALL: 48,
  LOAN_GET_ALL_REQUESTS: 49,
  LOAN_GET: 50,
  LOAN_GET_REQUEST: 51,
  LOAN_REGISTER: 52,
  LOAN_REJECT_REQUEST: 53,
  LOAN_REQUEST: 54,

  // ── Location (55-59) ─────────────────────────────
  LOC_CREATE: 55,
  LOC_DELETE: 56,
  LOC_GET: 57,
  LOC_GET_ALL: 58,
  LOC_UPDATE: 59,

  // ── Menu (60-64) ─────────────────────────────────
  MENU_CREATE: 60,
  MENU_DELETE: 61,
  MENU_GET: 62,
  MENU_GET_ALL: 63,
  MENU_UPDATE: 64,

  // ── Method (65-69) ───────────────────────────────
  METHOD_CREATE: 65,
  METHOD_DELETE: 66,
  METHOD_GET: 67,
  METHOD_GET_ALL: 68,
  METHOD_UPDATE: 69,

  // ── Notification (70-74) ─────────────────────────
  NOTIF_CREATE: 70,
  NOTIF_DELETE: 71,
  NOTIF_GET: 72,
  NOTIF_GET_ALL: 73,
  NOTIF_UPDATE: 74,

  // ── Object (75-79) ───────────────────────────────
  OBJ_CREATE: 75,
  OBJ_DELETE: 76,
  OBJ_GET: 77,
  OBJ_GET_ALL: 78,
  OBJ_UPDATE: 79,

  // ── Option (80-84) ───────────────────────────────
  OPT_CREATE: 80,
  OPT_DELETE: 81,
  OPT_GET: 82,
  OPT_GET_ALL: 83,
  OPT_UPDATE: 84,

  // ── Profile (85-97) ──────────────────────────────
  PROF_ASSIGN_MENU: 85,
  PROF_ASSIGN_OPTION: 86,
  PROF_ASSIGN_SUBSYSTEM: 87,
  PROF_CREATE: 88,
  PROF_DELETE: 89,
  PROF_GET: 90,
  PROF_GET_ALL: 91,
  PROF_GRANT_PERM: 92,
  PROF_REVOKE_MENU: 93,
  PROF_REVOKE_OPTION: 94,
  PROF_REVOKE_PERM: 95,
  PROF_REVOKE_SUBSYSTEM: 96,
  PROF_UPDATE: 97,

  // ── Property (98-102) ─────────────────────────────
  PROP_CREATE: 98,
  PROP_DELETE: 99,
  PROP_GET: 100,
  PROP_GET_ALL: 101,
  PROP_UPDATE: 102,

  // ── Report (103-107) ──────────────────────────────
  REPORT_CREATE: 103,
  REPORT_DELETE: 104,
  REPORT_GET: 105,
  REPORT_GET_ALL: 106,
  REPORT_UPDATE: 107,

  // ── Subsystem (108-112) ──────────────────────────
  SUB_CREATE: 108,
  SUB_DELETE: 109,
  SUB_GET: 110,
  SUB_GET_ALL: 111,
  SUB_UPDATE: 112,

  // ── User (113-119) ───────────────────────────────
  USER_ASSIGN_PROFILE: 113,
  USER_CREATE: 114,
  USER_DELETE: 115,
  USER_GET: 116,
  USER_GET_ALL: 117,
  USER_REVOKE_PROFILE: 118,
  USER_UPDATE: 119,
} as const

export type TxKey = keyof typeof TX
