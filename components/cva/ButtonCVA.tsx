// components/button.ts
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import React from "react";

const Button = cva(
  [
    "px-8 text-white py-2 font-bold",
    "focus-visible:translate-y-1 active:translate-y-1",
    "black-shadow",
  ],
  {
    variants: {
      intent: {
        normal: "bg-blue-500 active:bg-blue-600",
        good: "bg-green-500 active:bg-green-600",
        danger: "bg-red-500 active:bg-red-600",
      },
      big: { true: "lg:py-6 lg:text-xl py-4 text-lg" },
      fullWidth: { true: "w-full" },
      disableHover: {
        true: "pointer-events-none text-green",
      },
    },
    defaultVariants: {
      intent: "normal",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof Button> {
  text?: string;
}

// From this
export const ButtonCVA: React.FC<ButtonProps> = ({
  className,
  intent,
  children,
  text,
  fullWidth,
  disableHover,
  big,
  ...props
}) => (
  <button
    className={Button({ intent, className, fullWidth, disableHover, big })}
    {...props}
  >
    {text}
    {children}
  </button>
);
