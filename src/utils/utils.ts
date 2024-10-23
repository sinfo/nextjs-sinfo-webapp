export default function convertToAppRole(role: string): UserRole {
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
