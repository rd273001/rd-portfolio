"use client";

import { useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/cn";
import { phoneFrontLayout } from "./phoneFrontLayout";

type AndroidPhoneFrameProps = {
  screenshot?: string;
  /** Multi-screen set with instant CSS crossfade (for showcase tab switching without re-fetch). */
  screens?: string[];
  activeScreenIndex?: number;
  alt?: string;
  /** Stacked screen images for case-study scroll (frame stays; screens crossfade). */
  layers?: {
    src: string;
    alt: string;
  }[];
  /**
   * `panel` — height-led; matches desktop Work 3D loading slot (9:19.5).
   * `stack` — width-led; Work mobile + case study screenshots (same aspect).
   */
  size?: "panel" | "stack";
  sizes?: string;
  priority?: boolean;
  className?: string;
};

/**
 * CSS 2D Android front (frame → glass → screen + punch-hole).
 * Tokens from `phoneFrontLayout` stay in sync with the GLB front face.
 * Image uses `object-fill` so production screenshots map 1:1 into the screen.
 */
export function AndroidPhoneFrame({
  screenshot,
  screens,
  activeScreenIndex = 0,
  alt = "",
  layers,
  size = "stack",
  sizes = "(min-width: 1024px) 280px, 55vw",
  priority = false,
  className,
}: AndroidPhoneFrameProps) {
  const [loadedScreens, setLoadedScreens] = useState<Record<string, boolean>>({});
  const isPanel = size === "panel";

  const activeSrc = screens && screens.length > 0 ? screens[activeScreenIndex] : screenshot;
  const isCurrentScreenLoaded = activeSrc ? Boolean(loadedScreens[activeSrc]) : true;

  return (
    <div
      className={
        isPanel
          ? `flex h-full w-full items-center justify-center ${className ?? ""}`
          : `mx-auto w-full max-w-68 ${className ?? ""}`
      }
    >
      <div
        className={
          isPanel ? "relative w-auto max-w-full" : "relative mx-auto w-full"
        }
        style={{
          ...(isPanel ? { height: phoneFrontLayout.viewportHeight } : {}),
          aspectRatio: isPanel
            ? phoneFrontLayout.aspectRatio
            : phoneFrontLayout.stackAspectRatio,
          containerType: "size",
        }}
      >
        <div
          className="relative box-border flex h-full w-full flex-col overflow-hidden"
          style={{
            background: phoneFrontLayout.frame.background,
            borderRadius: phoneFrontLayout.frame.borderRadius,
            padding: phoneFrontLayout.frame.padding,
            boxShadow: phoneFrontLayout.frame.boxShadow,
          }}
        >
          <div
            className="relative box-border flex min-h-0 w-full flex-1 flex-col overflow-hidden"
            style={{
              backgroundColor: phoneFrontLayout.colors.glassBezel,
              borderRadius: phoneFrontLayout.glass.borderRadius,
              boxShadow: phoneFrontLayout.glass.boxShadow,
              padding: phoneFrontLayout.glass.padding,
            }}
          >
            <div
              className="relative box-border min-h-0 w-full flex-1 overflow-hidden"
              style={{
                backgroundColor: phoneFrontLayout.colors.display,
                borderRadius: phoneFrontLayout.screen.borderRadius,
              }}
            >
              {screens && screens.length > 0 ? (
                <>
                  {!isCurrentScreenLoaded ? (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px] transition-opacity duration-200">
                      <div className="size-6 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
                      <span className="mt-2 font-mono text-[10px] tracking-wider uppercase text-white/60">
                        Loading
                      </span>
                    </div>
                  ) : null}
                  {screens.map((src, index) => {
                    const isActive = index === activeScreenIndex;
                    return (
                      <Image
                        key={src}
                        src={src}
                        alt={isActive ? alt : ""}
                        fill
                        sizes={sizes}
                        quality={95}
                        className={cn(
                          "object-fill transition-opacity duration-200 ease-out",
                          isActive
                            ? "opacity-100 z-1"
                            : "opacity-0 pointer-events-none z-0",
                        )}
                        priority={index === 0 || priority}
                        onLoad={() =>
                          setLoadedScreens((prev) => ({ ...prev, [src]: true }))
                        }
                        aria-hidden={isActive ? undefined : true}
                      />
                    );
                  })}
                </>
              ) : screenshot ? (
                <Image
                  src={screenshot}
                  alt={alt}
                  fill
                  sizes={sizes}
                  quality={95}
                  className="object-fill"
                  priority={priority}
                  onLoad={() => {
                    if (screenshot) {
                      setLoadedScreens((prev) => ({ ...prev, [screenshot]: true }));
                    }
                  }}
                />
              ) : null}
              {layers?.map((layer, index) => (
                <Image
                  key={layer.src}
                  src={layer.src}
                  alt={index === 0 ? layer.alt : ""}
                  fill
                  sizes={sizes}
                  quality={95}
                  data-case-story-screen=""
                  data-active="false"
                  className="object-fill bg-background"
                  priority={priority && index === 0}
                  aria-hidden={index === 0 ? undefined : true}
                />
              ))}
              <span
                className="absolute left-1/2 flex items-center justify-center rounded-full"
                style={{
                  top: phoneFrontLayout.punchHole.centerTop,
                  width: phoneFrontLayout.punchHole.size,
                  aspectRatio: "1",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: phoneFrontLayout.colors.punchHole,
                }}
              >
                <span
                  className="block rounded-full"
                  style={{
                    width: phoneFrontLayout.punchHole.lensSize,
                    aspectRatio: "1",
                    backgroundColor: phoneFrontLayout.colors.punchLens,
                  }}
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}