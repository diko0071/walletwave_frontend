'use-client'
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useState, useRef, useEffect } from "react";
import {
  Bird,
  Book,
  Code2,
  CornerDownLeft,
  LifeBuoy,
  Mic,
  Paperclip,
  Rabbit,
  Settings,
  Settings2,
  Share,
  SquareTerminal,
  SquareUser,
  Triangle,
  Turtle,
  MessageCircle,
  MessageSquareDot,
  ChevronRight,
  SquarePlus,
  ArrowRight,
  MoreHorizontal,
  MessageSquarePlus,
  MessagesSquare
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import Link from "next/link"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"


import {
    Activity,
    ArrowUpRight,
    CircleUser,
    CreditCard,
    DollarSign,
    Menu,
    Package2,
    Search,
    Users,
    Loader,
    User,
    Bot
  } from "lucide-react"

import ApiService from "@/app/services/apiService";

interface Chat {
  id: number;
  session_name: string;
  session_id: string;
  created_at: string;
}
interface FormattedChat {
  id: number;
  chatId: string;
  chatName: string;
  date: string;
}
import { Skeleton } from "@/components/ui/skeleton"

const initialMessages = [
  { id: 1, sender: "AI", text: "Hey! I'm your Personal Finace AI. How can I help you today?", time: "10:30 AM", align: "start" },
];

interface ChatWithHistoryProps {
  chatId: string | string[] | undefined;
  onInvalidChatId: () => void;
}

export default function ChatWithHistory({ chatId, onInvalidChatId }: ChatWithHistoryProps) {
  const [chatExists, setChatExists] = useState<boolean>(true);
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [chatTitle, setChatTitle] = useState('New Chat');
  const [isLoadingSession, setIsLoadingSession] = useState(false); 
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoadingNewMessage, setIsLoadingNewMessage] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>(chatId && chatId !== 'new' ? String(chatId) : undefined);

  useEffect(() => {
    console.log('useEffect - fetchChatDetails: chatId =', chatId);

    const fetchChatDetails = async () => {
      if (!chatId || chatId === 'new') {
        console.log('ChatId is new or undefined, setting chatExists to false');
        setChatExists(false);
        return;
      }

      try {
        console.log('Fetching all chats');
        const allChatsResponse = await ApiService.get('/api/chat/');
        const exists = allChatsResponse.some((chat: any) => chat.id.toString() === chatId.toString());
        console.log('Chat exists:', exists);
        if (!exists) {
          setChatExists(false);
          return;
        }

        console.log('Fetching chat details for chatId:', chatId);
        const chatResponse = await ApiService.get(`/api/chat/${chatId}`);
        if (chatResponse) {
          setChatExists(true);
          setChatTitle(chatResponse.session_name);
          setCurrentSessionId(chatId.toString());
          console.log('Chat exists, session name:', chatResponse.session_name);
        } else {
          setChatExists(false);
        }
      } catch (error) {
        console.error("Error fetching chat data:", error);
        setChatExists(false);
      }
    };

    fetchChatDetails();
  }, [chatId]);

  useEffect(() => {
    if (!chatExists && chatId !== 'new' && chatId !== undefined) {
      console.log('Invalid chatId, calling onInvalidChatId');
      onInvalidChatId();
    }
  }, [chatExists, chatId, onInvalidChatId]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") {
      console.error("Input value is required.");
      return;
    }

    const userMessage = {
      id: Date.now(),
      sender: "ME",
      text: inputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      align: "end",
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue("");

    setIsLoadingNewMessage(true);

    try {
      let sessionIdToUse = currentSessionId;
      console.log('handleSendMessage - currentSessionId:', currentSessionId);

      if (chatId === 'new' && !currentSessionId) {
        console.log('Creating a new chat session');
        const createResponse = await ApiService.post_auth('/api/chat/create/', JSON.stringify({ human_message: inputValue }));
        if (createResponse && createResponse.id !== undefined) {
          sessionIdToUse = String(createResponse.id);
          setCurrentSessionId(sessionIdToUse);
          window.history.pushState(null, '', `/chat/${sessionIdToUse}`);
          console.log('New chat created with sessionId:', sessionIdToUse);
        } else {
          console.error("Unexpected response format:", createResponse);
          setIsLoadingNewMessage(false);
          return;
        }
      } else if (!sessionIdToUse) {
        console.error("Session ID is undefined after checking chatId.");
        setIsLoadingNewMessage(false);
        return;
      }

      const messageData = {
        session: sessionIdToUse,
        human_message: inputValue,
      };

      const response = await ApiService.post_auth(`/api/chat/${sessionIdToUse}/answer/`, JSON.stringify(messageData));
      if (response && response.response) {
        const botMessage = {
          id: Date.now() + 1,
          sender: "AI",
          text: response.response,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          align: "start",
        };
        setMessages(prevMessages => [...prevMessages, botMessage]);
        setIsLoadingNewMessage(false);
      } else {
        console.error("No response from server");
      }
    } catch (error) {
      console.error("Error sending message to API:", error);
    } finally {
      setIsLoadingNewMessage(false);
    }
  };

  useEffect(() => {
    console.log('useEffect - fetchChatMessages: chatId =', chatId);

    const fetchChatMessages = async () => {
      if (!chatId || chatId === 'new') {
        console.log('ChatId is new or undefined, setting chatExists to false');
        setChatExists(false);
        return;
      }

      setIsLoadingSession(true);
      try {
        console.log('Fetching all chats');
        const allChatsResponse = await ApiService.get('/api/chat/');
        const exists = allChatsResponse.some((chat: any) => chat.id.toString() === chatId.toString());
        console.log('Chat exists:', exists);
        if (!exists) {
          setChatExists(false);
          setIsLoadingSession(false); 
          return;
        }

        console.log('Fetching chat messages for chatId:', chatId);
        const chatResponse = await ApiService.get(`/api/chat/${chatId}`);
        if (chatResponse) {
          setChatExists(true);
          setChatTitle(chatResponse.session_name);
          setCurrentSessionId(chatId.toString());
          const formattedMessages = chatResponse.previous_messages.map((msg: any) => ({
            id: Date.now() + Math.random(),
            sender: msg.type === 'human' ? 'ME' : 'AI',
            text: msg.message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            align: msg.type === 'human' ? 'end' : 'start'
          }));
          setMessages(formattedMessages);
        } else {
          setChatExists(false);
        }
      } catch (error) {
        console.error("Error fetching chat data:", error);
        setChatExists(false);
      } finally {
        setIsLoadingSession(false); 
      }
    };

    fetchChatMessages();
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-2">
      <div className="mx-auto grid w-full max-w-6xl">
        <div className="flex flex-col w-full h-full gap-3">
          <div className="flex justify-end gap-3">
            <Button variant='outline' size='icon'>
              <MessageSquarePlus />
            </Button>
            <Button variant='outline' size='icon'>
              <MessagesSquare />
            </Button>
          </div>
          <div className="flex-1 h-full">
            <Card>
              <div className="flex items-center justify-between">
              <CardHeader>
                {isLoadingSession ? (
                  <Skeleton className="rounded-md bg-gray-100 dark:bg-gray-800 dark:text-gray-200 p-3 text-sm shadow-sm w-32 h-6" />
                ) : (
                  <CardTitle>{chatTitle}</CardTitle>
                )}
              </CardHeader>
                <Button variant="ghost" size="icon" className="mr-5">
                  <MoreHorizontal />
                </Button>
              </div>
              <CardContent>
                <div className="flex flex-col h-full w-full">
                  <div className="flex-1 o p-4">
                  <div className="flex flex-col gap-4">
                      {isLoadingSession ? (
                        <>
                          <div className="flex flex-col items-start gap-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <Bot />
                              </Avatar>
                              <Skeleton className="rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-gray-200 p-3 text-sm shadow-sm h-[30px] w-[250px]" />
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-2">
                              <Skeleton className="rounded-lg bg-[#0F172A] text-white p-3 text-sm shadow-sm h-[30px] w-[200px]" />
                              <Avatar className="w-6 h-6">
                                <User />
                              </Avatar>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                          </div>
                          <div className="flex flex-col items-start gap-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <Bot />
                              </Avatar>
                              <Skeleton className="rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-gray-200 p-3 text-sm shadow-sm h-[30px] w-[250px]" />
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                          </div>
                        </>
                      ) : (
                        messages.map((message, index) => (
                          <div key={message.id} className={`flex flex-col ${message.align === "start" ? "items-start" : "items-end"} gap-2`}>
                            <div className="flex items-center gap-2">
                              {message.align === "start" && (
                                <Avatar className="w-6 h-6">
                                  <Bot />
                                </Avatar>
                              )}
                              <div className={`rounded-lg ${message.align === "end" ? "bg-[#0F172A] text-white" : "bg-gray-100 dark:bg-gray-800 dark:text-gray-200"} p-3 text-sm shadow-sm`}>
                                <p>{message.text}</p>
                              </div>
                              {message.align === "end" && (
                                <Avatar className="w-6 h-6">
                                  <User />
                                </Avatar>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{message.time}</div>
                          </div>
                        ))
                      )}
                      {isLoadingNewMessage && (
                        <div className="flex flex-col items-start gap-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <Bot />
                            </Avatar>
                            <div className="rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-gray-200 p-3 text-sm shadow-sm">
                              <Loader className="animate-spin h-5 w-5 text-gray-600" />
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>
                              <div className="sticky bottom-0 flex items-center gap-2 border-t border-gray-200 p-4 dark:border-gray-700 bg-white dark:bg-gray-800">
                                  <Input
                                      className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-[#0F172A] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                      placeholder="Type your message..."
                                      type="text"
                                      value={inputValue}
                                      onChange={(e) => setInputValue(e.target.value)}
                                      disabled={isLoadingNewMessage}
                                  />
                                  <Button
                                      className="rounded-md bg-[#0F172A] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#0c1423] focus:outline-none focus:ring-2 focus:ring-[#0F172A] focus:ring-offset-2 dark:bg-[#0c1423] dark:hover:bg-[#0a1120] dark:focus:ring-[#0F172A]"
                                      onClick={handleSendMessage}
                                      disabled={isLoadingNewMessage}
                                  >
                                      Send
                                  </Button>
                              </div>
                          </div>
                      </CardContent>
                  </Card>
                </div>
                  </div>
              </div>
      </main>
  );
  
}