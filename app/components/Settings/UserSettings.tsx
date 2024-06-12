'use client';
import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import Link from "next/link";
import { CircleUser, CircleHelp, Menu, Package2, Search } from "lucide-react";

import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select, SelectGroup, SelectLabel } from "@/components/ui/select";
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table";
import { ReloadIcon } from "@radix-ui/react-icons"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import ApiService from "@/app/services/apiService"; 
import { toast } from "sonner";

export default function UserSettings() {
  const [userData, setUserData] = useState({ name: '', email: '', openai_key: '', telegram_user_id: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCredentials, setIsLoadingCredentials] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [telegramID, setTelegramID] = useState('');
  const [isLoadingTelegramID, setIsLoadingTelegramID] = useState(false);


  useEffect(() => {
    ApiService.get('/api/auth/user/data')
      .then(data => {
        setUserData({ 
          name: data.name || '', 
          email: data.email || '', 
          openai_key: data.openai_key || '', 
          telegram_user_id: data.telegram_user_id || ''
        });
      })
      .catch(error => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  const handleSaveUserSettings = () => {
    setIsLoading(true); 
    const payload = { 
      name: userData.name,
      email: userData.email,
    };
    ApiService.put('/api/auth/user/data/update/', JSON.stringify(payload))
      .then(() => {
        console.log("User data updated successfully");
        toast(`${userData.name}'s data has been updated successfully.`, {
          action: {
            label: "Close",
            onClick: () => console.log("Notification closed"),
          },
        });
      })
      .catch(error => {
        console.error("Error updating user data:", error);
        console.log("Server response:", error.response);
      })
      .finally(() => {
        setIsLoading(false); 
      });
  };
  
  const handleSaveAPIKey = () => {
    setIsLoadingCredentials(true); 
    const payload = { 
      openai_key: userData.openai_key,
      telegram_user_id: userData.telegram_user_id,
      email: userData.email,
      name: userData.name,
    };
    ApiService.put('/api/auth/user/data/update/', JSON.stringify(payload))
      .then(() => {
        console.log("Credentials updated successfully");
        toast(`Credentials have been updated successfully.`, {
          action: {
            label: "Close",
            onClick: () => console.log("Notification closed"),
          },
        });
      })
      .catch(error => {
        console.error("Error updating credentials:", error);
        console.log("Server response:", error.response);
      })
      .finally(() => {
        setIsLoadingCredentials(false); 
      });
  };


  return (
    <div className="grid gap-10">
      <Card x-chunk="user-settings-chunk-1">
        <CardHeader>
          <CardTitle>User Settings</CardTitle>
          <CardDescription>
            Update your basic information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4">
            <Input
              placeholder="Name" 
              value={userData.name} 
              onChange={(e) => setUserData({ ...userData, name: e.target.value })} 
            />
            <Input disabled
              placeholder="Email" 
              value={userData.email} 
            />
          </form>
          <div className="flex justify-between mt-4">
            <Button onClick={handleSaveUserSettings}>
              {isLoading ? <ReloadIcon className="w-4 h-4 animate-spin"/> : 'Save'}
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card x-chunk="user-settings-chunk-2">
    <CardHeader>
    <CardTitle className='mb-2'>Credentials</CardTitle>
    <div className="flex items-center mt-5">
      <CardTitle className="text-lg">OpenAI API Key</CardTitle>
      <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="ml-1.5">
              <CircleHelp className="w-3 h-3"/>
            </TooltipTrigger>
            <TooltipContent>
  <p>To find OpenAI API Key, please <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-500">follow the link</a>.</p>
</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
    <CardDescription>
    Add valid OpenAI API key to use the AI features: Chat and AI Transaction Writer.
    </CardDescription>
  </CardHeader>
  <CardContent>
    <form className="flex flex-col gap-4">
      <div className="relative">
        <Input
          type={showKey ? "text" : "password"}
          placeholder="sk-..." 
          value={userData.openai_key} 
          onChange={(e) => setUserData({ ...userData, openai_key: e.target.value })} 
        />
        <Button 
          onClick={(e) => {e.preventDefault(); setShowKey(!showKey);}}
          className="w-7 h-7 absolute right-10 top-1/2 transform -translate-y-1/2 text-[10px] mr-2"
          variant="outline"
        >
          {showKey ? 'Hide' : 'Show'}
        </Button>
        <Button 
          onClick={(e) => {
            e.preventDefault(); 
            navigator.clipboard.writeText(userData.openai_key);
            toast("Copied to clipboard", {
              action: {
                label: "Close",
                onClick: () => console.log("Notification closed"),
              },
            });
          }}
          className="w-7 h-7 absolute right-0 top-1/2 transform -translate-y-1/2 text-[10px] ml-2 mr-2"
          variant="outline"
        >
          Copy
        </Button>
      </div>
    </form>
    <div className="flex justify-between">
  </div>
  <div className="flex items-center mt-5">
  <CardTitle className="text-lg">Telegram User ID</CardTitle>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger className="ml-1.5">
        <CircleHelp className="w-3 h-3"/>
      </TooltipTrigger>
      <TooltipContent>
  <p>You can find your Telegram User ID by asking the <a href="https://t.me/myidbot" target="_blank" rel="noopener noreferrer" className="text-blue-500">@myidbot</a> in Telegram.</p>
</TooltipContent>
    </Tooltip>
  </TooltipProvider>
</div>
<CardDescription className='mt-1.5'>
  Add your Telegram User ID to record transactions from Telegram.
</CardDescription>
<form className="flex flex-col gap-4 mt-6">
  <div className="relative">
    <Input
      placeholder="3345..." 
      value={userData.telegram_user_id} 
      onChange={(e) => setUserData({ ...userData, telegram_user_id: e.target.value })} 
    />
  </div>
</form>
<div className="flex justify-between mt-4">
      <Button onClick={handleSaveAPIKey}>
        {isLoadingCredentials ? <ReloadIcon className="w-4 h-4 animate-spin"/> : 'Save'}
      </Button>
    </div>
</CardContent>
</Card>
</div>
);
}