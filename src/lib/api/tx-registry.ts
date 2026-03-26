/**
 * Registro de transacciones (TX).
 *
 * Mapea BO.method → número de transacción.
 * Valores provisionales desde spec.json del backend.
 * Actualizar tras ejecutar `pnpm run db seed --registerBOs` si cambian.
 */
export const TX = {
  // ── Auth (1-9) ───────────────────────────────────
  AUTH_REGISTER: 1,
  AUTH_VERIFY_EMAIL: 2,
  AUTH_REQUEST_EMAIL_VERIFICATION: 3,
  AUTH_REQUEST_PASSWORD_RESET: 4,
  AUTH_VERIFY_PASSWORD_RESET: 5,
  AUTH_RESET_PASSWORD: 6,
  AUTH_REQUEST_USERNAME: 7,
  AUTH_GET_NAVIGATION: 8,
  AUTH_SWITCH_PROFILE: 9,

  // ── Category (10-14) ─────────────────────────────
  CAT_GET: 10,
  CAT_GET_ALL: 11,
  CAT_CREATE: 12,
  CAT_UPDATE: 13,
  CAT_DELETE: 14,

  // ── Component (15-19) ────────────────────────────
  COMP_GET: 15,
  COMP_GET_ALL: 16,
  COMP_CREATE: 17,
  COMP_UPDATE: 18,
  COMP_DELETE: 19,

  // ── Devolution (20-24) ───────────────────────────
  DEV_GET: 20,
  DEV_GET_ALL: 21,
  DEV_CREATE: 22,
  DEV_UPDATE: 23,
  DEV_DELETE: 24,
  DEV_REGISTER_DEVOLUTION: 25,
  DEV_GET_ALL_DEVOLUTIONS: 26,
  DEV_GET_USER_DEVOLUTION: 27,
  DEV_GET_DEVOLUTION: 28,

  // ── Equipment (29-33) ────────────────────────────
  EQUIP_GET: 29,
  EQUIP_GET_ALL: 30,
  EQUIP_CREATE: 31,
  EQUIP_UPDATE: 32,
  EQUIP_DELETE: 33,

  // ── Inventory (34-41) ────────────────────────────
  INV_GET: 34,
  INV_GET_ALL: 35,
  INV_CREATE: 36,
  INV_UPDATE: 37,
  INV_DELETE: 38,
  INV_ADD_STOCK: 39,
  INV_REMOVE_STOCK: 40,
  INV_MOVE_LOCATION: 41,

  // ── Lapse (42-46) ────────────────────────────────
  LAPSE_GET: 42,
  LAPSE_GET_ALL: 43,
  LAPSE_CREATE: 44,
  LAPSE_UPDATE: 45,
  LAPSE_DELETE: 46,

  // ── Loan (47-54) ─────────────────────────────────
  LOAN_GET_REQUEST: 47,
  LOAN_GET_ALL_REQUESTS: 48,
  LOAN_REQUEST: 49,
  LOAN_ACCEPT_REQUEST: 50,
  LOAN_REJECT_REQUEST: 51,
  LOAN_GET: 52,
  LOAN_GET_ALL: 53,
  LOAN_REGISTER: 54,

  // ── Location (55-59) ─────────────────────────────
  LOC_GET_ALL: 55,
  LOC_CREATE: 56,
  LOC_UPDATE: 57,
  LOC_DELETE: 58,
  LOC_GET: 59,

  // ── Menu (60-64) ─────────────────────────────────
  MENU_GET: 60,
  MENU_GET_ALL: 61,
  MENU_CREATE: 62,
  MENU_UPDATE: 63,
  MENU_DELETE: 64,

  // ── Method (65-69) ───────────────────────────────
  METHOD_GET: 65,
  METHOD_GET_ALL: 66,
  METHOD_CREATE: 67,
  METHOD_UPDATE: 68,
  METHOD_DELETE: 69,

  // ── Notification (70-74) ─────────────────────────
  NOTIF_GET: 70,
  NOTIF_GET_ALL: 71,
  NOTIF_CREATE: 72,
  NOTIF_UPDATE: 73,
  NOTIF_DELETE: 74,

  // ── Object (75-79) ───────────────────────────────
  OBJ_GET: 75,
  OBJ_GET_ALL: 76,
  OBJ_CREATE: 77,
  OBJ_UPDATE: 78,
  OBJ_DELETE: 79,

  // ── Option (80-84) ───────────────────────────────
  OPT_GET: 80,
  OPT_GET_ALL: 81,
  OPT_CREATE: 82,
  OPT_UPDATE: 83,
  OPT_DELETE: 84,

  // ── Profile (85-97) ──────────────────────────────
  PROF_GET: 85,
  PROF_GET_ALL: 86,
  PROF_CREATE: 87,
  PROF_UPDATE: 88,
  PROF_DELETE: 89,
  PROF_GRANT_PERM: 90,
  PROF_REVOKE_PERM: 91,
  PROF_ASSIGN_SUBSYSTEM: 92,
  PROF_REVOKE_SUBSYSTEM: 93,
  PROF_ASSIGN_MENU: 94,
  PROF_REVOKE_MENU: 95,
  PROF_ASSIGN_OPTION: 96,
  PROF_REVOKE_OPTION: 97,

  // ── Property (98-102) ─────────────────────────────
  PROP_GET: 98,
  PROP_GET_ALL: 99,
  PROP_CREATE: 100,
  PROP_UPDATE: 101,
  PROP_DELETE: 102,

  // ── Report (103-107) ──────────────────────────────
  REPORT_GET: 103,
  REPORT_GET_ALL: 104,
  REPORT_CREATE: 105,
  REPORT_UPDATE: 106,
  REPORT_DELETE: 107,

  // ── Subsystem (108-112) ──────────────────────────
  SUB_GET: 108,
  SUB_GET_ALL: 109,
  SUB_CREATE: 110,
  SUB_UPDATE: 111,
  SUB_DELETE: 112,

  // ── User (113-119) ───────────────────────────────
  USER_GET: 113,
  USER_GET_ALL: 114,
  USER_CREATE: 115,
  USER_UPDATE: 116,
  USER_DELETE: 117,
  USER_ASSIGN_PROFILE: 118,
  USER_REVOKE_PROFILE: 119,
} as const

export type TxKey = keyof typeof TX
