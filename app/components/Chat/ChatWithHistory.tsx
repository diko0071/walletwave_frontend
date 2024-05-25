'use-client'
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/router';
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


export default function ChatWithHistory() {
    const [messages, setMessages] = useState(initialMessages);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [isLoadingCreate, setIsLoadingCreate] = useState(false);
    const [chatHistory, setChatHistory] = useState<FormattedChat[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
  
    const handleSendMessage = () => {
      if (inputValue.trim() === "") return;
  
      const newMessage = {
        id: messages.length + 1,
        sender: "ME",
        text: inputValue,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        align: "end",
      };
  
      setMessages([...messages, newMessage]);
      setInputValue("");
      setIsLoadingMessages(true);
  
      setTimeout(() => {
        const botMessage = {
          id: messages.length + 2,
          sender: "JD",
          text: "Hey man!",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          align: "start",
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
        setIsLoadingMessages(false);
      }, 5000);
    };

    useEffect(() => {
      setIsLoadingHistory(true);
      ApiService.get('/api/chat/')
        .then((response) => {
          console.log("API Response:", response);
          if (Array.isArray(response)) {
            const formattedData = response.map(chat => ({
              id: chat.id,
              chatId: chat.session_id,
              chatName: chat.session_name,
              date: new Date(chat.created_at).toLocaleDateString(),
            }));
            setChatHistory(formattedData);
          } else {
            console.error("Unexpected response format:", response);
          }
          setIsLoadingHistory(false);
        })
        .catch(error => {
          console.error("Error fetching chat history:", error);
          setIsLoadingHistory(false);
        });
    }, []);

    const createNewChat = () => {
      setIsLoadingCreate(true);
      ApiService.post_auth('/api/chat/create/', JSON.stringify({}))
        .then((response) => {
          console.log("Create Chat Response:", response);
          if (response && response.id) {
            const newUrl = `${window.location.pathname}?chatId=${response.id}`;
            window.history.pushState({ path: newUrl }, '', newUrl);
          } else {
            console.error("Unexpected response format:", response);
          }
          setIsLoadingCreate(false);
        })
        .catch(error => {
          console.error("Error creating new chat:", error);
          setIsLoadingCreate(false);
        });
    };
  
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
                          <CardTitle>New Chat</CardTitle>
                      </CardHeader>
                      <Button variant="ghost" size="icon" className="mr-5">
                      <MoreHorizontal />
                      </Button>
                      </div>
                      <CardContent>
                          <div className="flex flex-col h-full w-full">
                              <div className="flex-1 o p-4">
                                  <div className="flex flex-col gap-4">
                                      {messages.map((message) => (
                                          <div key={message.id} className={`flex flex-col ${message.align === "start" ? "items-start" : "items-end"} gap-2`}>
                                              <div className="flex items-center gap-2">
                                                  {message.align === "start" && (
                                                      <Avatar className="w-6 h-6">
                                                          <Bot />
                                                      </Avatar>
                                                  )}
                                                  <div className={`rounded-lg ${message.align === "start" ? "bg-gray-100 dark:bg-gray-800 dark:text-gray-200" : "bg-[#0F172A] text-white"} p-3 text-sm shadow-sm`}>
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
                                      ))}
                                      {isLoadingMessages && (
                                          <div className="flex flex-col items-start gap-2">
                                              <div className="flex items-center gap-2">
                                                  <Avatar className="w-6 h-6">
                                                      <Bot />
                                                  </Avatar>
                                                  <div className="rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-gray-200 p-3 text-sm shadow-sm">
                                                      <Loader className="animate-spin" />
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
                                  />
                                  <Button
                                      className="rounded-md bg-[#0F172A] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#0c1423] focus:outline-none focus:ring-2 focus:ring-[#0F172A] focus:ring-offset-2 dark:bg-[#0c1423] dark:hover:bg-[#0a1120] dark:focus:ring-[#0F172A]"
                                      onClick={handleSendMessage}
                                      disabled={isLoadingMessages}
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