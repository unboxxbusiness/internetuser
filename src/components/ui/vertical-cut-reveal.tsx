"use client";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type VerticalCutRevealProps = {
  children: string;
  splitBy?: "chars" | "words";
  staggerDuration?: number;
  staggerFrom?: "first" | "last";
  reverse?: boolean;
  containerClassName?: string;
  className?: string;
  transition?: any;
};

export function VerticalCutReveal({
  children,
  splitBy = "chars",
  staggerDuration = 0.05,
  staggerFrom = "first",
  reverse = false,
  containerClassName,
  className,
  transition,
}: VerticalCutRevealProps) {
  const items =
    splitBy === "chars"
      ? children.split("")
      : children.split(new RegExp(/(\s+)/));

  const revealVariants: Variants = {
    hidden: {
      y: "100%",
    },
    visible: (i: number) => ({
      y: 0,
      transition: {
        delay:
          staggerFrom === "first"
            ? i * staggerDuration
            : (items.length - i - 1) * staggerDuration,
        ...transition,
      },
    }),
  };

  return (
    <div
      className={cn(
        "flex flex-wrap overflow-hidden leading-none",
        containerClassName,
      )}
    >
      {items.map((item, index) => (
        <motion.span
          key={index}
          custom={index}
          variants={revealVariants}
          initial="hidden"
          animate="visible"
          className={cn(className, reverse && "scale-y-[-1]")}
        >
          {item}
        </motion.span>
      ))}
    </div>
  );
}
