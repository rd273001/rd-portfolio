"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { cn } from "@/lib/cn";

type ContactFormHeightSwapProps = {
  viewKey: string;
  children: ReactNode;
  className?: string;
};

/**
 * Animates height + content when swapping form ↔ success (both directions).
 */
export function ContactFormHeightSwap({
  viewKey,
  children,
  className,
}: ContactFormHeightSwapProps) {
  const innerRef = useRef<HTMLDivElement>(null);
  const heightRef = useRef<number | undefined>(undefined);
  const viewKeyRef = useRef(viewKey);
  const [height, setHeight] = useState<number | undefined>(undefined);

  useLayoutEffect(() => {
    const node = innerRef.current;
    if (!node) {
      return;
    }

    const measured = Math.ceil(node.getBoundingClientRect().height);
    const viewChanged = viewKeyRef.current !== viewKey;
    viewKeyRef.current = viewKey;

    const commitHeight = (next: number, animate: boolean) => {
      const previous = heightRef.current;

      if (animate && previous !== undefined && previous !== next) {
        setHeight(previous);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            heightRef.current = next;
            setHeight(next);
          });
        });
        return;
      }

      heightRef.current = next;
      setHeight(next);
    };

    commitHeight(measured, viewChanged);

    const observer = new ResizeObserver(() => {
      const next = Math.ceil(node.getBoundingClientRect().height);
      if (next === heightRef.current) {
        return;
      }
      heightRef.current = next;
      setHeight(next);
    });
    observer.observe(node);

    return () => observer.disconnect();
  }, [viewKey, children]);

  return (
    <div
      className={cn(
        "overflow-hidden transition-[height] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
        className,
      )}
      style={height !== undefined ? { height } : undefined}
    >
      <div
        key={viewKey}
        ref={innerRef}
        data-contact-form-swap-inner
        className="w-full"
      >
        {children}
      </div>
    </div>
  );
}