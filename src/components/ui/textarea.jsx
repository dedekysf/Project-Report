import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Textarea = forwardRef(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      data-slot="textarea"
      className={cn(
        "flex min-h-[72px] w-full resize-none rounded-lg border border-[color:var(--tt-grey03)] bg-white px-3 py-2 text-[14px] text-[color:var(--tt-text-1)] outline-none transition-colors placeholder:text-[color:var(--tt-grey05)] focus-visible:border-[color:var(--tt-text-1)] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});

export { Textarea };
