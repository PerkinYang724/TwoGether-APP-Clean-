"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
    ArrowRight,
    ArrowLeft,
    Check,
    GraduationCap,
    Heart,
    Shield,
    Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAnalytics } from "@/lib/analytics";
import { useHaptics } from "@/lib/haptics";
import { COPY } from "@/lib/copy";

const INTERESTS = [
    "Study Groups", "Sports", "Music", "Art", "Tech", "Food",
    "Volunteering", "Fitness", "Gaming", "Movies", "Travel", "Photography",
    "Dancing", "Reading", "Cooking", "Hiking", "Yoga", "Fashion"
];

const CAMPUSES = [
    { id: "stanford", name: "Stanford University", city: "Stanford, CA" },
    { id: "berkeley", name: "UC Berkeley", city: "Berkeley, CA" },
    { id: "ucla", name: "UCLA", city: "Los Angeles, CA" },
    { id: "usc", name: "USC", city: "Los Angeles, CA" },
    { id: "nyu", name: "NYU", city: "New York, NY" },
    { id: "columbia", name: "Columbia University", city: "New York, NY" },
];

type OnboardingStep = "welcome" | "campus" | "interests" | "safety" | "complete";

export default function OnboardingPage() {
    const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
    const [selectedCampus, setSelectedCampus] = useState<string>("");
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [safetyPledge, setSafetyPledge] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const { track } = useAnalytics();
    const { success, selection } = useHaptics();

    const steps: OnboardingStep[] = ["welcome", "campus", "interests", "safety", "complete"];
    const currentStepIndex = steps.indexOf(currentStep);

    const handleNext = () => {
        if (currentStepIndex < steps.length - 1) {
            selection(); // Haptic feedback
            setCurrentStep(steps[currentStepIndex + 1]);

            // Analytics tracking
            track(`onboard_${currentStep}`, { step: currentStepIndex + 1 });
        }
    };

    const handlePrevious = () => {
        if (currentStepIndex > 0) {
            setCurrentStep(steps[currentStepIndex - 1]);
        }
    };

    const handleCampusSelect = (campusId: string) => {
        setSelectedCampus(campusId);
        selection(); // Haptic feedback
        track('onboard_campus_select', { campus_id: campusId });
    };

    const handleInterestToggle = (interest: string) => {
        setSelectedInterests(prev =>
            prev.includes(interest)
                ? prev.filter(i => i !== interest)
                : [...prev, interest]
        );
        selection(); // Haptic feedback
        track('onboard_interests_select', {
            interest,
            total_selected: selectedInterests.length + 1
        });
    };

    const handleSafetyPledge = (checked: boolean) => {
        setSafetyPledge(checked);
        selection(); // Haptic feedback
        track('onboard_safety_pledge', { agreed: checked });
    };

    const handleComplete = async () => {
        setIsLoading(true);
        success(); // Success haptic feedback

        // Analytics tracking
        track('onboard_complete', {
            campus_id: selectedCampus,
            interests_count: selectedInterests.length,
            safety_pledge: safetyPledge
        });

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Navigate to home
        router.push("/");
    };

    const canProceed = () => {
        switch (currentStep) {
            case "campus":
                return selectedCampus !== "";
            case "interests":
                return selectedInterests.length >= 3;
            case "safety":
                return safetyPledge;
            default:
                return true;
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case "welcome":
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-center space-y-6"
                    >
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                            <GraduationCap className="w-10 h-10 text-primary" />
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold">{COPY.ONBOARDING.WELCOME_TITLE}</h1>
                            <p className="text-muted-foreground">{COPY.ONBOARDING.WELCOME_SUBTITLE}</p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="space-y-2">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                                    <span className="text-xl">🎉</span>
                                </div>
                                <p className="text-sm font-medium">Find Events</p>
                            </div>
                            <div className="space-y-2">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                    <span className="text-xl">👥</span>
                                </div>
                                <p className="text-sm font-medium">Make Friends</p>
                            </div>
                            <div className="space-y-2">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                                    <span className="text-xl">🚗</span>
                                </div>
                                <p className="text-sm font-medium">Carpool</p>
                            </div>
                        </div>
                    </motion.div>
                );

            case "campus":
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center space-y-2">
                            <h1 className="text-2xl font-bold">{COPY.ONBOARDING.CAMPUS_SELECT_TITLE}</h1>
                            <p className="text-muted-foreground">{COPY.ONBOARDING.CAMPUS_SELECT_SUBTITLE}</p>
                        </div>

                        <div className="space-y-3">
                            {CAMPUSES.map((campus) => (
                                <Card
                                    key={campus.id}
                                    className={cn(
                                        "cursor-pointer transition-all duration-200 hover:shadow-md",
                                        selectedCampus === campus.id && "ring-2 ring-primary bg-primary/5"
                                    )}
                                    onClick={() => handleCampusSelect(campus.id)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-semibold">{campus.name}</h3>
                                                <p className="text-sm text-muted-foreground">{campus.city}</p>
                                            </div>
                                            {selectedCampus === campus.id && (
                                                <Check className="w-5 h-5 text-primary" />
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </motion.div>
                );

            case "interests":
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center space-y-2">
                            <h1 className="text-2xl font-bold">{COPY.ONBOARDING.INTERESTS_TITLE}</h1>
                            <p className="text-muted-foreground">{COPY.ONBOARDING.INTERESTS_SUBTITLE}</p>
                            <p className="text-sm text-muted-foreground">
                                Select at least 3 interests ({selectedInterests.length}/3)
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {INTERESTS.map((interest) => (
                                <Badge
                                    key={interest}
                                    variant={selectedInterests.includes(interest) ? "default" : "outline"}
                                    className={cn(
                                        "cursor-pointer transition-all duration-200 p-3 text-center",
                                        selectedInterests.includes(interest) && "bg-primary text-primary-foreground"
                                    )}
                                    onClick={() => handleInterestToggle(interest)}
                                >
                                    {interest}
                                </Badge>
                            ))}
                        </div>
                    </motion.div>
                );

            case "safety":
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <Shield className="w-8 h-8 text-green-600" />
                            </div>
                            <h1 className="text-2xl font-bold">{COPY.ONBOARDING.SAFETY_TITLE}</h1>
                            <p className="text-muted-foreground">{COPY.ONBOARDING.SAFETY_SUBTITLE}</p>
                        </div>

                        <Card>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Checkbox
                                            id="safety-pledge"
                                            checked={safetyPledge}
                                            onCheckedChange={handleSafetyPledge}
                                        />
                                        <Label htmlFor="safety-pledge" className="text-sm leading-relaxed">
                                            {COPY.ONBOARDING.SAFETY_PLEDGE}
                                        </Label>
                                    </div>

                                    <div className="space-y-3 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Check className="w-4 h-4 text-green-600" />
                                            <span>University email verification</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Check className="w-4 h-4 text-green-600" />
                                            <span>Community guidelines enforcement</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Check className="w-4 h-4 text-green-600" />
                                            <span>Easy reporting system</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                );

            case "complete":
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-center space-y-6"
                    >
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <Star className="w-10 h-10 text-green-600" />
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold">{COPY.ONBOARDING.COMPLETE_TITLE}</h1>
                            <p className="text-muted-foreground">{COPY.ONBOARDING.COMPLETE_SUBTITLE}</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                <Check className="w-4 h-4 text-green-600" />
                                <span>Campus: {CAMPUSES.find(c => c.id === selectedCampus)?.name}</span>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                <Check className="w-4 h-4 text-green-600" />
                                <span>{selectedInterests.length} interests selected</span>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                <Check className="w-4 h-4 text-green-600" />
                                <span>Safety pledge agreed</span>
                            </div>
                        </div>
                    </motion.div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Progress Bar */}
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
                <div className="px-4 py-3">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">
                            Step {currentStepIndex + 1} of {steps.length}
                        </span>
                        <span className="text-sm font-medium">
                            {Math.round(((currentStepIndex + 1) / steps.length) * 100)}%
                        </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                        <motion.div
                            className="bg-primary h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-4 py-8">
                <Card className="max-w-md mx-auto">
                    <CardContent className="p-6">
                        <AnimatePresence mode="wait">
                            {renderStep()}
                        </AnimatePresence>
                    </CardContent>
                </Card>
            </div>

            {/* Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-border safe-area-bottom">
                <div className="px-4 py-4">
                    <div className="flex items-center justify-between max-w-md mx-auto">
                        <Button
                            variant="outline"
                            onClick={handlePrevious}
                            disabled={currentStepIndex === 0}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Button>

                        {currentStep === "complete" ? (
                            <Button
                                onClick={handleComplete}
                                disabled={isLoading}
                                className="flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Setting up...
                                    </>
                                ) : (
                                    <>
                                        {COPY.ONBOARDING.COMPLETE_CTA}
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </Button>
                        ) : (
                            <Button
                                onClick={handleNext}
                                disabled={!canProceed()}
                                className="flex items-center gap-2"
                            >
                                Next
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
