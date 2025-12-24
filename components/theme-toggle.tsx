"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            pressed={isDark}
            onPressedChange={() => setTheme(isDark ? "light" : "dark")}
            className="rounded-full"
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Toggle>
        </TooltipTrigger>
        <TooltipContent className="border-0 p-0">
          <p
            className={`px-2 py-1 rounded-md backdrop-blur-md text-sm ${
              isDark
                ? "bg-background/70 text-foreground"
                : "bg-background text-foreground/90"
            }`}
          >
            {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
