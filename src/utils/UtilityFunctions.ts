export const getUserColor = (role: string) => {
  switch (role) {
    case "team":
    case "admin":
      return "#296CB2"; // blue
    case "company":
      return "#B17EC9"; // pink
    case "attendee":
    default:
      return "#74C48A"; // green
  }
};

export const getDisplayRole = (role: string) => {
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
};
