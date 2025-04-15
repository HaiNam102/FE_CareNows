import React from "react";

const Badge = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`inline-flex items-center rounded-md border px-2.5 py-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent shadow hover:bg-primary/80 ${className}`}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export { Badge }; 