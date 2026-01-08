// src/components/ui/card.jsx
import React from "react";

/**
 * Simple utility: concatenate class names
 * - Filters out falsy values (null, undefined, "")
 * - Joins into one string
 */
const cn = (...classes) => classes.filter(Boolean).join(" ");

/**
 * 🪪 Card
 * -----------
 * Base container with rounded corners, border, background, text color, and shadow.
 *
 * Props:
 * - className → merge custom classes with defaults.
 * - ...props → spread onto <div>.
 */
export const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl border bg-card text-card-foreground shadow",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

/**
 * 📝 CardContent
 * ----------------
 * Inner wrapper that provides consistent padding.
 *
 * Props:
 * - className → merge custom classes with defaults.
 * - ...props → spread onto <div>.
 */
export const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6", className)} {...props} />
));
CardContent.displayName = "CardContent";
