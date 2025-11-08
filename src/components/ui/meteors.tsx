"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export const Meteors = ({
  number,
  className,
}: {
  number?: number;
  className?: string;
}) => {
  const [meteorStyles, setMeteorStyles] = useState<React.CSSProperties[]>([]);

  useEffect(() => {
    const styles = [...new Array(number || 20)].map(() => ({
      top: -5,
      left: Math.floor(Math.random() * 100) + "vw",
      animationDelay: Math.random() * 1 + 0.2 + "s",
      animationDuration: Math.floor(Math.random() * 8 + 2) + "s",
    }));
    setMeteorStyles(styles);
  }, [number]);

  return (
    <>
      {meteorStyles.map((style, idx) => (
        <div
          key={"meteor" + idx}
          className={cn("meteor", className)}
          style={style}
        ></div>
      ))}
    </>
  );
};
