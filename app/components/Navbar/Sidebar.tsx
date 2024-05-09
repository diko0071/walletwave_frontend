"use client";
import React from 'react';
import CreateNewButton from '../Buttons/CreateNew';
import ChatNavItem from './ChatSidbarItem';
import { PlusIcon } from '@radix-ui/react-icons'
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen?: boolean; // Добавляем пропс для управления видимостью
}

const Sidebar = ({isOpen}: SidebarProps) => {
    return (
      <nav className={"peer absolute inset-y-0 z-30 border-r bg-muted duration-300 ease-in-out flex flex-col pl-2 pt-5 mt-[60px] w-[250px]  ${isOpen ? 'block' : 'hidden'}"}>
        <h1 className="text-xl font-semibold mb-4">Chat History</h1>
        <CreateNewButton label="New Chat" />
        <ChatNavItem label="Recent Chats" />
        <ChatNavItem label="Archived Chats" />
      </nav>
    );
};

export default Sidebar;