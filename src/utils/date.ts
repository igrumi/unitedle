export function getChileTodayISO(): string {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Santiago",
  });
}
