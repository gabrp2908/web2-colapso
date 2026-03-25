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

  // ── Equipment (25-29) ────────────────────────────
  EQUIP_GET: 25,
  EQUIP_GET_ALL: 26,
  EQUIP_CREATE: 27,
  EQUIP_UPDATE: 28,
  EQUIP_DELETE: 29,

  // ── Inventory (30-37) ────────────────────────────
  INV_GET: 30,
  INV_GET_ALL: 31,
  INV_CREATE: 32,
  INV_UPDATE: 33,
  INV_DELETE: 34,
  INV_ADD_STOCK: 35,
  INV_REMOVE_STOCK: 36,
  INV_MOVE_LOCATION: 37,

  // ── Lapse (38-42) ────────────────────────────────
  LAPSE_GET: 38,
  LAPSE_GET_ALL: 39,
  LAPSE_CREATE: 40,
  LAPSE_UPDATE: 41,
  LAPSE_DELETE: 42,

  // ── Loan (43-50) ─────────────────────────────────
  LOAN_GET_REQUEST: 43,
  LOAN_GET_ALL_REQUESTS: 44,
  LOAN_REQUEST: 45,
  LOAN_ACCEPT_REQUEST: 46,
  LOAN_REJECT_REQUEST: 47,
  LOAN_GET: 48,
  LOAN_GET_ALL: 49,
  LOAN_REGISTER: 50,

  // ── Location (51-55) ─────────────────────────────
  LOC_GET_ALL: 51,
  LOC_CREATE: 52,
  LOC_UPDATE: 53,
  LOC_DELETE: 54,
  LOC_GET: 55,

  // ── Menu (56-60) ─────────────────────────────────
  MENU_GET: 56,
  MENU_GET_ALL: 57,
  MENU_CREATE: 58,
  MENU_UPDATE: 59,
  MENU_DELETE: 60,

  // ── Method (61-65) ───────────────────────────────
  METHOD_GET: 61,
  METHOD_GET_ALL: 62,
  METHOD_CREATE: 63,
  METHOD_UPDATE: 64,
  METHOD_DELETE: 65,

  // ── Notification (66-70) ─────────────────────────
  NOTIF_GET: 66,
  NOTIF_GET_ALL: 67,
  NOTIF_CREATE: 68,
  NOTIF_UPDATE: 69,
  NOTIF_DELETE: 70,

  // ── Object (71-75) ───────────────────────────────
  OBJ_GET: 71,
  OBJ_GET_ALL: 72,
  OBJ_CREATE: 73,
  OBJ_UPDATE: 74,
  OBJ_DELETE: 75,

  // ── Option (76-80) ───────────────────────────────
  OPT_GET: 76,
  OPT_GET_ALL: 77,
  OPT_CREATE: 78,
  OPT_UPDATE: 79,
  OPT_DELETE: 80,

  // ── Profile (81-93) ──────────────────────────────
  PROF_GET: 81,
  PROF_GET_ALL: 82,
  PROF_CREATE: 83,
  PROF_UPDATE: 84,
  PROF_DELETE: 85,
  PROF_GRANT_PERM: 86,
  PROF_REVOKE_PERM: 87,
  PROF_ASSIGN_SUBSYSTEM: 88,
  PROF_REVOKE_SUBSYSTEM: 89,
  PROF_ASSIGN_MENU: 90,
  PROF_REVOKE_MENU: 91,
  PROF_ASSIGN_OPTION: 92,
  PROF_REVOKE_OPTION: 93,

  // ── Property (94-98) ─────────────────────────────
  PROP_GET: 94,
  PROP_GET_ALL: 95,
  PROP_CREATE: 96,
  PROP_UPDATE: 97,
  PROP_DELETE: 98,

  // ── Report (99-103) ──────────────────────────────
  REPORT_GET: 99,
  REPORT_GET_ALL: 100,
  REPORT_CREATE: 101,
  REPORT_UPDATE: 102,
  REPORT_DELETE: 103,

  // ── Subsystem (104-108) ──────────────────────────
  SUB_GET: 104,
  SUB_GET_ALL: 105,
  SUB_CREATE: 106,
  SUB_UPDATE: 107,
  SUB_DELETE: 108,

  // ── User (109-115) ───────────────────────────────
  USER_GET: 109,
  USER_GET_ALL: 110,
  USER_CREATE: 111,
  USER_UPDATE: 112,
  USER_DELETE: 113,
  USER_ASSIGN_PROFILE: 114,
  USER_REVOKE_PROFILE: 115,
} as const

export type TxKey = keyof typeof TX
