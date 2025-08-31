
"use client";
import { motion } from "framer-motion";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useMouse } from "@uidotdev/usehooks";

interface MousePosition {
  x: number | null;
  y: number | null;
}

const MouseContext = createContext<MousePosition>({ x: 0, y: 0 });

function useAnimationFrame(callback: (time: number) => void) {
  const requestRef = useRef<number>(0);
  const previousTimeRef = useRef<number>(0);

  const animate = (time: number) => {
    if (previousTimeRef.current) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);
}

const colors = [
  "#2233fe",
  "#14c6fb",
  "#1634f1",
  "#2233fe",
  "#14c6fb",
  "#1634f1",
  "#ffffff",
  "#ffffff",
];

const randomColor = () => colors[Math.floor(Math.random() * colors.length)];

function Sparkle() {
  const { x, y } = useContext(MouseContext);
  const [[_x, _y], setPosition] = useState([0, 0]);

  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current) {
      const { left, top, width, height } = ref.current.parentElement!.getBoundingClientRect();
      setPosition([
        x ? x - left - width / 2 : 0,
        y ? y - top - height / 2 : 0,
      ]);
    }
  }, [x, y]);

  return (
    <motion.span
      ref={ref}
      initial={{ scale: 0, x: _x, y: _y }}
      animate={{ scale: [0, 1, 0], transition: { duration: 1.5, type: 'spring' } }}
      style={{
        position: 'absolute',
        left: _x,
        top: _y,
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: randomColor(),
        boxShadow: `0 0 8px ${randomColor()}`,
      }}
    />
  );
}

function Sparkles({
  children,
  count = 10,
  className,
}: {
  children: React.ReactNode;
  count?: number;
  className?: string;
}) {
  const [sparkles, setSparkles] = useState<React.ReactNode[]>([]);
  const [mouse] = useMouse();

  useEffect(() => {
    const interval = setInterval(() => {
      setSparkles(prev => [
        ...prev,
        <Sparkle key={Math.random()} />,
      ]);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <MouseContext.Provider value={{ x: mouse.x, y: mouse.y }}>
      <div className={className}>
        {sparkles}
        {children}
      </div>
    </MouseContext.Provider>
  );
}

export { Sparkles };
