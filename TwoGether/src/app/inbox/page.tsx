"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft, MessageCircle, Users, Clock, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

// Mock chat threads
const mockThreads = [
    {
        id: "1",
        type: "event" as const,
        title: "Study Group for Midterm",
        lastMessage: {
            content: "See you all tomorrow at 2pm!",
            sender_name: "Sarah",
            created_at: "2 hours ago",
        },
        unreadCount: 2,
    },
    {
        id: "2",
        type: "event" as const,
        title: "Basketball Game",
        lastMessage: {
            content: "Great game everyone!",
            sender_name: "Mike",
            created_at: "1 day ago",
        },
        unreadCount: 0,
    },
    {
        id: "3",
        type: "dm" as const,
        title: "Alex Chen",
        lastMessage: {
            content: "Thanks for the ride!",
            sender_name: "Alex",
            created_at: "3 days ago",
        },
        unreadCount: 1,
    },
];

export default function InboxPage() {
    const router = useRouter();

    const handleThreadClick = (thread: typeof mockThreads[0]) => {
        if (thread.type === "event") {
            router.push(`/events/${thread.id}/chat`);
        } else {
            router.push(`/chat/${thread.id}`);
        }
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border safe-area-top">
                <div className="flex items-center gap-4 p-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <h1 className="text-xl font-semibold">Inbox</h1>
                    <div className="flex-1" />
                    <Button variant="ghost" size="icon">
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>
            </header>

            <div className="p-4">
                {mockThreads.length === 0 ? (
                    <div className="text-center py-12">
                        <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <h2 className="text-xl font-semibold mb-2">No conversations yet</h2>
                        <p className="text-muted-foreground mb-6">
                            Join some events to start chatting with other students!
                        </p>
                        <Button onClick={() => router.push("/")}>
                            <Users className="w-4 h-4 mr-2" />
                            Browse Events
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {mockThreads.map(thread => (
                            <Card
                                key={thread.id}
                                className="cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => handleThreadClick(thread)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                            {thread.type === "event" ? (
                                                <Users className="w-6 h-6 text-primary" />
                                            ) : (
                                                <MessageCircle className="w-6 h-6 text-primary" />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="font-semibold truncate">{thread.title}</h3>
                                                {thread.unreadCount > 0 && (
                                                    <Badge variant="destructive" className="text-xs">
                                                        {thread.unreadCount}
                                                    </Badge>
                                                )}
                                            </div>

                                            <p className="text-sm text-muted-foreground truncate mb-1">
                                                <span className="font-medium">{thread.lastMessage.sender_name}:</span>{" "}
                                                {thread.lastMessage.content}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Clock className="w-3 h-3" />
                                                <span>{thread.lastMessage.created_at}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <BottomNav />
        </div>
    );
}