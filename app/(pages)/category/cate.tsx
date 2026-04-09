"use client";

import Image from "next/image";
import { Link } from "next-view-transitions";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    href: "/category/cocopeat",
    image:
      "https://res.cloudinary.com/harsh-ent/image/upload/v1765827318/cocopeat_cat.png",
    title: "Cocopeat",
    description:
      "Premium cocopeat for better root health, moisture retention, and higher yield.",
  },
  {
    href: "/category/seedling-trays",
    image:
      "https://res.cloudinary.com/harsh-ent/image/upload/v1765827365/seddling_trays_cat.png",
    title: "Seedling Trays",
    description:
      "Durable, reusable trays designed for uniform germination and nursery efficiency.",
  },
  {
    href: "/category/threads",
    image:
      "https://res.cloudinary.com/harsh-ent/image/upload/v1765323546/threads_cat.png",
    title: "Threads",
    description:
      "Strong and reliable threads for agricultural and industrial applications.",
  },
];

export default function Categories() {
  return (
    <section className="relative py-20 bg-background">
      {/* subtle background accent */}
      <div className="
        absolute inset-0 -z-10
        bg-linear-to-br
        from-green-50/60 via-transparent to-emerald-100/40
        dark:from-green-950/30 dark:to-emerald-900/20
      " />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="
            inline-block rounded-full px-4 py-1 mb-2.5 text-sm font-medium
              bg-green-200 text-green-800
              dark:bg-green-900/40 dark:text-green-800
          ">
            Product Categories
          </span>

          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
            Everything You Need for{" "}
            <span className="text-green-600 dark:text-green-400">
              Healthy Growth
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
            Explore our curated agricultural categories trusted by farmers,
            nurseries, and modern growers across India.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.href}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link href={category.href} className="group block">
                <div
                  className="
                    rounded-2xl overflow-hidden
                    bg-background text-foreground
                    border border-border
                    shadow-sm hover:shadow-xl
                    transition-all duration-300
                  "
                >
                  {/* Image */}
                  <div className="relative aspect-4/3 overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      {category.title}
                    </h2>

                    <p className="text-muted-foreground mb-5">
                      {category.description}
                    </p>

                    <span
                      className="
                        inline-flex items-center font-semibold
                        text-green-600 dark:text-green-400
                        group-hover:text-green-700 dark:group-hover:text-green-300
                        transition
                      "
                    >
                      Explore products
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}