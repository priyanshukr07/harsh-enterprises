"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import ToastCartButton from "./ToastCartButton";

type Product = {
  id: string;
  name: string;
  price: number;
  mainImage: string;
  otherImages: string[];
};

const ProductCard = ({ product }: { product: Product }) => {
  const images = [product.mainImage, ...product.otherImages];
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="w-full mx-auto my-8">
      <div className="relative overflow-hidden rounded-lg shadow-lg group">
        <Link
          href={`/products/${product.id}`}
          className="relative block w-full h-84"
        >
          <Image
            src={images[activeIndex]}
            alt={product.name}
            width={1000}
            height={1200}
            className="w-full h-full object-cover transition-all duration-300"
            priority={activeIndex === 0}
          />

          {/* Dots navigation */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                onMouseEnter={(e) => {
                  e.preventDefault();
                  setActiveIndex(idx);
                }}
                className={`h-2 w-2 rounded-full transition-all ${
                  idx === activeIndex
                    ? "bg-background text-foreground scale-125"
                    : "bg-background text-foreground/50 hover:text-foreground/80 scale-100"
                }`}
              />
            ))}
          </div>
        </Link>

        <div className="absolute bottom-0 left-0 w-full p-4 bg-linear-to-t from-black via-transparent to-transparent">
          <h2 className="text-muted-foreground md:text-xl font-bold">
            {product.name}
          </h2>
          <p className="text-muted-foreground text-lg font-semibold">
            ₹{product.price}
          </p>
          <ToastCartButton product={product} />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
