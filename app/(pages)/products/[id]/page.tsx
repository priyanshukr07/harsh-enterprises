"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SingleProductSkeleton from "@/app/temp/SingleProductSkeleton";
import { useGetProductByIdQuery } from "@/providers/toolkit/features/GetAllProductsSlice";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useSwipeable } from "react-swipeable";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch } from "@/providers/toolkit/hooks/hooks";
import { AddToCart } from "@/providers/toolkit/features/AddToCartSlice";

interface SessionUser {
  id: string;
}

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useGetProductByIdQuery(id);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [addToCartClicked, setAddToCartClicked] = useState<boolean>(false);
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
  const { data: session } = useSession();
  const { push } = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (addToCartClicked) {
      if (data?.sizes && data.sizes.length > 0 && !selectedSize) {
        setSelectedSize(data.sizes[0]);
      }
      if (data?.colors && data.colors.length > 0 && !selectedColor) {
        setSelectedColor(data.colors[0]);
      }
      setAddToCartClicked(false);
    }
  }, [
    addToCartClicked,
    data?.sizes,
    data?.colors,
    selectedSize,
    selectedColor,
  ]);

  if (isLoading) return <SingleProductSkeleton />;
  if (error)
    return (
      <div>Error: Fetching product with id {id} failed. Please try again.</div>
    );
  if (!data) return <div>Product not found.</div>;

  const { sizes, colors, mainImage, name, description, price, otherImages } =
    data;
  const images = [mainImage, ...(otherImages ?? [])];

  const handlers = useSwipeable({
    onSwipedLeft: () =>
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length),
    onSwipedRight: () =>
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + images.length) % images.length
      ),
  });

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    if (!session?.user) {
      toast({
        title: "Please login to add to cart",
        description: "You need to be logged in to add items to your cart",
        variant: "default",
        duration: 1500,
        style: {
          backgroundColor: "#191919",
          color: "#fff",
        },
      });
      setIsAddingToCart(false);
      return push("/login");
    } else {
      setAddToCartClicked(true);
      const userId = (session.user as SessionUser).id;
      dispatch(
        AddToCart({
          userId: userId,
          productId: id ?? "",
          quantity,
          color: selectedColor || colors?.[0] || "",
          size: selectedSize || sizes?.[0] || "",
        })
      ).finally(() => {
        setIsAddingToCart(false);
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 md:flex"
    >
      {/* Image and thumbnail section */}
      <div className="md:w-1/2">
        <div
          {...handlers}
          className="w-full h-auto mb-4 rounded overflow-hidden"
        >
          <Image
            width={1000}
            height={1000}
            src={images[currentIndex]}
            alt="Product"
            className="w-full h-auto"
            loading="lazy"
          />
        </div>

        <div className="flex space-x-2">
          {images.map((image, index) => (
            <Image
              key={index}
              width={100}
              height={100}
              src={image}
              alt="Product thumbnail"
              className={`w-24 h-24 rounded object-contain ${
                currentIndex === index ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => setCurrentIndex(index)}
              loading="lazy"
            />
          ))}
        </div>
      </div>

      {/* Product details section */}
      <motion.div
        className="md:w-1/2 md:pl-8"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h1 className="text-3xl font-bold mb-4">{name}</h1>
        <p className="mb-4 text-gray-600">{description}</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {data.categories.map((category) => (
            <Badge key={category.id} variant="secondary">
              {category.name}
            </Badge>
          ))}
        </div>

        <p className="text-2xl font-semibold mb-6">₹{price}</p>

        {/* Color selection */}
        {colors && colors.length > 0 && (
          <div className="mb-6">
            <h2 className="font-semibold mb-2">Color</h2>
            <div className="flex flex-wrap gap-2">
              {colors.map((color, index) => (
                <motion.button
                  key={index}
                  className={`w-10 h-10 rounded-full border-2 ${
                    selectedColor === color
                      ? "border-blue-500 ring-2 ring-blue-300"
                      : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Size selection */}
        {sizes && sizes.length > 0 && (
          <div className="mb-6">
            <h2 className="font-semibold mb-2">Size</h2>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size, index) => (
                <motion.button
                  key={index}
                  className={`px-4 py-2 border-2 rounded ${
                    selectedSize === size
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  }`}
                  onClick={() => setSelectedSize(size)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {size}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity input */}
        <div className="mb-6">
          <label htmlFor="quantity" className="block font-semibold mb-2">
            Quantity
          </label>
          <select
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-20 border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            aria-describedby="quantityHelp"
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleAddToCart}
            className="w-full text-white px-6 py-3 rounded text-lg"
            disabled={isAddingToCart}
          >
            {isAddingToCart ? "Adding..." : "Add to Cart"}
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ProductPage;
