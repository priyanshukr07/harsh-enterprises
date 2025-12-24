"use client";
import React, { useEffect, useState } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TableSkeletons from "../temp/TableSkeletons";

interface Product {
  name: string;
  price: number;
  categories?: { name: string }[];

  // Threads
  denier?: string;
  length?: number;
  material?: string;

  // Cocopeat
  weight?: number;
  ecLevel?: string;
  compression?: string;

  // Seedling Tray
  cavities?: number;
  cellVolume?: number;
  trayMaterial?: string;
  dimensions?: string;
}

interface Address {
  firstName: string;
  lastName: string;
  address: string;
}

interface User {
  email: string;
  name: string;
}

interface Order {
  id: string;
  createdAt: string;
  status: string;
  Product: Product;
  address: Address;
  user: User;
}

const OrderTable: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/get-all-orders");
        const data = await response.json();
        setOrders(data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    getOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch("/api/get-all-orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (response.ok) {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        console.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const renderProductAttributes = (product: Product) => {
    const category = product.categories?.[0]?.name;

    if (!category) return "—";

    switch (category) {
      case "threads":
        return (
          <div className="text-xs">
            {product.denier && <p>Denier: {product.denier}</p>}
            {product.length && <p>Length: {product.length}m</p>}
            {product.material && <p>Material: {product.material}</p>}
          </div>
        );

      case "cocopeat":
        return (
          <div className="text-xs">
            {product.weight && <p>Weight: {product.weight}kg</p>}
            {product.ecLevel && <p>EC: {product.ecLevel}</p>}
            {product.compression && <p>Compression: {product.compression}</p>}
          </div>
        );

      case "seedling-tray":
        return (
          <div className="text-xs">
            {product.cavities && <p>Cavities: {product.cavities}</p>}
            {product.cellVolume && <p>Cell Volume: {product.cellVolume}ml</p>}
            {product.trayMaterial && <p>Material: {product.trayMaterial}</p>}
            {product.dimensions && <p>Size: {product.dimensions}</p>}
          </div>
        );

      default:
        return "—";
    }
  };

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-xl font-semibold">Orders</CardTitle>
        <CardDescription>Recent orders from your store.</CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px] px-4 py-3 sm:px-6">
                  Customer
                </TableHead>
                <TableHead className="hidden sm:table-cell px-4 py-3">
                  Address
                </TableHead>
                <TableHead className="hidden lg:table-cell px-4 py-3">
                  Product
                </TableHead>
                <TableHead className="hidden lg:table-cell px-4 py-3">
                  Attributes
                </TableHead>
                <TableHead className="hidden sm:table-cell px-4 py-3">
                  Status
                </TableHead>
                <TableHead className="hidden md:table-cell px-4 py-3">
                  Date
                </TableHead>
                <TableHead className="px-4 py-3 text-right sm:px-6">
                  Amount
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    <TableSkeletons />
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="px-4 py-4 sm:px-6">
                      <div className="font-medium">
                        {order.address.firstName} {order.address.lastName}
                      </div>
                      <div className="hidden md:block text-sm text-muted-foreground">
                        {order.user.email}
                      </div>
                    </TableCell>

                    <TableCell className="hidden sm:table-cell px-4 py-4">
                      {order.address.address}
                    </TableCell>

                    <TableCell className="hidden lg:table-cell px-4 py-4">
                      {order.Product.name}
                    </TableCell>

                    <TableCell className="hidden lg:table-cell px-4 py-4">
                      {renderProductAttributes(order.Product)}
                    </TableCell>

                    <TableCell className="hidden sm:table-cell px-4 py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Badge
                            className="text-xs cursor-pointer"
                            variant={
                              order.status === "PENDING"
                                ? "outline"
                                : order.status === "COMPLETED"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {order.status}
                          </Badge>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => updateOrderStatus(order.id, "PENDING")}
                          >
                            PENDING
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              updateOrderStatus(order.id, "COMPLETED")
                            }
                          >
                            COMPLETED
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              updateOrderStatus(order.id, "CANCELLED")
                            }
                          >
                            CANCELLED
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>

                    <TableCell className="hidden md:table-cell px-4 py-4">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>

                    <TableCell className="px-4 py-4 text-right sm:px-6">
                      ₹{order.Product.price.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderTable;
