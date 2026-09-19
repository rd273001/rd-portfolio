import Image from "next/image";

import { phoneFrontLayout } from "./phoneFrontLayout";

type AndroidPhoneFrameProps = {
  screenshot?: string;
  alt?: string;
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
  alt = "",
  size = "stack",
  sizes = "(min-width: 1024px) 280px, 55vw",
  priority = false,
  className,
}: AndroidPhoneFrameProps) {
  const isPanel = size === "panel";

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
              {screenshot ? (
                <Image
                  src={screenshot}
                  alt={alt}
                  fill
                  sizes={sizes}
                  quality={95}
                  className="object-fill"
                  priority={priority}
                />
              ) : null}
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