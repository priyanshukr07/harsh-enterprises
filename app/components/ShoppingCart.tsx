"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Link } from "next-view-transitions";
import { TrashIcon, ShoppingCartIcon } from "lucide-react";
import {
  useAppDispatch,
  useAppSelector,
} from "@/providers/toolkit/hooks/hooks";
import { GetCartItems } from "@/providers/toolkit/features/GetUserAllCartitems";
import { DeleteItem } from "@/providers/toolkit/features/DeleteCartItemSlice";
import Loader from "@/components/Loader";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Product {
  id: string;
  product: {
    name: string;
    mainImage: string;
    price: number;
  };
  color?: string;
  size?: string;
  quantity: number;
}

interface User {
  id: string;
}

type RootState = {
  cartItems: {
    items: {
      data: Product[];
    };
  };
};

const ShoppingCart = () => {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const userId = session?.user ? (session.user as User).id : null;
  const cartItemsFromStore = useAppSelector(
    (state: RootState) => state.cartItems.items.data
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<Product[]>([]);

  useEffect(() => {
    setCartItems(cartItemsFromStore);
    setIsLoading(false);
  }, [cartItemsFromStore]);

  useEffect(() => {
    if (userId) {
      dispatch(GetCartItems(userId));
      setIsLoading(true);
    }
  }, [userId, dispatch]);

  const totalAmount = Array.isArray(cartItems)
    ? cartItems.reduce(
        (total, product) => total + product.product.price * product.quantity,
        0
      )
    : 0;

  const handleRemoveItem = (product: any) => {
    dispatch(
      DeleteItem({
        userId: userId as string,
        product: { id: product.productId },
      })
    );
    setCartItems(cartItems.filter((item) => item.id !== product.id));
  };

  const cartItemsNotEmpty = cartItems.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-4xl font-bold mb-8 text-gray-800 flex items-center">
        <ShoppingCartIcon className="mr-4" size={36} />
        Shopping Cart
      </h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <Card className="lg:w-2/3">
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader />
              </div>
            ) : Array.isArray(cartItems) && cartItems.length > 0 ? (
              <AnimatePresence>
                {cartItems.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex flex-col sm:flex-row items-center gap-6 mb-6 pb-6 border-b last:border-b-0"
                  >
                    <Image
                      width={120}
                      height={120}
                      src={product.product.mainImage}
                      alt={product.product.name}
                      className="w-24 h-24 object-contain rounded-md shadow-md"
                    />
                    <div className="flex-1 w-full">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {product.product.name}
                      </h3>
                      {product.color && (
                        <p className="text-gray-600 mb-1">
                          Color: {product.color}
                        </p>
                      )}
                      {product.size && (
                        <p className="text-gray-600 mb-1">
                          Size: {product.size}
                        </p>
                      )}
                      <div className="flex justify-between items-center mt-4">
                        <p className="text-gray-600">
                          Quantity: {product.quantity}
                        </p>
                        <div className="flex items-center space-x-4">
                          <p className="text-lg font-semibold text-gray-800">
                            ₹{product.product.price}
                          </p>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleRemoveItem(product)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-600 text-xl flex items-center justify-center font-bold h-64"
              >
                Your cart is empty.
              </motion.p>
            )}
          </CardContent>
        </Card>
        <Card className="lg:w-1/3">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹99</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{totalAmount + 99}</span>
              </div>
              <Link
                href={
                  session?.user
                    ? `/checkout?totalAmount=${totalAmount}&shipping=99&Id=${userId}`
                    : "login"
                }
              >
                <button
                  className={`w-full ${
                    cartItemsNotEmpty
                      ? "bg-black hover:bg-gray-800"
                      : "bg-gray-400"
                  } text-white py-2 mt-2 rounded-md text-lg font-semibold transition duration-300`}
                  disabled={!cartItemsNotEmpty}
                >
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default ShoppingCart;
