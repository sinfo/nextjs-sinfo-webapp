import { VerifyOptions } from "jsonwebtoken";

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

export function isMember(role: string): boolean {
  const appRole = convertToAppRole(role);
  return appRole === "Member" || appRole === "Admin";
}

export function isCompany(role: string): boolean {
  const appRole = convertToAppRole(role);
  return appRole === "Company";
}

export function formatAchievementKind(kind: AchievementKind): string {
  switch (kind) {
    case "cv":
      return "CV";
    default:
      const result = kind.replace(/([A-Z])/g, " $1");
      return result.charAt(0).toUpperCase() + result.slice(1);
  }
}

export function trimText(text: string, n: number): string {
  if (text.length <= n) return text;
  return text.slice(0, n) + "...";
}

export function generateTimeInterval(
  timestamp: string,
  durationMinutes: number,
  { onlyHours }: { onlyHours?: boolean } = {}
): string {
  // extract "HH:mm" from ISO string
  const formatTime = (date: Date) => date.toISOString().slice(11, 16);

  const startDate = new Date(timestamp);
  const endDate = new Date(startDate.getTime() + durationMinutes * 60000);

  return `${
    onlyHours
      ? formatTime(startDate)
      : startDate.toLocaleDateString("en-GB", {
          timeZone: "UTC",
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        })
  } - ${formatTime(endDate)}`;
}

export function getEventDay(date: string): string {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
  });
}

export function getEventMonth(date: string, short: boolean = false): string {
  return new Date(date).toLocaleDateString("en-GB", {
    month: short ? "short" : "long",
  });
}

export function getEventWeekday(date: string, short: boolean = false): string {
  return new Date(date).toLocaleDateString("en-GB", {
    weekday: short ? "short" : "long",
  });
}

export function getEventFullDate(date: string): string {
  return new Date(date).toLocaleDateString("en-GB", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// TODO: Implement this correctly
export function isValidQRCode(
  data: string,
  jwtOptions?: VerifyOptions
): boolean {
  return data.startsWith("sinfo://");
}

// TODO: Implement this correctly
export function getUserFromQRCode(data: string): User | null {
  if (!isValidQRCode(data, { subject: "user" })) return null;
  //return (jwt.decode(data.split("sinfo://")[1]) as JwtPayload).user as User;
  return JSON.parse(atob(data.split("sinfo://")[1])).user as User;
}

export function isToday(date: Date): boolean {
  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

export function extractSpinWheelAchievements(user: User) {
  return (
    user.editionAchievements?.filter((a) => {
      // reject if not stand achievement
      if (a.achievement.kind != "stand" || a.achievement.company === undefined)
        return false;

      // reject if not achieved today
      const achievedTime = new Date(a.achieved);
      if (isNaN(achievedTime.getTime()) || !isToday(achievedTime)) return false;

      // accept if no spins yet
      if (user.lastSpin === undefined) return true;
      const lastSpinTime = new Date(user.lastSpin);
      if (isNaN(lastSpinTime.getTime())) return true;

      // accept if achieved after last spin
      return achievedTime > lastSpinTime;
    }) || []
  );
}
