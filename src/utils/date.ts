/** Fecha de hoy en Chile (YYYY-MM-DD) para localStorage, DB y ranking. */
export function getChileTodayISO(): string {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Santiago",
  });
}
