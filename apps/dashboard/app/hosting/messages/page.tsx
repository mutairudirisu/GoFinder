"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useMessages } from "@/context/MessageContext";

export default function HostingMessagesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { conversations, messages, sendMessage, getConversation, getMessages, markAsRead, refreshConversations } = useMessages();
  
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get conversation ID from URL params
  const conversationParam = searchParams.get("conversation");

  // Refresh messages on mount
  useEffect(() => {
    refreshConversations();
  }, [refreshConversations]);

  // Redirect if not authorized
  useEffect(() => {
    if (user && user.role === 'renter') {
      router.replace("/listings");
    }
  }, [user, router]);

  // Set initial selected conversation
  useEffect(() => {
    if (conversationParam) {
      setSelectedConversationId(conversationParam);
    } else if (conversations.length > 0 && !selectedConversationId) {
      const firstConv = conversations[0];
      if (firstConv) {
        setSelectedConversationId(firstConv.id);
      }
    }
  }, [conversationParam, conversations, selectedConversationId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedConversationId]);

  // Mark conversation as read when selected
  useEffect(() => {
    if (selectedConversationId && user) {
      markAsRead(selectedConversationId, user.id);
    }
  }, [selectedConversationId, user, markAsRead]);

  const selectedConversation = selectedConversationId ? getConversation(selectedConversationId) : null;
  const selectedMessages = selectedConversationId ? getMessages(selectedConversationId) : [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversationId || !user) return;

    sendMessage(selectedConversationId, user.id, newMessage.trim());
    setNewMessage("");
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getOtherParticipantName = (conversation: any) => {
    if (!user) return "Unknown";
    const otherParticipantId = conversation.participants.find((id: string) => id !== user.id);
    return conversation.participantNames[otherParticipantId || ""] || "Unknown";
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/auth/login?redirect=/hosting/messages");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-[calc(100vh-180px)]">
      {/* Conversations List */}
      <div className={`
        w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col bg-white
        ${selectedConversationId ? 'hidden md:flex' : 'flex'}
      `}>
        {/* Header */}
        <div className="p-4 border-b border-slate-200">
          <h1 className="font-display font-bold text-xl text-brand-dark">Messages</h1>
          <p className="text-sm text-slate-500">
            {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ph ph-chat-circle-dots text-3xl text-slate-400"></i>
              </div>
              <p className="text-slate-600 font-medium">No messages yet</p>
              <p className="text-sm text-slate-400 mt-1">
                Contact from guests will appear here
              </p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversationId(conversation.id)}
                className={`
                  w-full p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors border-b border-slate-100
                  ${selectedConversationId === conversation.id ? 'bg-brand-50' : ''}
                `}
              >
                {/* Listing Image */}
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={conversation.listingImage}
                    alt={conversation.listingTitle}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold text-brand-dark text-sm truncate">
                      {getOtherParticipantName(conversation)}
                    </p>
                    <span className="text-xs text-slate-400">
                      {formatTime(conversation.lastMessageTime)}
                    </span>
                  </div>
                  <p className="text-xs text-brand-600 truncate mb-1">
                    {conversation.listingTitle}
                  </p>
                  <p className="text-sm text-slate-500 truncate">
                    {conversation.lastMessage || "No messages yet"}
                  </p>
                </div>

                {/* Unread Badge */}
                {conversation.unreadCount > 0 && (
                  <span className="bg-brand-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {conversation.unreadCount}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`
        flex-1 flex flex-col
        ${!selectedConversationId ? 'hidden md:flex' : 'flex'}
      `}>
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-200 flex items-center gap-4 bg-white">
              <button
                onClick={() => setSelectedConversationId(null)}
                className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
              >
                <i className="ph ph-arrow-left text-xl"></i>
              </button>
              
              <button
                onClick={() => router.push(`/listings/${selectedConversation.listingId}`)}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden">
                  <img
                    src={selectedConversation.listingImage}
                    alt={selectedConversation.listingTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold text-brand-dark text-sm">
                    {getOtherParticipantName(selectedConversation)}
                  </p>
                  <p className="text-xs text-slate-500 truncate max-w-[150px]">
                    {selectedConversation.listingTitle}
                  </p>
                </div>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
              {selectedMessages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <i className="ph ph-chat-circle-dots text-4xl text-slate-300 mb-2"></i>
                    <p className="text-slate-500">Send a message to start the conversation</p>
                  </div>
                </div>
              ) : (
                selectedMessages.map((message) => {
                  const isOwnMessage = message.senderId === user.id;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`
                          max-w-[70%] px-4 py-2.5 rounded-2xl
                          ${isOwnMessage 
                            ? 'bg-brand-500 text-white rounded-br-md' 
                            : 'bg-white text-brand-dark rounded-bl-md shadow-sm'
                          }
                        `}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`
                          text-xs mt-1
                          ${isOwnMessage ? 'text-white/70' : 'text-slate-400'}
                        `}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-white">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-brand-300 focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-2.5 bg-brand-500 text-white rounded-xl hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <i className="ph ph-paper-plane-right text-xl"></i>
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-slate-50">
            <div className="text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ph ph-chat-circle-dots text-4xl text-slate-300"></i>
              </div>
              <h2 className="font-display font-bold text-xl text-brand-dark mb-2">
                Your Messages
              </h2>
              <p className="text-slate-500 max-w-sm">
                Select a conversation to start messaging guests
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
