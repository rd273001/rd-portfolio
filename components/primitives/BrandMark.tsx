import Image from "next/image";

import { cn } from "@/lib/cn";

type BrandMarkProps = {
  className?: string;
};

/** Same asset as `app/icon.svg` (via `/brand-mark.svg`) so spacing matches the favicon. */
export function BrandMark({ className }: BrandMarkProps) {
  return (
    <Image
      src="/brand-mark.svg"
      alt=""
      width={32}
      height={32}
      priority
      className={cn("size-8 shrink-0 md:size-9", className)}
    />
  );
}