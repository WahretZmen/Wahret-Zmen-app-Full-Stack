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
