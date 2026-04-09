"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

const categories = [
  {
    label: "Cocopeat",
    description: "Premium cocopeat for strong roots and better growth",
    image:
      "https://res.cloudinary.com/harsh-ent/image/upload/v1765827318/cocopeat_cat.png",
    link: "/category/cocopeat",
  },
  {
    label: "Seedling Trays",
    description: "Durable trays for uniform germination and healthy seedlings",
    image:
      "https://res.cloudinary.com/harsh-ent/image/upload/v1765827365/seddling_trays_cat.png",
    link: "/category/seedling-trays",
  },
  {
    label: "Threads",
    description: "Strong agricultural threads for support and binding",
    image:
      "https://res.cloudinary.com/harsh-ent/image/upload/v1765323546/threads_cat.png",
    link: "/category/threads",
  },
];

export default function Category() {
  return (
    <section className="relative py-20 bg-background overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-green-50/70 via-transparent to-emerald-100/40 dark:from-green-950/40 dark:to-emerald-900/30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span
            className="inline-block rounded-full px-4 py-1 mb-2.5 text-sm font-medium
              bg-green-200 text-green-800
              dark:bg-green-900/40 dark:text-green-800"
          >
            Product Categories
          </span>

          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            Everything You Need for{" "}
            <span className="text-green-600 dark:text-green-400">
              Healthy Growth
            </span>
          </h2>

          <p className="text-lg max-w-3xl mx-auto text-muted-foreground">
            Explore our agricultural essentials trusted by nurseries and
            farmers.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link href={cat.link} className="group block h-full">
                <div className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all h-full flex flex-col">
                  
                  <div className="relative h-56 w-full overflow-hidden flex-shrink-0">
                    <Image
                      src={cat.image}
                      alt={cat.label}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>

                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{cat.label}</h3>
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {cat.description}
                      </p>
                    </div>
                    <span className="font-semibold text-green-600">
                      Explore Products →
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
