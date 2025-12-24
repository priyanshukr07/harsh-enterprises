"use client";

import { useMemo } from "react";
import {
  useGetProductsQuery,
  Product,
} from "@/providers/toolkit/features/GetAllProductsSlice";
import ProductCard from "./ProductCard";
import ProductsSkeletons from "../temp/ProductsSkeletons";

/* ---------- Utils ---------- */

/** Fisher–Yates shuffle (pure function) */
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/* ---------- Component ---------- */

const HomeProducts = () => {
  const { data, error, isLoading } = useGetProductsQuery({ limit: 20 });

  /**
   * Memoized random products
   * recalculates ONLY when products array changes
   */
  const randomProducts = useMemo(() => {
    const products = data?.products ?? [];
    if (products.length === 0) return [];
    return shuffleArray(products).slice(0, 8);
  }, [data?.products]);

  /* ---------- Loading ---------- */
  if (isLoading) {
    return (
      <section className="py-10">
        <ProductsSkeletons />
      </section>
    );
  }

  /* ---------- Error ---------- */
  if (error) {
    return (
      <section className="py-16 text-center">
        <h2 className="text-2xl font-semibold text-red-500">
          Unable to load products
        </h2>
        <p className="mt-2 text-muted-foreground">
          Please refresh the page or try again later.
        </p>
      </section>
    );
  }

  /* ---------- UI ---------- */
  return (
    <section className="py-16">
      {/* Header */}
      <div className="mb-10 text-center">
        <span
          className="
            inline-block mb-3 rounded-full px-4 py-1 text-sm font-medium
            bg-green-100 text-green-700
            dark:bg-green-900/40 dark:text-green-300
          "
        >
          Handpicked for Growth
        </span>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
          Featured Products from{" "}
          <span className="text-green-600 dark:text-green-400">
            Harsh Enterprises
          </span>
        </h2>

        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          Explore our premium cocopeat, seedling trays, and agricultural
          essentials trusted by farmers and nurseries.
        </p>
      </div>

      {/* Products Grid */}
      {randomProducts.length > 0 ? (
        <div
          className="
            grid gap-6 px-3
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            xl:grid-cols-4
          "
        >
          {randomProducts.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <h3 className="text-xl font-semibold text-muted-foreground">
            No products available right now
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            New agricultural products are added regularly 🌱
          </p>
        </div>
      )}
    </section>
  );
};

export default HomeProducts;
