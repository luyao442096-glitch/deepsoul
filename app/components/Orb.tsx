"use client";
import { motion } from "framer-motion";
import { clsx } from "clsx";

interface OrbProps {
  state: "idle" | "breathing" | "rapid" | "hatching";
  color: string;
  size?: "sm" | "md" | "lg";
}

export function Orb({ state, color, size = "md" }: OrbProps) {
  const colorMap: Record<string, string> = {
    blue: "from-blue-400 via-indigo-500 to-purple-600",
    red: "from-red-500 via-orange-500 to-rose-600",
    orange: "from-orange-400 via-amber-500 to-red-500",
    green: "from-emerald-400 via-green-500 to-teal-600",
    purple: "from-violet-400 via-fuchsia-500 to-indigo-600",
    gray: "from-slate-300 via-gray-400 to-slate-600",
  };

  const selectedColor = colorMap[color] || colorMap.blue;

  const sizeClass = size === "sm" ? "w-32 h-32" : size === "md" ? "w-64 h-64" : "w-96 h-96";

  const variants = {
    idle: { scale: 1, opacity: 0.8 },
    breathing: {
      scale: [1, 1.1, 1],
      opacity: [0.7, 1, 0.7],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
    },
    rapid: {
      scale: [1, 1.05, 1],
      opacity: [0.8, 1, 0.8],
      transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" },
    },
    hatching: {
      scale: [1, 50],
      opacity: [1, 0],
      transition: { duration: 1.5, ease: "easeIn" },
    },
  };

  return (
    <div className="relative flex items-center justify-center">
      <motion.div 
        variants={variants} 
        animate={state} 
        className={clsx(
          "rounded-full bg-gradient-to-br blur-2xl transition-colors duration-1000",
          selectedColor,
          sizeClass
        )} 
      />
      <motion.div 
        variants={variants} 
        animate={state} 
        className={clsx(
          "absolute rounded-full bg-white/30 blur-xl transition-colors duration-1000",
          size === "sm" ? "w-16 h-16" : "w-32 h-32"
        )} 
      />
    </div>
  );
}