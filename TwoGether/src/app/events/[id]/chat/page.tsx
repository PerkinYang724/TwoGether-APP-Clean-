"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft, Send, Users } from "lucide-react";
import { Message } from "@/lib/schemas";
import { useRouter } from "next/navigation";

interface ChatPageProps {
    params: {
        id: string;
    };
}

export default function EventChatPage({ params }: ChatPageProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        fetchMessages();
        subscribeToMessages();
    }, [params.id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchMessages = async () => {
        try {
            const { data, error } = await supabase
                .from("messages")
                .select(`
          *,
          profiles!messages_sender_id_fkey (
            full_name,
            avatar_url
          )
        `)
                .eq("event_id", params.id)
                .order("created_at", { ascending: true });

            if (error) throw error;
            setMessages(data || []);
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            setLoading(false);
        }
    };

    const subscribeToMessages = () => {
        const channel = supabase
            .channel(`event-${params.id}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `event_id=eq.${params.id}`,
                },
                (payload) => {
                    // Fetch the new message with profile data
                    supabase
                        .from("messages")
                        .select(`
              *,
              profiles!messages_sender_id_fkey (
                full_name,
                avatar_url
              )
            `)
                        .eq("id", payload.new.id)
                        .single()
                        .then(({ data }) => {
                            if (data) {
                                setMessages(prev => [...prev, data]);
                            }
                        });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const { error } = await supabase
                .from("messages")
                .insert({
                    event_id: params.id,
                    sender_id: user.id,
                    content: newMessage.trim(),
                });

            if (error) throw error;
            setNewMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setSending(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border safe-area-top">
                <div className="flex items-center gap-4 p-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        <h1 className="text-lg font-semibold">Event Chat</h1>
                    </div>
                </div>
            </header>

            {/* Messages */}
            <div className="flex-1 p-4 space-y-4 min-h-[calc(100vh-200px)]">
                {messages.length === 0 ? (
                    <div className="text-center py-12">
                        <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
                        <p className="text-muted-foreground">
                            Start the conversation by sending a message!
                        </p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <div key={message.id} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                {message.profiles?.avatar_url ? (
                                    <img
                                        src={message.profiles.avatar_url}
                                        alt={message.profiles.full_name}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="text-sm font-semibold">
                                        {message.profiles?.full_name?.charAt(0) || "?"}
                                    </span>
                                )}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-medium">
                                        {message.profiles?.full_name || "Unknown"}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {formatTime(message.created_at)}
                                    </span>
                                </div>
                                <Card className="inline-block">
                                    <CardContent className="p-3">
                                        <p className="text-sm">{message.content}</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="sticky bottom-20 bg-background border-t border-border p-4">
                <div className="flex gap-2">
                    <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={sending}
                        className="flex-1"
                    />
                    <Button
                        onClick={sendMessage}
                        disabled={!newMessage.trim() || sending}
                        size="icon"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <BottomNav />
        </div>
    );
}
