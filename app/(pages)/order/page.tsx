import AllOrders from "@/app/components/AllOrders";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Orders",
  description: "This is the orders page",
};
const OrderList = () => {
  return <AllOrders />;
};

export default OrderList;
