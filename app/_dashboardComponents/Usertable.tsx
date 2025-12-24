"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowUpDown, User2Icon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import {
  useGetUsersQuery,
  useToggleManagerRoleMutation,
} from "@/providers/toolkit/features/GetAllUserSlice";
import { useDebounce } from "@/providers/toolkit/hooks/useDebounce";
import { useSession } from "next-auth/react";
import { Role } from "@prisma/client";

/* ---------- Types ---------- */
type SortBy = "createdAt" | "role" | "name" | "email";
type SortOrder = "asc" | "desc";
type RoleFilter = "all" | "admin" | "user" | "manager";

const SORT_BY_VALUES: readonly SortBy[] = [
  "createdAt",
  "role",
  "name",
  "email",
];

const Usertable = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const isCurrentUserAdmin = session?.user?.role === Role.ADMIN;

  /* ---------- URL params ---------- */
  const sortByParam = searchParams.get("sortBy");
  const orderParam = searchParams.get("order");

  /* ---------- State ---------- */
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const [role, setRole] = useState<RoleFilter>(
    ((searchParams.get("role") as RoleFilter) || "all") as RoleFilter
  );

  const [search, setSearch] = useState(searchParams.get("search") || "");

  const [sortBy, setSortBy] = useState<SortBy>(
    SORT_BY_VALUES.includes(sortByParam as SortBy)
      ? (sortByParam as SortBy)
      : "createdAt"
  );

  const [sortOrder, setSortOrder] = useState<SortOrder>(
    orderParam === "asc" || orderParam === "desc" ? orderParam : "desc"
  );

  const debouncedSearch = useDebounce(search, 500);

  /* ---------- Sync URL ---------- */
  useEffect(() => {
    const params = new URLSearchParams();

    params.set("page", String(page));
    if (role !== "all") params.set("role", role);
    if (debouncedSearch) params.set("search", debouncedSearch);

    params.set("sortBy", sortBy);
    params.set("order", sortOrder);

    router.replace(`?${params.toString()}`);
  }, [page, role, debouncedSearch, sortBy, sortOrder, router]);

  /* ---------- API ---------- */
  const { data, isFetching } = useGetUsersQuery({
    page,
    limit: 10,
    search: debouncedSearch || undefined,
    role: role === "all" ? undefined : (role.toUpperCase() as Role),
    sortBy,
    sortOrder,
  });

  const [toggleManagerRole] = useToggleManagerRoleMutation();

  /* ---------- Handlers ---------- */
  const handleToggle = async (userId: string, role: string) => {
    if (session?.user?.id === userId && role === "admin") {
      alert("You cannot remove your own admin access.");
      return;
    }
    await toggleManagerRole({ userId });

    if (role === "user") {
      setRole("manager");
      setPage(1);
    }
  };

  const handleSort = (column: SortBy) => {
    setSortBy(column);
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    setPage(1);
  };

  /* ---------- UI ---------- */
  return (
    <Card>
      <CardHeader className="space-y-4">
        <div>
          <div className="flex gap-2 pb-3 items-center">
            <CardTitle>Users</CardTitle>
            <User2Icon className="h-6 w-6" />
          </div>
          <CardDescription>
            Manage users, roles, and permissions
          </CardDescription>
        </div>

        <div className="flex flex-wrap gap-3">
          <Input
            placeholder="Search name or email…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="max-w-sm"
          />

          {(["all", "admin", "user", "manager"] as const).map((r) => (
            <Button
              key={r}
              size="sm"
              variant={role === r ? "default" : "outline"}
              onClick={() => {
                setRole(r);
                setPage(1);
              }}
            >
              {r.toUpperCase()}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>

              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("role")}
                >
                  Role <ArrowUpDown className="ml-1 h-4 w-4" />
                </Button>
              </TableHead>

              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("createdAt")}
                >
                  Joined <ArrowUpDown className="ml-1 h-4 w-4" />
                </Button>
              </TableHead>

              <TableHead className="text-right">Admin</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {user.name?.[0]?.toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm">
                    {user.name || "Unnamed"}
                  </span>
                </TableCell>

                <TableCell className="text-muted-foreground">
                  {user.email}
                </TableCell>

                <TableCell>
                  <Badge variant={user.role === "ADMIN" ? "primary" : user.role === "MANAGER" ? "secondary" : "default"}>
                    {user.role === "ADMIN" ? "Admin" : user.role === "MANAGER" ? "Manager" : "User"}
                  </Badge>
                </TableCell>

                <TableCell className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(user.createdAt), {
                    addSuffix: true,
                  })}
                </TableCell>

                <TableCell className="text-right">
                  <Switch
                    checked={user.role === "ADMIN"}
                    disabled={!isCurrentUserAdmin}
                    onCheckedChange={() => handleToggle(user.id, user.role)}
                  />
                </TableCell>
              </TableRow>
            ))}

            {!isFetching && !data?.users?.length && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {data && data.totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <span className="text-sm text-muted-foreground">
              Page {data.page} of {data.totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page === data.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Usertable;
