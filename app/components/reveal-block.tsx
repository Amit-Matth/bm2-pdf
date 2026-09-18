"use client";

import { useEffect, useRef, ReactNode } from "react";

export type RevealDirection = "bottom" | "left" | "right" | "scale";

interface RevealBlockProps {
  children: ReactNode;
  direction?: RevealDirection;
  /** Delay before the reveal fires, in milliseconds */
  delay?: number;
  className?: string;
}

/**
 * Wraps children and reveals them with a directional slide-in animation
 * as they enter the viewport using IntersectionObserver.
 * Colors, typography and layout are entirely untouched — only opacity
 * and transform are animated.
 */
export default function RevealBlock({
  children,
  direction = "bottom",
  delay = 0,
  className = "",
}: RevealBlockProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If the user prefers reduced motion, instantly reveal
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-visible");
      return;
    }

    let timer: ReturnType<typeof setTimeout>;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            timer = setTimeout(() => {
              el.classList.add("is-visible");
            }, delay);
            observer.unobserve(el);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    observer.observe(el);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`reveal reveal-${direction}${className ? ` ${className}` : ""}`}
    >
      {children}
    </div>
  );
}
