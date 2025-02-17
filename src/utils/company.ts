export function isHereToday(company: Company): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return company.stands?.some((s) => s.date.slice(0, 10) === today) || false;
}
