"use client";
import { useToast } from "@/components/ui/use-toast";
import { createAddress } from "@/providers/toolkit/features/CreateAddressForOrderSlice";
import { useAppDispatch } from "@/providers/toolkit/hooks/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  userId: string;
  first_name: string;
  last_name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}
const Checkout = ({ data, user }: { data: number; user: User }) => {
  const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      setScriptLoaded(true);
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (scriptLoaded) {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data * 100,
        currency: "INR",
        name: "Shop Smart",
        description: "Payment for the products purchased from Shop Smart",
        image: "/logo.png",
        handler: async function () {
          console.log(user);
          dispatch(
            createAddress({
              userId: user.userId,
              firstName: user.first_name,
              lastName: user.last_name,
              address: user.address,
              city: user.city,
              state: user.state,
              zip: user.zip,
            })
          );
          toast({
            title: "Order Placed",
            description: "Your order has been placed successfully",
            duration: 5000,
            style: {
              backgroundColor: "##228B22",
              color: "#fff",
            },
          });
          router.push("/order");
        },
        theme: {
          color: "#00008B",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    }
  }, [scriptLoaded, data, dispatch, user, toast, router]);

  return null;
};

export default Checkout;
