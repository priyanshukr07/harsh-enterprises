"use client";
import { useToast } from "@/components/ui/use-toast";
import Checkout from "@/lib/Payment";
import { createAddress } from "@/providers/toolkit/features/CreateAddressForOrderSlice";
import { useAppDispatch } from "@/providers/toolkit/hooks/hooks";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FiUser, FiMail, FiHome } from "react-icons/fi";

type FormData = {
  first_name: string;
  last_name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  card_number: string;
  exp_date: string;
  cvv: string;
};

interface User {
  id: string;
}

const CheckOutForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [user, setUser] = useState<string>("");

  const [allData, setAllData] = useState(() => ({
    first_name: "",
    last_name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    userId: "",
  }));

  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { data: session } = useSession();
  const [pay, setPay] = useState<boolean>(false);
  const userId = session?.user ? (session.user as User).id : null;

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const totalAmount = queryParams.get("totalAmount");
    const shipping = queryParams.get("shipping");
    const id = queryParams.get("id");
    setTotalAmount(
      parseFloat(totalAmount as string) + parseFloat(shipping as string)
    );
    setUser(id as string);
  }, []);

  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (userId) {
      setAllData({
        ...data,
        userId: userId,
      });
      setPay(true);

      reset();
    } else {
      toast({
        title: "Error",
        description: "Please login to place an order",
        duration: 3000,
        variant: "destructive",
      });
    }
  };
  useEffect(() => {
    const currentURL = window.location.href;
    const url = new URL(currentURL);
    const pathname = url.pathname;
    const searchParams = new URLSearchParams(url.search);

    if (pathname === "/checkout" && Array.from(searchParams).length === 0) {
      window.location.href = "/";
    }
  }, []);

  return (
    <>
      <div className="bg-gray-100 ">
        <div className="w-full max-w-3xl mx-auto p-8">
          <div className="bg-background p-8 rounded-lg shadow-md border">
            <h1 className="text-2xl font-bold text-gray-800  mb-4">Checkout</h1>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Shipping Address */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-700  mb-2">
                  Shipping Address
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <FiUser className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      id="first_name"
                      placeholder="First Name"
                      {...register("first_name", {
                        required: "First name is required",
                      })}
                      className="w-full rounded-lg border py-2 pl-10 pr-3   "
                    />
                    {errors.first_name && (
                      <span className="text-red-500 text-sm">
                        {errors.first_name.message}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      id="last_name"
                      placeholder="Last Name"
                      {...register("last_name", {
                        required: "Last name is required",
                      })}
                      className="w-full rounded-lg border py-2 pl-10 pr-3   "
                    />
                    {errors.last_name && (
                      <span className="text-red-500 text-sm">
                        {errors.last_name.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-4 relative">
                  <FiHome className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    id="address"
                    placeholder="Address"
                    {...register("address", {
                      required: "Address is required",
                    })}
                    className="w-full rounded-lg border py-2 pl-10 pr-3   "
                  />
                  {errors.address && (
                    <span className="text-red-500 text-sm">
                      {errors.address.message}
                    </span>
                  )}
                </div>
                <div className="mt-4 relative">
                  <FiHome className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    id="city"
                    placeholder="City"
                    {...register("city", { required: "City is required" })}
                    className="w-full rounded-lg border py-2 pl-10 pr-3   "
                  />
                  {errors.city && (
                    <span className="text-red-500 text-sm">
                      {errors.city.message}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="relative">
                    <FiHome className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      id="state"
                      placeholder="State"
                      {...register("state", { required: "State is required" })}
                      className="w-full rounded-lg border py-2 pl-10 pr-3   "
                    />
                    {errors.state && (
                      <span className="text-red-500 text-sm">
                        {errors.state.message}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      id="zip"
                      placeholder="ZIP Code"
                      {...register("zip", { required: "ZIP code is required" })}
                      className="w-full rounded-lg border py-2 pl-10 pr-3   "
                    />
                    {errors.zip && (
                      <span className="text-red-500 text-sm">
                        {errors.zip.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 grid md:grid-cols-2">
                <p className="text-lg font-semibold my-2 md:my-0">
                  Total Amount:{" "}
                  <span className="text-xl font-bold ">
                    ₹{totalAmount.toFixed(2)}
                  </span>
                </p>

                <button
                  type="submit"
                  className="cursor-pointer transition-all bg-blue-500 text-white px-6 py-2 rounded-lg
                  border-blue-600
                  border-b-4 hover:brightness-110 hover:-translate-y-px hover:border-b-[6px]
                  active:border-b-2 active:brightness-90 active:translate-y-0.5"
                >
                  Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {pay && <Checkout data={totalAmount} user={allData} />}
    </>
  );
};

export default CheckOutForm;
