import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/* ---------- Types ---------- */

export type User = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER" | "MANAGER";
  createdAt: string;
  updatedAt: string;
};

export type UsersResponse = {
  users: User[];
  total: number;
  page: number;
  totalPages: number;
};

export type SortBy = "createdAt" | "role" | "name" | "email";
export type SortOrder = "asc" | "desc";

/* ---------- Base Query ---------- */

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "/api",
  credentials: "include",
});

/* ---------- API ---------- */

export const userAPI = createApi({
  reducerPath: "userAPI",
  baseQuery,
  tagTypes: ["Users"],

  endpoints: (builder) => ({
    /* ---------- GET USERS ---------- */
    getUsers: builder.query<
      UsersResponse,
      {
        page?: number;
        limit?: number;
        search?: string;
        role?: "ADMIN" | "USER" | "MANAGER";
        sortBy?: SortBy;
        sortOrder?: SortOrder;
      }
    >({
      query: ({
        page = 1,
        limit = 10,
        search,
        role,
        sortBy = "createdAt",
        sortOrder = "desc",
      }) => ({
        url: "/users/get-all-users",
        params: {
          page,
          limit,
          search,
          role,
          sortBy,
          sortOrder,
        },
      }),
      providesTags: ["Users"],
    }),

    /* ---------- GET USER BY ID ---------- */
    getUserById: builder.query<User, string>({
      query: (id) => `/users/get-all-users/${id}`,
      providesTags: ["Users"],
    }),

    /* ---------- TOGGLE ADMIN ROLE ---------- */
    toggleManagerRole: builder.mutation<{ success: boolean }, { userId: string }>(
      {
        query: ({ userId }) => ({
          url: `/users/toggle-manager/${userId}`,
          method: "PATCH",
        }),
        invalidatesTags: ["Users"],
      }
    ),

    /* ---------- DELETE USER ---------- */
    deleteUser: builder.mutation<{ success: boolean }, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

/* ---------- Hooks ---------- */

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useToggleManagerRoleMutation,
  useDeleteUserMutation,
} = userAPI;
