import * as React from "react";
import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
    HTMLInputElement,
    React.ComponentProps<"input"> & {
        value?: number[];
        onValueChange?: (value: number[]) => void;
        max?: number;
        min?: number;
        step?: number;
    }
>(({ className, value = [0], onValueChange, max = 100, min = 0, step = 1, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(e.target.value);
        onValueChange?.([newValue]);
    };

    return (
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value[0]}
            onChange={handleChange}
            className={cn(
                "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider",
                className
            )}
            ref={ref}
            {...props}
        />
    );
});
Slider.displayName = "Slider";

export { Slider };
