import React from "react";

/**
 * FullWidth: forces edge-to-edge width while coexisting with shadcn containers.
 * Wrap sections that must span the entire viewport (hero, carousel, promos).
 */
const FullWidth = ({ children, className = "", dir }) => {
  return (
    <section
      dir={dir}
      className={[
        // true viewport width + centered bleed
        "w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]",
        // avoid cutting bleed by ancestors
        "isolate overflow-clip",
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
};

export default FullWidth;
