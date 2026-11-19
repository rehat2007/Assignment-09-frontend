export type AppRole = "customer" | "technician" | "admin";

export function getAppRole(user: {
  role?: string | null;
  accountType?: string | null;
}): AppRole {
  // The admin plugin can store multiple comma-separated roles.
  const systemRoles = String(user.role ?? "")
    .split(",")
    .map((role) => role.trim());

  if (systemRoles.includes("admin")) return "admin";
  if (user.accountType === "technician") return "technician";
  return "customer";
}
