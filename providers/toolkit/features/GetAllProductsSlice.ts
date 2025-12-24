import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/* ---------- Types ---------- */

export type Category = {
  id: string;
  name: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  mainImage: string;
  otherImages: string[];
  categories: Category[];

  sizes?: string[];
  colors?: string[];

  // thread
  denier?: string;
  length?: number;
  material?: string;

  // cocopeat
  weight?: number;
  ecLevel?: string;
  compression?: string;

  // seedling tray
  cavities?: number;
  cellVolume?: number;
  trayMaterial?: string;
  dimensions?: string;

  createdAt: string;
  updatedAt: string;
};

export type ProductsResponse = {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
};

/* ---------- Base Query ---------- */

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "/api",
  credentials: "include",
});

/* ---------- API ---------- */

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery,
  tagTypes: ["Products", "Product"],
  endpoints: (builder) => ({

    /* ---------- Get All Products ---------- */
    getProducts: builder.query<
      ProductsResponse,
      {
        page?: number;
        limit?: number;
        search?: string;
        category?: string;
      }
    >({
      query: ({ page = 1, limit = 10, search, category }) => ({
        url: "/products/get-all-products",
        params: { page, limit, search, category },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.products.map((p) => ({
                type: "Product" as const,
                id: p.id,
              })),
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),

    /* ---------- Get Product By ID ---------- */
    getProductById: builder.query<Product, string>({
      query: (id) => `/products/get-all-products/${id}`,
      providesTags: (result, error, id) => [
        { type: "Product", id },
      ],
    }),
  }),
});

/* ---------- Hooks ---------- */

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
} = productsApi;
