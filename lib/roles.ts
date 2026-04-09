export const ROLES = {
  ADMIN:   "ADMIN",
  MANAGER: "MANAGER",
  USER:    "USER",
} as const;

export type Role = keyof typeof ROLES;

export const ROLE_HIERARCHY: Record<Role, number> = {
  ADMIN:   3,
  MANAGER: 2,
  USER:    1,
};

export const ROLE_PERMISSIONS: Record<Role, { canAssign: Role[]; canView: Role[] }> = {
  ADMIN: {
    canAssign: ["ADMIN", "MANAGER", "USER"],
    canView:   ["ADMIN", "MANAGER", "USER"],
  },
  MANAGER: {
    canAssign: ["USER"],
    canView:   ["USER"],
  },
  USER: {
    canAssign: [],
    canView:   [],
  },
};

export const isValidRole = (role: unknown): role is Role => {
  return Object.values(ROLES).includes(role as Role);
};