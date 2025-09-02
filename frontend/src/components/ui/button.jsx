<<<<<<< HEAD
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../../libs/utils.js";

// keep your base layout/focus styles, but NO background colors here
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium " +
  "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
  "focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-all duration-300",
  {
    variants: {
      variant: {
        // 👉 new: unstyled = does not set bg / hover at all
        unstyled: "bg-transparent hover:bg-transparent shadow-none",
        // keep others if you want (destructive, outline, etc.) — or remove them
        // but do NOT use them on your gradient buttons
      },
      size: {
        default: "h-10 px-4",
        sm: "h-9 px-3",
        lg: "h-11 px-6",
        xl: "h-12 px-8 text-base",
        icon: "h-10 w-10 p-0",
      },
    },
    // 👉 make unstyled the default globally
    defaultVariants: { variant: "unstyled", size: "default" },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
=======
import React from "react";

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2";

  const variants = {
    primary:
      "bg-primary text-primary-foreground hover:bg-primary/90 shadow",
    outline:
      "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
    hero:
      "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/75 shadow-lg",
    ghost:
      "text-primary hover:bg-primary/10",
  };

  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-base",
    lg: "h-11 px-5 text-lg",
    xl: "h-12 px-6 text-lg",
  };

  return (
    <button
      className={`${base} ${variants[variant] ?? ""} ${sizes[size] ?? ""} ${className}`}
      {...props}
    />
  );
}
>>>>>>> 1e8f5082f548298b745607be41c678f7c24d3772
