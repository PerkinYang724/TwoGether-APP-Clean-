import * as React from "react";
import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
    HTMLInputElement,
    React.ComponentProps<"input"> & {
        onCheckedChange?: (checked: boolean) => void;
    }
>(({ className, onCheckedChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onCheckedChange?.(e.target.checked);
    };

    return (
        <input
            type="checkbox"
            className={cn(
                "h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            ref={ref}
            onChange={handleChange}
            {...props}
        />
    );
});
Checkbox.displayName = "Checkbox";

export { Checkbox };
