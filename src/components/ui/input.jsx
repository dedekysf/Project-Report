import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Input = forwardRef(function Input({ className, type = "text", ...props }, ref) {
  return (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full min-w-0 rounded-lg border border-[color:var(--tt-grey03)] bg-white px-3 text-[14px] text-[color:var(--tt-text-1)] outline-none transition-colors placeholder:text-[color:var(--tt-grey05)] focus-visible:border-[color:var(--tt-text-1)] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});

export { Input };
