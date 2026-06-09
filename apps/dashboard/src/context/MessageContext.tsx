"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

// Types
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: number;
  read: boolean;
}

export interface Conversation {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  participants: string[]; // User IDs
  participantNames: Record<string, string>;
  lastMessage: string;
  lastMessageTime: number;
  unreadCount: number;
  unreadBy?: Record<string, number>;
  lastSenderId?: string;
}

interface MessageContextType {
  conversations: Conversation[];
  messages: Record<string, Message[]>; // conversationId -> messages
  unreadCount: number;
  startConversation: (listingId: string, listingTitle: string, listingImage: string, recipientId: string, recipientName: string, senderId: string, senderName: string) => string;
  sendMessage: (conversationId: string, senderId: string, content: string) => void;
  getConversation: (conversationId: string) => Conversation | undefined;
  getMessages: (conversationId: string) => Message[];
  markAsRead: (conversationId: string, userId: string) => void;
  refreshConversations: () => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

// Storage keys
const CONVERSATIONS_KEY = "gigs_conversations";
const MESSAGES_KEY = "gigs_messages";

// Helper to generate unique IDs
const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export function MessageProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  const normalizeConversation = useCallback((conv: unknown): Conversation => {
    const c = conv && typeof conv === "object" ? (conv as Record<string, unknown>) : {};
    const participantsRaw = Array.isArray(c.participants) ? c.participants : [];
    const participants = participantsRaw.map((p) => String(p));
    const unreadByRaw = c.unreadBy && typeof c.unreadBy === "object" ? (c.unreadBy as Record<string, unknown>) : undefined;
    const normalizedUnreadBy: Record<string, number> = unreadByRaw
      ? Object.fromEntries(Object.entries(unreadByRaw ?? {}).map(([k, v]) => [String(k), Number(v ?? 0)]))
      : Object.fromEntries(participants.map((p: string) => [p, 0]));

    if (!unreadByRaw && typeof c.unreadCount === "number" && participants.length > 0) {
      const fallbackOwner = participants[0];
      if (fallbackOwner) normalizedUnreadBy[fallbackOwner] = 0;
    }

    const normalized: Conversation = {
      id: String(c.id ?? generateId()),
      listingId: String(c.listingId ?? ""),
      listingTitle: String(c.listingTitle ?? ""),
      listingImage: String(c.listingImage ?? ""),
      participants,
      participantNames: (c.participantNames && typeof c.participantNames === "object" ? c.participantNames : {}) as Record<string, string>,
      lastMessage: String(c.lastMessage ?? ""),
      lastMessageTime: Number(c.lastMessageTime ?? Date.now()),
      unreadCount: Number(c.unreadCount ?? 0),
      unreadBy: normalizedUnreadBy,
      lastSenderId: c.lastSenderId ? String(c.lastSenderId) : undefined,
    };

    normalized.unreadCount = Object.values(normalized.unreadBy ?? {}).reduce((a, b) => a + b, 0);
    return normalized;
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const storedConversations = localStorage.getItem(CONVERSATIONS_KEY);
      const storedMessages = localStorage.getItem(MESSAGES_KEY);

      if (storedConversations) {
        const parsed = JSON.parse(storedConversations);
        const next = Array.isArray(parsed) ? parsed.map((c) => normalizeConversation(c)) : [];
        setConversations(next);
      }
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    } catch (error) {
      console.error("Error loading messages from localStorage:", error);
    }
    setIsLoaded(true);
  }, [normalizeConversation]);

  // Save to localStorage when data changes
  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error("Error saving messages to localStorage:", error);
    }
  }, [conversations, messages, isLoaded]);

  // Calculate total unread count
  const unreadCount = useMemo(() => {
    const uid = user?.id;
    if (!uid) return conversations.reduce((total, conv) => total + (conv.unreadCount ?? 0), 0);
    return conversations.reduce((total, conv) => total + (conv.unreadBy?.[uid] ?? 0), 0);
  }, [conversations, user?.id]);

  // Start a new conversation or return existing one
  const startConversation = useCallback((
    listingId: string,
    listingTitle: string,
    listingImage: string,
    recipientId: string,
    recipientName: string,
    senderId: string,
    senderName: string
  ): string => {
    // Check if conversation already exists between these users for this listing
    const existingConv = conversations.find(
      conv => conv.listingId === listingId && 
             conv.participants.includes(senderId) && 
             conv.participants.includes(recipientId)
    );

    if (existingConv) {
      return existingConv.id;
    }

    // Create new conversation
    const conversationId = generateId();
    const newConversation: Conversation = {
      id: conversationId,
      listingId,
      listingTitle,
      listingImage,
      participants: [senderId, recipientId],
      participantNames: {
        [senderId]: senderName,
        [recipientId]: recipientName
      },
      lastMessage: "",
      lastMessageTime: Date.now(),
      unreadCount: 0,
      unreadBy: {
        [senderId]: 0,
        [recipientId]: 0
      },
      lastSenderId: undefined
    };

    setConversations(prev => [newConversation, ...prev]);
    setMessages(prev => ({ ...prev, [conversationId]: [] }));

    return conversationId;
  }, [conversations]);

  // Send a message
  const sendMessage = useCallback((
    conversationId: string,
    senderId: string,
    content: string
  ) => {
    const messageId = generateId();
    const newMessage: Message = {
      id: messageId,
      conversationId,
      senderId,
      content,
      timestamp: Date.now(),
      read: false
    };

    setMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMessage]
    }));

    // Update conversation's last message
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        const participants = Array.isArray(conv.participants) ? conv.participants : [];
        const currentUnreadBy = conv.unreadBy ?? Object.fromEntries(participants.map((p) => [p, 0]));
        const nextUnreadBy: Record<string, number> = { ...currentUnreadBy };
        for (const p of participants) {
          if (String(p) === String(senderId)) continue;
          nextUnreadBy[String(p)] = Number(nextUnreadBy[String(p)] ?? 0) + 1;
        }
        const nextUnreadCount = Object.values(nextUnreadBy).reduce((a, b) => a + b, 0);
        return {
          ...conv,
          lastMessage: content,
          lastMessageTime: Date.now(),
          unreadCount: nextUnreadCount,
          unreadBy: nextUnreadBy,
          lastSenderId: senderId
        };
      }
      return conv;
    }));
  }, []);

  // Get a specific conversation
  const getConversation = useCallback((conversationId: string): Conversation | undefined => {
    return conversations.find(conv => conv.id === conversationId);
  }, [conversations]);

  // Get messages for a conversation
  const getMessages = useCallback((conversationId: string): Message[] => {
    return messages[conversationId] || [];
  }, [messages]);

  // Mark conversation as read
  const markAsRead = useCallback((conversationId: string, userId: string) => {
    setMessages(prev => ({
      ...prev,
      [conversationId]: (prev[conversationId] || []).map(msg => 
        msg.senderId !== userId ? { ...msg, read: true } : msg
      )
    }));

    setConversations(prev => prev.map(conv => {
      if (conv.id !== conversationId) return conv;
      const participants = Array.isArray(conv.participants) ? conv.participants : [];
      const currentUnreadBy = conv.unreadBy ?? Object.fromEntries(participants.map((p) => [p, 0]));
      const nextUnreadBy: Record<string, number> = { ...currentUnreadBy, [String(userId)]: 0 };
      const nextUnreadCount = Object.values(nextUnreadBy).reduce((a, b) => a + b, 0);
      return { ...conv, unreadBy: nextUnreadBy, unreadCount: nextUnreadCount };
    }));
  }, []);

  // Refresh conversations from localStorage
  const refreshConversations = useCallback(() => {
    if (typeof window === "undefined") return;

    try {
      const storedConversations = localStorage.getItem(CONVERSATIONS_KEY);
      const storedMessages = localStorage.getItem(MESSAGES_KEY);

      if (storedConversations) {
        const parsed = JSON.parse(storedConversations);
        const next = Array.isArray(parsed) ? parsed.map((c) => normalizeConversation(c)) : [];
        setConversations(next);
      }
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    } catch (error) {
      console.error("Error refreshing messages:", error);
    }
  }, [normalizeConversation]);

  const contextValue = useMemo(() => ({
    conversations,
    messages,
    unreadCount,
    startConversation,
    sendMessage,
    getConversation,
    getMessages,
    markAsRead,
    refreshConversations
  }), [conversations, messages, unreadCount, startConversation, sendMessage, getConversation, getMessages, markAsRead, refreshConversations]);

  return (
    <MessageContext.Provider value={contextValue}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error("useMessages must be used within a MessageProvider");
  }
  return context;
}
