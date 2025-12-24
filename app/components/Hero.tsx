"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const heroImages = [
  "https://res.cloudinary.com/harsh-ent/image/upload/v1765826063/cocopeat_hero.png",
  "https://res.cloudinary.com/harsh-ent/image/upload/v1765826018/seddling_thread_hero.png",
  "https://res.cloudinary.com/harsh-ent/image/upload/v1765826055/threads_hero.png",
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % heroImages.length),
      3500
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden bg-background">
      {/* Background */}
      <div className="
        absolute inset-0 -z-10
        bg-linear-to-br
        from-green-50/70 via-transparent to-emerald-100/40
        dark:from-green-950/40 dark:to-emerald-900/30
      " />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-7 gap-10 items-center">

          {/* Text */}
          <motion.div
            className="lg:col-span-3 space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="
              inline-block rounded-full px-4 py-1 text-sm font-medium
              bg-green-100 text-green-700
              dark:bg-green-900/40 dark:text-green-300
            ">
              Trusted Agricultural Supplies
            </span>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold leading-tight text-foreground">
              Grow Better with <br />
              <span className="text-green-600 dark:text-green-400">
                Premium Cocopeat & Seedling Trays
              </span>
            </h1>

            <p className="text-lg max-w-xl text-muted-foreground">
              High-quality cocopeat, threads, and seedling trays built to improve
              plant health, yield, and consistency for farmers and nurseries.
            </p>

            <div className="flex gap-4 pt-4">
              <a
                href="/products"
                className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 transition"
              >
                Shop Products
              </a>
              <a
                href="/about"
                className="
                  rounded-lg px-6 py-3 font-semibold border
                  border-border hover:bg-muted transition
                "
              >
                Learn More
              </a>
            </div>
          </motion.div>

          {/* Image */}
          <div className="lg:col-span-4">
            <div className="
              relative mx-auto max-w-xl aspect-square overflow-hidden rounded-2xl
              bg-background text-foreground
              shadow-xl dark:shadow-black/40
            ">
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={heroImages[index]}
                    alt="Harsh Enterprises product"
                    fill
                    priority={index === 0}
                    className="object-cover"
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 70vw, 520px"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
