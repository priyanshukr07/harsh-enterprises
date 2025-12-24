"use client";

import { useEffect, useState, useMemo } from "react";
import ProductCard from "@/app/components/ProductCard";
import { Grid, List, Search, Menu } from "lucide-react";
import { useGetProductsQuery } from "@/providers/toolkit/features/GetAllProductsSlice";
import ProductsSkeletons from "@/app/temp/ProductsSkeletons";
import {
  useAppDispatch,
  useAppSelector,
} from "@/providers/toolkit/hooks/hooks";
import { GetProductsByCategory } from "@/providers/toolkit/features/GetProductsByCategorySlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ---------- Types ---------- */
type UIProduct = {
  id: string;
  name: string;
  price: number;
  mainImage: string;
  otherImages: string[];
};

const AllProduct = ({ cat }: { cat?: { cate: string } }) => {
  const dispatch = useAppDispatch();
  const productData = useAppSelector((state) => state.category);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortOption, setSortOption] = useState("1");
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { data, error, isLoading } = useGetProductsQuery({
    page: 1,
    limit: 20,
    search: searchTerm || undefined,
    category: cat?.cate,
  });

  useEffect(() => {
    if (cat?.cate) {
      dispatch(GetProductsByCategory(cat.cate));
    }
  }, [cat, dispatch]);

  const sortedAndFilteredProducts = useMemo(() => {
    const products: UIProduct[] = cat?.cate
      ? productData.products
      : data?.products ?? [];

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "2":
          return a.price - b.price;
        case "3":
          return b.price - a.price;
        case "4":
          return a.name.localeCompare(b.name);
        case "5":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  }, [cat, productData.products, data, sortOption, searchTerm]);

  if (isLoading) return <ProductsSkeletons />;

  const NavContent = () => (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === "grid" ? "default" : "outline"}
          size="icon"
          onClick={() => setViewMode("grid")}
        >
          <Grid className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "outline"}
          size="icon"
          onClick={() => setViewMode("list")}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button size="icon" variant="outline">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <Select value={sortOption} onValueChange={setSortOption}>
        <SelectTrigger className="w-45">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Sort by</SelectItem>
          <SelectItem value="2">Price: Low to High</SelectItem>
          <SelectItem value="3">Price: High to Low</SelectItem>
          <SelectItem value="4">Name: A to Z</SelectItem>
          <SelectItem value="5">Name: Z to A</SelectItem>
        </SelectContent>
      </Select>
    </>
  );

  return (
    <div className="w-full flex flex-col">
      {/* Sticky Toolbar */}
      <div className="flex flex-col w-full p-4 gap-4 sticky top-0 z-50 
        bg-background border-b border-border shadow-sm">
        <div className="flex items-center justify-between w-full">
          <span className="font-semibold text-foreground">
            {cat?.cate ? `Products in ${cat.cate}` : "All Products"}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="sm:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        <div className="hidden sm:flex flex-wrap gap-3 items-center justify-between w-full">
          <NavContent />
        </div>

        {isMenuOpen && (
          <div className="sm:hidden flex flex-col gap-3 w-full">
            <NavContent />
          </div>
        )}
      </div>

      {/* Product Grid */}
      <div
        className={`p-4 ${
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            : "grid grid-cols-2 gap-4"
        }`}
      >
        {error ? (
          <div className="text-destructive">Error loading products.</div>
        ) : sortedAndFilteredProducts.length === 0 ? (
          <div className="text-muted-foreground">No products found.</div>
        ) : (
          sortedAndFilteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
};

export default AllProduct;
