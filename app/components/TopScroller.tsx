"use client";
import { LucideArrowUp } from "lucide-react";
import React, { useState, useEffect } from "react";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [lastScrollY, setLastScrollY] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.pageYOffset;
      if (currentScrollY > lastScrollY) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-5 right-5 z-50 bg-black text-white p-3 rounded-full transition-transform duration-300 ease-in-out ${
        isVisible ? "scale-100" : "scale-0"
      }`}
      style={{ display: isVisible || lastScrollY > 0 ? "block" : "none" }}
    >
      <LucideArrowUp className="text-white" />
    </button>
  );
};

export default ScrollToTopButton;
