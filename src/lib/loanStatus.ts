export type LoanStatus = "active" | "overdue" | "returned" | "pending";

function normalizeText(value: unknown): string {
  return String(value ?? "").toLowerCase().trim();
}

export function parseLoanDate(value: unknown): Date | null {
  if (!value) return null;

  const raw = String(value).trim();

  // ISO / RFC-like formats should keep native parsing
  if (/^\d{4}-\d{2}-\d{2}/.test(raw) || /T\d{2}:\d{2}/.test(raw)) {
    const isoDate = new Date(raw);
    return Number.isNaN(isoDate.getTime()) ? null : isoDate;
  }

  // Latam format: dd/mm/yyyy [hh:mm[:ss] [a. m.|p. m.|am|pm]]
  const cleaned = raw
    .replace(/\u00a0/g, " ")
    .replace(/a\.\s*m\./gi, "am")
    .replace(/p\.\s*m\./gi, "pm")
    .replace(/\s+/g, " ")
    .trim();

  const match = cleaned.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:,?\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(am|pm)?)?$/i
  );

  if (match) {
    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);
    let hour = Number(match[4] ?? 0);
    const minute = Number(match[5] ?? 0);
    const second = Number(match[6] ?? 0);
    const meridiem = (match[7] ?? "").toLowerCase();

    if (meridiem === "pm" && hour < 12) hour += 12;
    if (meridiem === "am" && hour === 12) hour = 0;

    const localDate = new Date(year, month - 1, day, hour, minute, second, 0);

    // Validate overflow (e.g. 32/13/2026)
    if (
      localDate.getFullYear() === year &&
      localDate.getMonth() === month - 1 &&
      localDate.getDate() === day
    ) {
      return localDate;
    }
    return null;
  }

  const fallback = new Date(cleaned);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
}

export function formatLoanDateYmd(value: unknown): string {
  const date = parseLoanDate(value);
  if (!date) return "";

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function resolveLoanStatus(loan: Record<string, unknown>): LoanStatus {
  const raw = normalizeText((loan as any).loan_status ?? (loan as any).movement_status ?? (loan as any).movement_type_de);

  if (raw.includes("devuelt") || raw.includes("return")) return "returned";
  if (raw.includes("vencid") || raw.includes("overdue")) return "overdue";
  if (raw.includes("pend") || raw.includes("solicit") || raw.includes("request")) return "pending";
  if (raw.includes("activ") || raw.includes("prest") || raw.includes("accept")) return "active";

  const estimated = parseLoanDate((loan as any).movement_estimated_return_dt);
  if (!estimated) return "active";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  estimated.setHours(0, 0, 0, 0);

  return estimated < today ? "overdue" : "active";
}

export function getDueLabel(loan: Record<string, unknown>): string {
  const estimated = parseLoanDate((loan as any).movement_estimated_return_dt);
  if (!estimated) return "Sin fecha";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  estimated.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((estimated.getTime() - today.getTime()) / 86400000);
  if (diffDays < 0) return `${Math.abs(diffDays)} dia(s) vencido`;
  if (diffDays === 0) return "Vence hoy";
  return `${diffDays} dia(s) restantes`;
}
