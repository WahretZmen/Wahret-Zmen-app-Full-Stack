// src/components/ui/buttons.jsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * 🎨 Button Variants (via class-variance-authority)
 * -------------------------------------------------
 * - Base styles shared across all buttons.
 * - Variants: default, destructive, outline, secondary, ghost, link, luxury, hero.
 * - Sizes: default, sm, lg, xl, icon.
 *
 * Use `buttonVariants({ variant: "hero", size: "xl" })`
 * to generate a full className string.
 */
const buttonVariants = cva(
  // 🔹 Base classes: flex layout, accessibility, transition
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 transition-all duration-300",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",

        // ✨ Custom brand buttons
        luxury:
          "bg-luxury text-luxury-foreground hover:bg-luxury/90 shadow-luxury hover:shadow-xl transform hover:-translate-y-0.5",
        hero:
          "bg-gradient-to-r from-primary to-primary-glow text-primary-foreground hover:shadow-elegant transform hover:scale-105",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-14 rounded-lg px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * 🖲️ Button Component
 * --------------------
 * A flexible <button> that supports variants, sizes, and slot wrapping.
 *
 * Props:
 * - variant: string → visual style ("default", "hero", etc.)
 * - size: string → button size ("sm", "lg", "xl", "icon")
 * - asChild: boolean → if true, renders as Radix <Slot> (useful for links)
 * - className: string → additional custom classes
 */
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"; // allow slot for flexibility
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
