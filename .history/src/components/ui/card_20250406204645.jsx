import React from "react";

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`border text-card-foreground shadow w-full bg-white rounded-lg ${className}`}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`flex flex-col space-y-1.5 p-6 px-5 py-1 ${className}`}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={`p-6 pt-0 px-5 ${className}`} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`items-center p-6 pt-0 flex flex-col px-5 pb-2.5 ${className}`}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardContent, CardFooter }; 