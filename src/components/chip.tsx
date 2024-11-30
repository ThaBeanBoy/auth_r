import { cn } from "@/lib/utils";
import { forwardRef, HTMLAttributes } from "react";

export type ChipElement = HTMLDivElement;

export type ChipProps = HTMLAttributes<ChipElement>;

export const Chip = forwardRef<ChipElement, ChipProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded border border-slate-600 bg-slate-50 p-1 text-sm font-medium text-slate-600",
        className,
      )}
      {...props}
    />
  ),
);

Chip.displayName = "Chip";
