"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const socialLinks = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/harshenterprises",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/harshenterprises/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2c2.716 0 3.056.012 4.123.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123s-.012 3.056-.06 4.123c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06s-3.056-.012-4.123-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427C2.012 15.056 2 14.716 2 12s.012-3.056.06-4.123c.049-1.064.218-1.791.465-2.427A4.902 4.902 0 013.678 3.61a4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465C8.944 2.012 9.284 2 12 2z" />
      </svg>
    ),
  },
  {
    name: "Twitter",
    href: "https://twitter.com/harshenterprises",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743A11.65 11.65 0 013.1 4.747a4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="relative bg-background border-t border-border">
      {/* subtle agri gradient */}
      <div
        className="
        absolute inset-0 -z-10
        bg-linear-to-br
        from-green-50/60 via-transparent to-emerald-100/30
        dark:from-green-950/40 dark:to-emerald-900/20
      "
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="relative w-72 h-40 mb-4">
              <Image
                src="https://res.cloudinary.com/harsh-ent/image/upload/v1765323482/footer.png"
                alt="Harsh Enterprises"
                fill
                sizes="280px"
                className="rounded-lg object-contain"
              />
            </div>

            <p className="text-muted-foreground max-w-md">
              Harsh Enterprises is your trusted destination for premium
              cocopeat, seedling trays, and agricultural essentials—built to
              support healthy growth and better yield.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {["Home", "Shop", "Categories", "Orders", "Contact"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-foreground transition"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact + Social */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Get in Touch
            </h3>
            <p className="text-muted-foreground mb-2">📞 +91 01234 56789</p>
            <p className="text-muted-foreground mb-4">
              ✉️ info@harshenterprises.com
            </p>

            <div className="flex gap-4">
              {socialLinks.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  className="
                    p-2 rounded-full
                    bg-muted text-foreground/70
                    hover:text-green-600 dark:hover:text-green-400
                    transition
                  "
                >
                  <span className="sr-only">{item.name}</span>
                  <div className="h-5 w-5">{item.icon}</div>
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Harsh Enterprises. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm">
            {["Privacy Policy", "Terms", "Cookies"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-muted-foreground hover:text-foreground transition"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
