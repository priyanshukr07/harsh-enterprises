import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

export interface ProductState {
  name: string;
  price: number;
  description: string;
  mainImage: string[];
  otherImages: string[];
  userId: string;
  categories: string;
  sizes?: string[];
  colors?: string[];
  
  denier?: string;
  length?: number;
  material?: string;

  weight?: number;
  ecLevel?: string;
  compression?: string;

  cavities?: number;
  cellVolume?: number;
  trayMaterial?: string;
  dimensions?: string;
}

const initialState: ProductState = {
  name: "",
  price: 0,
  description: "",
  mainImage: [],
  otherImages: [],
  userId: "",
  categories: "",
  sizes: [],
  colors: [],
};

export const CreatePro = createAsyncThunk(
  "products/create",
  async (productData: ProductState, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/products/create-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: productData?.name,
          price: productData?.price,
          description: productData?.description,
          mainImage: productData?.mainImage,
          otherImages: productData?.otherImages,
          userId: productData?.userId,
          categories: { name: productData.categories },
          sizes: productData?.sizes,
          colors: productData?.colors,

          // NEW CATEGORY SPECIFIC ATTRIBUTES
          denier: productData?.denier,
          length: productData?.length,
          material: productData?.material,

          weight: productData?.weight,
          ecLevel: productData?.ecLevel,
          compression: productData?.compression,

          cavities: productData?.cavities,
          cellVolume: productData?.cellVolume,
          trayMaterial: productData?.trayMaterial,
          dimensions: productData?.dimensions,

          quantity: 1,
        }),
      });

      if (!response.ok) throw new Error("Product creation failed");

      const product = await response.json();

      if (product.message === "Product created successfully") {
        toast.success("Product created successfully");
        return product;
      }

      return rejectWithValue(product.message || "Product creation failed");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const CreateProductSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(CreatePro.fulfilled, (state, action) => {
      return action.payload;
    });

    builder.addCase(CreatePro.rejected, (state, action) => {
      console.log(action.error.message);
    });
  },
});

export default CreateProductSlice.reducer;
