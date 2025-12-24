"use client";

import { Button } from "@/components/ui/button";
import { ShoppingBag, Menu, X } from "lucide-react";
import { Link } from "next-view-transitions";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { ThemeToggle } from "../../components/theme-toggle";
import { Role } from "@prisma/client";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();

  const isAuthorized = session?.user?.role === Role.MANAGER || session?.user?.role === Role.ADMIN;

  const messages = [
    "Free shipping on orders over ₹499 🌱",
    "20% off on first purchase – grow smarter!",
    "Premium cocopeat & trays for better yield",
    "Trusted by nurseries & farmers across India",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((i) => (i + 1) % messages.length);
    }, 4347);
    return () => clearInterval(interval);
  }, [[messages.length]]);

  const NavLink = ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <Link
      href={href}
      onClick={() => setIsOpen(false)}
      className="
        px-3 py-2 rounded-md text-sm font-medium
        text-foreground/80 hover:text-foreground
        hover:bg-muted transition
      "
    >
      {children}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm ">
      {/* Announcement Bar */}
      <div
        className="
        w-full text-center py-2 text-xs sm:text-sm font-medium
        bg-linear-to-r from-green-700 to-emerald-600
        text-white
      "
      >
        {messages[currentMessageIndex]}
      </div>

      {/* Main Navbar */}
      <nav className="max-w-7xl mx-auto px-3">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-12 h-12">
              <Image
                src="https://res.cloudinary.com/harsh-ent/image/upload/v1765323365/brand_logo.jpg"
                alt="Harsh Enterprises"
                fill
                sizes="48px"
                className="rounded-full object-cover ring-2 ring-green-500/30"
              />
            </div>

            <span
              className="
                text-2xl sm:text-3xl font-extrabold
                bg-linear-to-r from-green-600 to-emerald-400
                bg-clip-text text-transparent
              "
            >
              Harsh Enterprises
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/products">Shop</NavLink>
            <NavLink href="/category">Categories</NavLink>
            <NavLink href={session?.user ? "/order" : "/login"}>Orders</NavLink>
            {isAuthorized && <NavLink href="/dashboard">Dashboard</NavLink>}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* ThemeToggle */}
            <ThemeToggle />

            {session?.user && (
              <ShoppingBag
                size={22}
                className="
                  cursor-pointer text-foreground/70
                  hover:text-foreground transition
                "
                onClick={() => router.push("/cart")}
              />
            )}

            {session?.user ? (
              <Button
                variant="outline"
                className="hidden md:inline-flex"
                onClick={() => {
                  signOut({ callbackUrl: "/login" });
                  toast({
                    title: "Logged out",
                    description: "You have been logged out successfully.",
                    duration: 3000,
                  });
                }}
              >
                Logout
              </Button>
            ) : (
              <Link href="/login" className="hidden md:inline-flex">
                <Button className="bg-green-600 hover:bg-green-700 text-white cursor-pointer">
                  Login
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="
                md:hidden p-2 rounded-lg
                hover:bg-muted transition
              "
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-1">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/products">Shop</NavLink>
            <NavLink href="/category">Categories</NavLink>
            <NavLink href={session?.user ? "/order" : "/login"}>Orders</NavLink>
            {isAuthorized && <NavLink href="/dashboard">Dashboard</NavLink>}

            {session?.user ? (
              <Button
                className="w-full mt-2"
                onClick={() => {
                  signOut({ callbackUrl: "/login" });
                  toast({
                    title: "Logged out",
                    description: "You have been logged out successfully.",
                    duration: 3000,
                  });
                  setIsOpen(false);
                }}
              >
                Logout
              </Button>
            ) : (
              <Link href="/login">
                <Button className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white cursor-pointer">
                  Login
                </Button>
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
