import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type QPMarkProps = ComponentProps<"svg"> & {
  label?: string;
};

export function QPMark({
  className,
  label = "Queimando Panela",
  ...props
}: QPMarkProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label={label}
      className={cn("size-10", className)}
      {...props}
    >
      <rect
        x="1.5"
        y="1.5"
        width="61"
        height="61"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        d="M16 25.5C16 19.7 20.5 16 26.6 16C32.7 16 37.2 19.8 37.2 25.5C37.2 31.3 32.7 35.2 26.6 35.2C20.5 35.2 16 31.3 16 25.5ZM21 25.5C21 28.7 23.2 31 26.6 31C30 31 32.2 28.7 32.2 25.5C32.2 22.4 30 20.2 26.6 20.2C23.2 20.2 21 22.4 21 25.5ZM29.8 32.8L37.6 40.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <path
        d="M41 16V41M41 16H49.8C55.1 16 58 19.2 58 23.9C58 28.6 55.1 31.8 49.8 31.8H41"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}
