"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import { cn } from "@/lib/cn";

import type { ContactFormTone } from "./contactFormTone";
import { controlClassName } from "./Field";

const MENU_MS = 200;

function SelectChevron({
  onDark,
  open,
}: {
  onDark: boolean;
  open: boolean;
}) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "size-4 shrink-0 transition-transform duration-150",
        open && "rotate-180",
        onDark ? "text-background/75" : "text-muted",
      )}
      aria-hidden
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export type CustomSelectOption = {
  id: string;
  label: string;
};

type CustomSelectProps = {
  id: string;
  tone?: ContactFormTone;
  invalid?: boolean;
  value: string;
  onChange: (value: string) => void;
  options: CustomSelectOption[];
  placeholder: string;
  "aria-describedby"?: string;
};

export function CustomSelect({
  id,
  tone = "light",
  invalid,
  value,
  onChange,
  options,
  placeholder,
  "aria-describedby": ariaDescribedBy,
}: CustomSelectProps) {
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const onDark = tone === "on-dark";
  const isInvalid = invalid === true;

  const selected = options.find((option) => option.id === value);
  const label = selected?.label ?? placeholder;
  const showPlaceholder = !value;

  function closeMenu() {
    setOpen(false);
    setEntered(false);
    setActiveIndex(-1);
  }

  function openMenu() {
    const start = value
      ? Math.max(
          0,
          options.findIndex((option) => option.id === value),
        )
      : 0;
    setActiveIndex(start);
    setOpen(true);
    setMounted(true);
  }

  useEffect(() => {
    if (!open || !mounted) {
      return;
    }

    let outer = 0;
    let inner = 0;

    outer = window.requestAnimationFrame(() => {
      inner = window.requestAnimationFrame(() => {
        setEntered(true);
      });
    });

    return () => {
      window.cancelAnimationFrame(outer);
      window.cancelAnimationFrame(inner);
    };
  }, [open, mounted]);

  useEffect(() => {
    if (open || !mounted) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setMounted(false);
    }, MENU_MS);

    return () => window.clearTimeout(timeout);
  }, [open, mounted]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        closeMenu();
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  function selectIndex(index: number) {
    const option = options[index];
    if (!option) {
      return;
    }

    onChange(option.id);
    closeMenu();
  }

  function onTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openMenu();
      return;
    }

    if (event.key === "Escape") {
      closeMenu();
    }
  }

  function onListKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(options.length - 1, index + 1));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(0, index - 1));
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (activeIndex >= 0) {
        selectIndex(activeIndex);
      }
    }

    if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
    }

    if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(options.length - 1);
    }
  }

  return (
    <div ref={rootRef} className={cn("relative", open && "z-30")}>
      <button
        type="button"
        id={id}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-describedby={ariaDescribedBy}
        aria-invalid={isInvalid ? true : undefined}
        onClick={() => {
          if (open) {
            closeMenu();
            return;
          }
          openMenu();
        }}
        onKeyDown={onTriggerKeyDown}
        className={cn(
          controlClassName(invalid, tone),
          "flex items-center justify-between gap-3 pr-3 text-left",
          showPlaceholder &&
            (onDark ? "text-background/50" : "text-muted"),
        )}
      >
        <span className="min-w-0 truncate">{label}</span>
        <SelectChevron onDark={onDark} open={open} />
      </button>

      {mounted ? (
        <div
          className={cn(
            "absolute z-50 mt-2.5 grid w-full transition-[grid-template-rows] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
            entered ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
            !entered && "pointer-events-none",
            onDark
              ? "drop-shadow-[0_22px_40px_rgba(0,0,0,0.72)]"
              : "drop-shadow-[0_18px_36px_rgba(17,17,17,0.22)]",
          )}
        >
          <div className="min-h-0 overflow-hidden">
            <div
              className={cn(
                "relative overflow-hidden rounded-xl border outline-none",
                onDark
                  ? "border-background/25 bg-[#3a3a3a] text-background shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                  : "border-border bg-surface text-foreground",
              )}
            >
              {onDark ? (
                <div
                  className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/6 to-transparent"
                  aria-hidden
                />
              ) : null}
              <ul
                id={listboxId}
                role="listbox"
                aria-labelledby={id}
                tabIndex={-1}
                onKeyDown={onListKeyDown}
                className="relative z-1 max-h-60 overflow-auto p-1.5 outline-none"
              >
                {options.map((option, index) => {
                  const isSelected = option.id === value;
                  const isActive = index === activeIndex;

                  return (
                    <li
                      key={option.id}
                      id={`${id}-option-${option.id}`}
                      role="option"
                      aria-selected={isSelected}
                      onMouseEnter={() => setActiveIndex(index)}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => selectIndex(index)}
                      className={cn(
                        "cursor-pointer rounded-lg px-3 py-2.5 text-sm leading-6 transition-colors",
                        onDark
                          ? cn(
                              "text-background/90",
                              isActive && "bg-[#4a4a4a]",
                              isSelected &&
                                "bg-[#505050] font-medium text-background",
                            )
                          : cn(
                              "text-foreground",
                              isActive && "bg-accent",
                              isSelected && "bg-accent font-medium",
                            ),
                      )}
                    >
                      {option.label}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}