import { useState } from "react";
import { toast } from "sonner";
import { Role } from "@/lib/roles";

export const useRoleChange = (onSuccess: () => void) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const changeRole = async (targetUserId: string, newRole: Role) => {
    setLoadingId(targetUserId);
    try {
      const res = await fetch("/api/users/change-role", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ targetUserId, newRole }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message ?? "Failed to update role");
        return;
      }

      toast.success(data.message ?? "Role updated successfully");
      onSuccess();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoadingId(null);
    }
  };

  return { changeRole, loadingId };
};