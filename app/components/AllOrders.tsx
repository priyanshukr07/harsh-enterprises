"use client";

import { GetOrders } from "@/providers/toolkit/features/GetOrdersSlice";
import {
  useAppDispatch,
  useAppSelector,
} from "@/providers/toolkit/hooks/hooks";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect } from "react";
import OrderSkeletons from "../temp/OrderSkeletons";

interface User {
  id: string;
}
interface Product {
  name: string;
  price: number;
  mainImage: string;
}

interface Address {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

interface Order {
  id: string;
  quantity: number;
  Product: Product;
  address: Address;
  createdAt: string;
  status: string;
}

interface OrdersState {
  orders: Order[];
  loading: boolean;
}
const AllOrders = () => {
  const { data: session } = useSession();
  const userId = session?.user ? (session.user as User).id : null;
  const dispatch = useAppDispatch();
  const ordersState = useAppSelector(
    (state: { orders: OrdersState }) => state.orders
  );

  useEffect(() => {
    if (userId) {
      dispatch(GetOrders(userId as string));
    }
  }, [dispatch, userId]);

  const { orders, loading } = ordersState;

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <OrderSkeletons />
      </div>
    );
  }

  if (!loading && orders.length === 0) {
    return (
      <div className="text-center py-8">
        No orders found. Start shopping now!
      </div>
    );
  }
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Order List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {orders.map((order: any) => (
          <div key={order.id} className="bg-background text-foreground rounded-lg shadow-lg p-6">
            <div className="w-full h-56 flex justify-center items-center mb-4">
              <Image
                width={200}
                height={200}
                src={order.Product.mainImage}
                alt={order.Product.name}
                className="object-contain rounded-md"
              />
            </div>
            <div className="my-4 mt-5">
              <h2 className="text-xl font-semibold">{order.Product.name}</h2>
              <p className="text-gray-600">
                Price: ₹{order.Product.price.toFixed(2)}
              </p>
              <p className="text-gray-600">Quantity: {order.quantity}</p>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold">Delivery Address</h3>
              <p className="text-sm">{`${order.address.firstName} ${order.address.lastName}, ${order.address.address}, ${order.address.city}, ${order.address.state}, ${order.address.zip}`}</p>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold">Order Date</h3>
              <p className="text-sm">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold">Total Price</h3>
              <p>₹{(order.Product.price * order.quantity).toFixed(2)}</p>
            </div>
            <div>
              <h3 className="font-semibold">Status</h3>
              <p>{order.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllOrders;
