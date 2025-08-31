"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { ElementRef, useRef, ComponentProps, ReactNode } from "react";

type TimelineContentProps = ComponentProps<typeof motion.div> & {
  as?: "div" | "p" | "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  children: ReactNode;
  animationNum: number;
  timelineRef: ElementRef<"div">;
  customVariants: any;
};

export const TimelineContent = ({
  as: Component = "div",
  children,
  animationNum,
  timelineRef,
  customVariants,
}: TimelineContentProps) => {
  const ref = useRef<ElementRef<"div">>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-200, 200]);

  return (
    <motion.div
      ref={ref}
      variants={customVariants}
      custom={animationNum}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      style={{ y: y }}
    >
      <Component>{children}</Component>
    </motion.div>
  );
};
