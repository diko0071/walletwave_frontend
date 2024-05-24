'use-client'
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useRef, useEffect } from "react";

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
  

const initialMessages = [
  { id: 1, sender: "JD", text: "Hey there! How's it going?", time: "10:30 AM", align: "start" },
  { id: 2, sender: "ME", text: "Pretty good, thanks for asking!", time: "10:31 AM", align: "end" },
  { id: 3, sender: "JD", text: "That's great to hear! Do you have any plans for the weekend?", time: "10:32 AM", align: "start" },
  { id: 4, sender: "ME", text: "I'm thinking of going for a hike, maybe check out a new trail.", time: "10:33 AM", align: "end" },
  { id: 5, sender: "JD", text: "That sounds like a great idea! I'd love to join if you don't mind the company.", time: "10:34 AM", align: "start" },
  { id: 6, sender: "ME", text: "Absolutely, the more the merrier! I'll send you the details later.", time: "10:35 AM", align: "end" },
];

export default function Component() {
    const [messages, setMessages] = useState(initialMessages);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
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
      setIsLoading(true);
  
      setTimeout(() => {
        const botMessage = {
          id: messages.length + 2,
          sender: "JD",
          text: "Hey man!",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          align: "start",
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
        setIsLoading(false);
      }, 5000);
    };
  
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex h-full w-full flex-col bg-white">
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex flex-col gap-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex flex-col items-${message.align} gap-2`}>
                  <div className="flex items-center gap-2">
                    {message.align === "start" && (
                      <Avatar className="w-6 h-6">
                        <Bot/>
                      </Avatar>
                    )}
                    <div className={`rounded-lg ${message.align === "start" ? "bg-gray-100 dark:bg-gray-800 dark:text-gray-200" : "bg-[#0F172A] text-white"} p-3 text-sm shadow-sm`}>
                      <p>{message.text}</p>
                    </div>
                    {message.align === "end" && (
                      <Avatar className="w-6 h-6">
                        <User/>
                      </Avatar>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{message.time}</div>
                </div>
              ))}
              {isLoading && (
                <div className="flex flex-col items-start gap-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                        <Bot/>
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
        >
          Send
        </Button>
      </div>
    </div>
  );
}