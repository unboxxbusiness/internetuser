"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import React, { PropsWithChildren, useRef } from "react";

export interface DockProps extends VariantProps<typeof dockVariants> {
  className?: string;
  magnification?: number;
  distance?: number;
  direction?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
}

const dockVariants = cva(
  "flex h-16 items-end gap-2 rounded-full border bg-background/70 p-2 backdrop-blur-md"
);

const Dock = React.forwardRef<HTMLDivElement, DockProps>(
  (
    {
      className,
      children,
      magnification = 50,
      distance = 80,
      direction = "bottom",
      ...props
    },
    ref,
  ) => {
    const mouseX = useMotionValue(Infinity);

    const renderChildren = () => {
      return React.Children.map(children, (child) => {
        return React.cloneElement(child as React.ReactElement<any>, {
          mouseX: mouseX,
          magnification: magnification,
          distance: distance,
        });
      });
    };

    return (
      <motion.div
        ref={ref}
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        {...props}
        className={cn(dockVariants({ className }), className)}
      >
        {renderChildren()}
      </motion.div>
    );
  },
);

Dock.displayName = "Dock";

export interface DockIconProps {
  size?: number;
  magnification?: number;
  distance?: number;
  mouseX?: any;
  className?: string;
  children?: React.ReactNode;
  props?: PropsWithChildren;
}

const DockIcon = ({
  size,
  magnification = 50,
  distance = 80,
  mouseX,
  className,
  children,
  ...props
}: DockIconProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const
   width = useTransform(
    mouseX,
    [
      ref.current ? ref.current.offsetLeft - distance : 0,
      ref.current ? ref.current.offsetLeft + ref.current.offsetWidth / 2 : 0,
      ref.current
        ? ref.current.offsetLeft + ref.current.offsetWidth + distance
        : 0,
    ],
    [48, magnification, 48],
  );

  const widthSync = useSpring(width, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <motion.div
      ref={ref}
      style={{ width: widthSync }}
      className={cn("flex aspect-square items-center justify-center", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

DockIcon.displayName = "DockIcon";

export { Dock, DockIcon, dockVariants };
