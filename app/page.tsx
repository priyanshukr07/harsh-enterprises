import React from "react";
import Category from "./components/Category";
import Hero from "./components/Hero";
import HomeProducts from "./components/HomeProducts";

export default function Home() {
  return (
    <div>
      <Hero />
      <Category />
      <h1 className="text-3xl font-bold text-center md:text-start my-5 w-4/5 mx-auto ">
        New
        <span className="text-blue-500"> Products</span>
      </h1>
      <HomeProducts />
    </div>
  );
}