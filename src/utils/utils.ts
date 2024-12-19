export function convertToAppRole(role: string): UserRole {
  switch (role) {
    case "company":
      return "Company";
    case "team":
      return "Member";
    case "admin":
      return "Admin";
    case "user":
    default:
      return "Attendee";
  }
}

export function trimText(text: string, n: number): string {
  if (text.length <= n) return text;
  return text.slice(0, n) + "...";
}

export function generateTimeInterval(
  timestamp: string,
  durationMinutes: number
): string {
  // extract "HH:mm" from ISO string
  const formatTime = (date: Date) => date.toISOString().slice(11, 16);

  const startDate = new Date(timestamp);
  const endDate = new Date(startDate.getTime() + durationMinutes * 60000);

  return `${formatTime(startDate)} - ${formatTime(endDate)}`;
}
