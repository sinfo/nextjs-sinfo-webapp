import config from "../../tailwind.config";

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

export function isAttendee(role: string): boolean {
  const appRole = convertToAppRole(role);
  return appRole === "Attendee";
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
  kind?: "user" | "achievement"
): boolean {
  try {
    return (
      data.startsWith("sinfo://") &&
      (kind === undefined ||
        JSON.parse(atob(data.split("sinfo://")[1])).kind === kind)
    );
  } catch {
    return false;
  }
}

// TODO: Implement this correctly
export function getUserFromQRCode(data: string): User | null {
  if (!isValidQRCode(data, "user")) return null;
  return JSON.parse(atob(data.split("sinfo://")[1])).user as User;
}

// TODO: Implement this correctly
export function getAchievementFromQRCode(data: string): string | null {
  if (!isValidQRCode(data, "achievement")) return null;
  return JSON.parse(atob(data.split("sinfo://")[1])).achievement as string;
}

export function getSessionColor(sessionKind: string) {
  switch (sessionKind) {
    case "Presentation":
      return config.theme.extend.colors.sinfo.tertiary;
    case "Workshop":
      return config.theme.extend.colors.sinfo.quaternary;
    case "Keynote":
      return config.theme.extend.colors.sinfo.secondary;
    default:
      return "#000";
  }
}

export function getUserActiveSignatureData(user: User, edition: string) {
  let relevantSignatures = user.signatures?.find(
    (s) => s.edition === edition && new Date().getDate().toString() === s.day,
  );
  if (!relevantSignatures) return null;

  const singatureMap: { [key: string]: SINFOSignature } = {};
  relevantSignatures.signatures.map((s) => {
    const curr = singatureMap[s.companyId];
    if (!curr) {
      singatureMap[s.companyId] = s;
      return;
    }
    if (new Date(s.date) < new Date(curr.date)) {
      singatureMap[s.date] = s;
    }
  });

  return {
    ...relevantSignatures,
    signatures: Object.values(singatureMap),
  };
}
