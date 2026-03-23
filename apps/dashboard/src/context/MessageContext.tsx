"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from "react";

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
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const storedConversations = localStorage.getItem(CONVERSATIONS_KEY);
      const storedMessages = localStorage.getItem(MESSAGES_KEY);

      if (storedConversations) {
        setConversations(JSON.parse(storedConversations));
      }
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    } catch (error) {
      console.error("Error loading messages from localStorage:", error);
    }
    setIsLoaded(true);
  }, []);

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
    return conversations.reduce((total, conv) => total + conv.unreadCount, 0);
  }, [conversations]);

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
      unreadCount: 0
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
        return {
          ...conv,
          lastMessage: content,
          lastMessageTime: Date.now(),
          unreadCount: conv.unreadCount + 1
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

    setConversations(prev => prev.map(conv => 
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
    ));
  }, []);

  // Refresh conversations from localStorage
  const refreshConversations = useCallback(() => {
    if (typeof window === "undefined") return;

    try {
      const storedConversations = localStorage.getItem(CONVERSATIONS_KEY);
      const storedMessages = localStorage.getItem(MESSAGES_KEY);

      if (storedConversations) {
        setConversations(JSON.parse(storedConversations));
      }
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    } catch (error) {
      console.error("Error refreshing messages:", error);
    }
  }, []);

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
