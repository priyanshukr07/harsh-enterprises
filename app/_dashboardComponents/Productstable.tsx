"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Link } from "next-view-transitions";
import { Suspense } from "react";

import {
  useGetProductsQuery,
  Product,
} from "@/providers/toolkit/features/GetAllProductsSlice";

import TableSkeletons from "../temp/TableSkeletons";

const Productstable = () => {
  const { data, error, isLoading } = useGetProductsQuery({});

  const products: Product[] = data?.products ?? [];

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <TableSkeletons />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">An error occurred.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Products</CardTitle>
        <CardDescription>
          Manage your products and view their sales performance.
        </CardDescription>
      </CardHeader>

      {/* ADD PRODUCT */}
      <Link
        href="/dashboard/products/add"
        className="flex w-full items-center justify-end px-4"
      >
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only">Add Product</span>
        </Button>
      </Link>

      <CardContent>
        <Suspense fallback={<TableSkeletons />}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-80px">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="hidden md:table-cell">
                  Attributes
                </TableHead>
                <TableHead className="hidden md:table-cell">Sizes</TableHead>
                <TableHead className="hidden md:table-cell">Colors</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {products.map((product) => {
                const categoryName =
                  product.categories?.[0]?.name ?? "N/A";

                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Image
                        src={product.mainImage}
                        alt={product.name}
                        width={64}
                        height={64}
                        className="rounded-md object-cover"
                      />
                    </TableCell>

                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline">{categoryName}</Badge>
                    </TableCell>

                    <TableCell>₹{product.price}</TableCell>

                    {/* ATTRIBUTES */}
                    <TableCell className="hidden md:table-cell text-xs">
                      {categoryName === "threads" && (
                        <>
                          {product.denier && <p>Denier: {product.denier}</p>}
                          {product.length && <p>Length: {product.length}m</p>}
                          {product.material && (
                            <p>Material: {product.material}</p>
                          )}
                        </>
                      )}

                      {categoryName === "cocopeat" && (
                        <>
                          {product.weight && (
                            <p>Weight: {product.weight}kg</p>
                          )}
                          {product.ecLevel && <p>EC: {product.ecLevel}</p>}
                          {product.compression && (
                            <p>Compression: {product.compression}</p>
                          )}
                        </>
                      )}

                      {categoryName === "seedling-tray" && (
                        <>
                          {product.cavities && (
                            <p>Cavities: {product.cavities}</p>
                          )}
                          {product.cellVolume && (
                            <p>Cell Volume: {product.cellVolume}ml</p>
                          )}
                          {product.trayMaterial && (
                            <p>Material: {product.trayMaterial}</p>
                          )}
                          {product.dimensions && (
                            <p>Dimensions: {product.dimensions}</p>
                          )}
                        </>
                      )}
                    </TableCell>

                    <TableCell className="hidden md:table-cell">
                      {product.sizes?.length
                        ? product.sizes.join(", ")
                        : "N/A"}
                    </TableCell>

                    <TableCell className="hidden md:table-cell">
                      {product.colors?.length
                        ? product.colors.join(", ")
                        : "N/A"}
                    </TableCell>

                    <TableCell>—</TableCell>
                  </TableRow>
                );
              })}

              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6">
                    No products found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default Productstable;