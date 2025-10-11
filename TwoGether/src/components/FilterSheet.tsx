"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Slider } from "./ui/slider";
import { Checkbox } from "./ui/checkbox";
import { EventFilters } from "@/lib/schemas";
import { X, Filter } from "lucide-react";

interface FilterSheetProps {
    isOpen: boolean;
    onClose: () => void;
    filters: EventFilters;
    onFiltersChange: (filters: EventFilters) => void;
}

const CATEGORIES = [
    { value: "study", label: "Study" },
    { value: "sport", label: "Sports" },
    { value: "party", label: "Party" },
    { value: "food", label: "Food" },
    { value: "volunteer", label: "Volunteer" },
    { value: "carpool", label: "Carpool" },
    { value: "social", label: "Social" },
    { value: "academic", label: "Academic" },
];

const TIME_WINDOWS = [
    { value: "today", label: "Today" },
    { value: "this_week", label: "This Week" },
    { value: "this_month", label: "This Month" },
    { value: "all", label: "All Time" },
];

export function FilterSheet({ isOpen, onClose, filters, onFiltersChange }: FilterSheetProps) {
    const [localFilters, setLocalFilters] = useState<EventFilters>(filters);

    const handleApply = () => {
        onFiltersChange(localFilters);
        onClose();
    };

    const handleReset = () => {
        const resetFilters: EventFilters = {};
        setLocalFilters(resetFilters);
        onFiltersChange(resetFilters);
        onClose();
    };

    const updateFilter = <K extends keyof EventFilters>(
        key: K,
        value: EventFilters[K]
    ) => {
        setLocalFilters(prev => ({ ...prev, [key]: value }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
            <Card className="w-full max-h-[80vh] rounded-t-2xl">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="w-5 h-5" />
                        Filters
                    </CardTitle>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="w-4 h-4" />
                    </Button>
                </CardHeader>
                <CardContent className="space-y-6 max-h-[60vh] overflow-y-auto">
                    {/* Category Filter */}
                    <div className="space-y-3">
                        <h3 className="font-medium">Category</h3>
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map(category => (
                                <Badge
                                    key={category.value}
                                    variant={localFilters.category === category.value ? "default" : "outline"}
                                    className="cursor-pointer hover:bg-primary/10"
                                    onClick={() => updateFilter("category",
                                        localFilters.category === category.value ? undefined : category.value
                                    )}
                                >
                                    {category.label}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Time Window Filter */}
                    <div className="space-y-3">
                        <h3 className="font-medium">Time Window</h3>
                        <div className="flex flex-wrap gap-2">
                            {TIME_WINDOWS.map(window => (
                                <Badge
                                    key={window.value}
                                    variant={localFilters.time_window === window.value ? "default" : "outline"}
                                    className="cursor-pointer hover:bg-primary/10"
                                    onClick={() => updateFilter("time_window",
                                        localFilters.time_window === window.value ? undefined : window.value
                                    )}
                                >
                                    {window.label}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Host Rating Filter */}
                    <div className="space-y-3">
                        <h3 className="font-medium">
                            Minimum Host Rating: {localFilters.min_rating || 0}⭐
                        </h3>
                        <Slider
                            value={[localFilters.min_rating || 0]}
                            onValueChange={([value]) => updateFilter("min_rating", value)}
                            max={5}
                            min={0}
                            step={0.5}
                            className="w-full"
                        />
                    </div>

                    {/* Distance Filter */}
                    <div className="space-y-3">
                        <h3 className="font-medium">
                            Max Distance: {localFilters.max_distance || 10} miles
                        </h3>
                        <Slider
                            value={[localFilters.max_distance || 10]}
                            onValueChange={([value]) => updateFilter("max_distance", value)}
                            max={50}
                            min={1}
                            step={1}
                            className="w-full"
                        />
                    </div>

                    {/* Toggle Filters */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="only_carpools"
                                checked={localFilters.only_carpools || false}
                                onCheckedChange={(checked) => updateFilter("only_carpools", checked)}
                            />
                            <label htmlFor="only_carpools" className="text-sm font-medium">
                                Only Carpool Events
                            </label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="friends_attending"
                                checked={localFilters.friends_attending || false}
                                onCheckedChange={(checked) => updateFilter("friends_attending", checked)}
                            />
                            <label htmlFor="friends_attending" className="text-sm font-medium">
                                Friends Attending
                            </label>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <Button variant="outline" onClick={handleReset} className="flex-1">
                            Reset
                        </Button>
                        <Button onClick={handleApply} className="flex-1">
                            Apply Filters
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
