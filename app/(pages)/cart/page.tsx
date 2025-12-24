import ShoppingCart from "@/app/components/ShoppingCart";
import { Metadata } from "next";
import React from "react";

export const metadata :Metadata ={
  title: "Cart",
  description: "This is the cart page",
}
const Cart = () => {
  return <ShoppingCart />;
};

export default Cart;
