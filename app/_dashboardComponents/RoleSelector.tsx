import { ROLES, ROLE_PERMISSIONS, ROLE_HIERARCHY, isValidRole, Role } from "@/lib/roles";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  targetUser: {
    id:   string;
    role: string;
  };
  currentUserRole: string;
  onRoleChange: (userId: string, newRole: Role) => void;
  loading?: boolean;
};

export const RoleSelector = ({
  targetUser,
  currentUserRole,
  onRoleChange,
  loading = false,
}: Props) => {

  // Guard invalid roles
  if (!isValidRole(currentUserRole) || !isValidRole(targetUser.role)) {
    return <Badge variant="outline">{targetUser.role}</Badge>;
  }

  const assignableRoles = ROLE_PERMISSIONS[currentUserRole].canAssign;

  // Disable if current user has no assign permissions
  // or target user is higher/equal rank
  const isDisabled =
    loading ||
    assignableRoles.length === 0 ||
    ROLE_HIERARCHY[targetUser.role] >= ROLE_HIERARCHY[currentUserRole];

  if (isDisabled) {
    return (
      <Badge
        variant={
          targetUser.role === "ADMIN"
            ? "default"
            : targetUser.role === "MANAGER"
            ? "secondary"
            : "outline"
        }
      >
        {targetUser.role.charAt(0) + targetUser.role.slice(1).toLowerCase()}
      </Badge>
    );
  }

  return (
    <Select
      value={targetUser.role}
      onValueChange={(value) => {
        if (isValidRole(value)) {
          onRoleChange(targetUser.id, value);
        }
      }}
      disabled={loading}
    >
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {(Object.values(ROLES) as Role[])
          .filter((role) => assignableRoles.includes(role))
          .map((role) => (
            <SelectItem key={role} value={role}>
              {role.charAt(0) + role.slice(1).toLowerCase()}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};