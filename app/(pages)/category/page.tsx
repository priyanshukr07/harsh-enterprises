import { Metadata } from "next";
import Categories from "./cate";

export const metadata: Metadata = {
  title: "Product Categories | Harsh Enterprises",
  description:
    "Explore premium agricultural product categories including cocopeat, seedling trays, and farming essentials trusted by nurseries and growers.",
};

const CategoryPage = () => {
  return <Categories />;
};

export default CategoryPage;
