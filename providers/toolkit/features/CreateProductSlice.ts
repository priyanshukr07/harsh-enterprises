import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

export interface ThreadAttributes {
  denier?: string;
  length?: number;
  material?: string;
  plyCount?: number;
  spoolWeight?: number;
  strength?: number;
}

export interface CocopeatAttributes {
  weight?: number;
  ecLevel?: string;
  compression?: string;
  moisture?: number;
  ph?: number;
  expansion?: number;
  grade?: string;
}

export interface TrayAttributes {
  cavities?: number;
  cellVolume?: number;
  trayMaterial?: string;
  dimensions?: string;
  thickness?: number;
  rows?: number;
  columns?: number;
}

export interface ProductState {
  name: string;
  description: string;
  price: number;
  quantity: number;

  mainImage: string;
  otherImages: string[];

  sizes: string[];
  colors: string[];

  userId: string;

  // many-to-many
  categories: string[]; // category IDs or names

  // optional attribute blocks
  threadAttributes?: ThreadAttributes;
  cocopeatAttributes?: CocopeatAttributes;
  trayAttributes?: TrayAttributes;
}

const initialState: ProductState = {
  name: "",
  description: "",
  price: 0,
  quantity: 1,
  mainImage: "",
  otherImages: [],
  sizes: [],
  colors: [],
  userId: "",
  categories: [],
};

/* Async Thunk  */
export const CreatePro = createAsyncThunk(
  "products/create",
  async (productData: ProductState, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/products/create-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Product creation failed");

      toast.success("Product created successfully");
      return data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unexpected error occurred";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

/*  Slice  */
export const CreateProductSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(CreatePro.fulfilled, (_, action) => {
      return action.payload;
    });

    builder.addCase(CreatePro.rejected, (_, action) => {
      console.error("Create product failed:", action.payload);
    });
  },
});

export default CreateProductSlice.reducer;
