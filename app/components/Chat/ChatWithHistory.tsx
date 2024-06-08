'use-client'
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import ReactMarkdown from 'react-markdown';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "sonner";
import { useState, useRef, useEffect } from "react";
import gfm from 'remark-gfm';
import remarkGfm from 'remark-gfm';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
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
  MessagesSquare,
  ExternalLink
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


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
  { id: 1, sender: "AI", text: "Hey! I'm Joey, your Personal Finance Assistant. How can I help you today?", time: "10:30 AM", align: "start" },
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
  const [chats, setChats] = useState([]);

  useEffect(() => {

    const fetchChatDetails = async () => {
      if (!chatId || chatId === 'new') {
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
        const createResponse = await ApiService.post_auth('/api/chat/create/', JSON.stringify({ human_message: inputValue }));
        if (createResponse && createResponse.id !== undefined) {
          sessionIdToUse = String(createResponse.id);
          setCurrentSessionId(sessionIdToUse);
          window.history.pushState(null, '', `/chat/${sessionIdToUse}`);
        } else {
          setIsLoadingNewMessage(false);
          return;
        }
      } else if (!sessionIdToUse) {
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
          text: `\n${response.response}\n`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          align: "start",
        };
        setMessages(prevMessages => [...prevMessages, botMessage]);
        setIsLoadingNewMessage(false);
      } else {
      }
    } catch (error) {
    } finally {
      setIsLoadingNewMessage(false);
    }
  };

  useEffect(() => {
    const fetchChatMessages = async () => {
      if (!chatId || chatId === 'new') {
        setChatExists(false);
        return;
      }

      setIsLoadingSession(true);
      try {
        const allChatsResponse = await ApiService.get('/api/chat/');
        const exists = allChatsResponse.some((chat: any) => chat.id.toString() === chatId.toString());
        if (!exists) {
          setChatExists(false);
          setIsLoadingSession(false); 
          return;
        }

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

  const [isChatListOpen, setIsChatListOpen] = useState(false);

  const [chatList, setChatList] = useState<Chat[]>([]);

  const handleOpenChatList = () => {
    ApiService.get('/api/chat/')
    .then(response => {
      if (response && Array.isArray(response)) {
        setChatList(response); 
        setIsChatListOpen(true);
      } else {
        console.error("Error fetching chat data:", response);
      }
    })
    .catch(error => {
      console.error("Error fetching chat data:", error);
    });
  };
  useEffect(() => {
    console.log("Chat List Updated:", chatList);
  }, [chatList]);
  
  const renderChatList = () => (
    <Sheet open={isChatListOpen} onOpenChange={setIsChatListOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Chats History</SheetTitle>
        </SheetHeader>
        <div className="grid gap-3 py-4 overflow-auto max-h-[150vh]"> 
          {chatList && chatList.length > 0 ? (
            chatList.map((chat) => (
              <Link className="grid w-full" href={`/chat/${chat.id}`}> 
              <Button variant='ghost' className="justify-between border" key={chat.id} onClick={() => setCurrentSessionId(chat.id.toString())}>
                {chat.session_name}
                <ExternalLink className="h-3 w-3" href={`/chat/${chat.id}`}>Open</ExternalLink>
              </Button>
              </Link>
            ))
          ) : (
            <div>No chats available.</div>
          )}
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button>Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );

  const showNotification = (action: 'edit' | 'delete', chat: Chat) => {
    if (action === 'edit') {
      setLoadingState(prevState => ({ ...prevState, edit: true }));
      toast(`${chat.session_name} chat has been successfully renamed.`, {
        action: {
          label: "Close",
          onClick: () => console.log("Notification closed"),
        },
      });
      setLoadingState(prevState => ({ ...prevState, edit: false }));
    }
    if (action === 'delete') {
      setLoadingState(prevState => ({ ...prevState, delete: true }));
      toast(`${chat.session_name} chat has been successfully deleted.`, {
        action: {
          label: "Close",
          onClick: () => console.log("Notification closed"),
        },
      });
      setLoadingState(prevState => ({ ...prevState, delete: false }));
    }
  };
  
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<Chat | null>(null);
  const [loadingState, setLoadingState] = useState({ save: false, delete: false });
  const [currentChat, setCurrentChat] = useState<Chat | undefined>();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [chatToEdit, setChatToEdit] = useState<Chat | null>(null);
  const [newSessionName, setNewSessionName] = useState('');

  useEffect(() => {
    if (currentSessionId) {
      ApiService.get(`/api/chat/${currentSessionId}`)
        .then(response => {
          console.log('Found chat:', response);
          setCurrentChat(response);
        })
        .catch(error => {
          console.error("Error fetching chat data:", error);
        });
    }
  }, [chatList, currentSessionId]);
  
  const handleDeleteChat = async (chat: Chat) => {
    try {
      await ApiService.delete(`/api/chat/${chat.id}/delete`);
      showNotification('delete', chat);
      setChatList(prevChats => prevChats.filter(c => c.id !== chat.id));
      setCurrentChat(undefined); 
      window.location.href = '/chat/new';
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  };
  
const handleDeleteClick = (chat: Chat) => {
  setChatToDelete(chat); 
  setIsAlertDialogOpen(true); 
};
  
  const confirmDeleteChat = () => {
    if (chatToDelete) {
      handleDeleteChat(chatToDelete);
      setIsAlertDialogOpen(false);
      setChatToDelete(null);
    }
  };
  
  const renderDeleteConfirmationDialog = () => (
    <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" style={{ display: "none" }}>Open</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the chat and remove it from your records.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button onClick={() => setIsAlertDialogOpen(false)}>Cancel</Button>
          <Button className="ml-2 bg-red-500 hover:bg-red-700" onClick={confirmDeleteChat}>Continue</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  const handleEditChat = async (chat: Chat, newName: string) => {
    try {
      await ApiService.put(`/api/chat/${chat.id}/update/`, JSON.stringify({ session_name: newName }));
      showNotification('edit', { ...chat, session_name: newName });
      setChatList(prevChats => prevChats.map(c => c.id === chat.id ? { ...c, session_name: newName } : c));
      setCurrentChat(current => current?.id === chat.id ? { ...current, session_name: newName } : current);
    } catch (error) {
      console.error('Failed to edit chat:', error);
    }
  };

  const handleEditClick = (chat: Chat) => {
    setChatToEdit(chat);
    setNewSessionName(chat.session_name);
    setIsEditDialogOpen(true);
  };
  
  const confirmEditChat = () => {
    if (chatToEdit && newSessionName) {
      handleEditChat(chatToEdit, newSessionName);
      setIsEditDialogOpen(false);
      setChatToEdit(null);
      window.location.reload();
    }
  };

  const tableStyles = {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginTop: '16px',
    marginBottom: '16px'
};

const cellStyles = {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left' as const
};

const headerStyles = {
  ...cellStyles,
  fontWeight: 'bold' as const,
  backgroundColor: '#f8f8f8'
};
  
  const redirectNew = () => {
    window.location.href = '/chat/new';
  };

  const renderEditConfirmationDialog = () => (
    <AlertDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" style={{ display: "none" }}>Open</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Change session name</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          <Input
            type="text"
            value={newSessionName}
            onChange={(e) => setNewSessionName(e.target.value)}
            className="w-full border rounded px-2 py-1 text-black"
          />
        </AlertDialogDescription>
        <AlertDialogFooter>
          <Button onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
          <Button className="ml-2" onClick={confirmEditChat}>Save Changes</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  const renderActionMenu = (chat: Chat) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 mr-6">
          <MoreHorizontal className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleEditClick(chat)}>
          Rename
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleDeleteClick(chat)} className="text-red-500">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );


  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-2">
      {renderChatList()}
      {renderDeleteConfirmationDialog()}
      {renderEditConfirmationDialog()}
      <div className="mx-auto grid w-full h-full">
        <div className="flex flex-col w-full h-full gap-3">
          <div className="flex justify-end gap-3">
            <Button variant='outline' size='icon' onClick={redirectNew}>
              <MessageSquarePlus />
            </Button>
            <Button variant='outline' size='icon' onClick={handleOpenChatList}>
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
              {currentChat && renderActionMenu(currentChat)}
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
                              <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ 
                                table: ({node, ...props}) => <table style={tableStyles}>{props.children}</table>, 
                              td: ({node, ...props}) => <td style={cellStyles}>{props.children}</td>, 
                              th: ({node, ...props}) => <th style={headerStyles}>{props.children}</th> }}>
                                {message.text}
                              </ReactMarkdown>
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