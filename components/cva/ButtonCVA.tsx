import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import React from "react";

const Button = cva(
  [
    "px-8 text-white py-3 font-bold",
    "focus-visible:translate-y-1 active:translate-y-1",
    "black-shadow",
  ],
  {
    variants: {
      intent: {
        normal: "bg-blue-500 active:bg-blue-600",
        good: "bg-green-500 active:bg-green-600",
        danger: "bg-red-500 active:bg-red-600",
        special: "bg-indigo-500 active:bg-indigo-700",
      },
      big: { true: "lg:py-6 lg:text-xl py-4 text-lg" },
      fullWidth: { true: "w-full" },
      disableHover: {
        true: "pointer-events-none text-green",
      },
      bigText: { true: "text-lg" },
      greyedOut: { true: "opacity-50" },
      pressed: {
        true: "shadow-solid-pressed translate-y-1 active:translate-y-1",
      },
    },
    defaultVariants: {
      intent: "normal",
    },
    compoundVariants: [
      {
        intent: "normal",
        pressed: true,
        className: "bg-blue-600",
      },
      {
        intent: "danger",
        pressed: true,
        className: "bg-red-600",
      },
      {
        intent: "good",
        pressed: true,
        className: "bg-green-600",
      },
      {
        intent: "special",
        pressed: true,
        className: "bg-indigo-700",
      },
    ],
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
  bigText,
  greyedOut,
  big,
  pressed,
  ...props
}) => (
  <button
    className={Button({
      intent,
      className,
      bigText,
      greyedOut,
      fullWidth,
      disableHover,
      big,
      pressed,
    })}
    {...props}
  >
    {text}
    {children}
  </button>
);
