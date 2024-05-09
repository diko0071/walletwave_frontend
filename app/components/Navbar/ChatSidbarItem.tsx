import React from 'react';
import Image from 'next/image';
import ChatIcon from '../../../public/Chat.svg'; // Adjust the path as necessary

interface ChatSidebarItemProps {
  label: string;
}

const ChatSidebarItem: React.FC<ChatSidebarItemProps> = ({ label }) => {
  return (
    <div className="flex items-center text-sm cursor-pointer p-2 hover:bg-gray-200">
        <div className="mr-2">
            <Image src={ChatIcon} alt="Chat" width={11} height={11} />
        </div>
      <span>{label}</span>
    </div>
  );
};

export default ChatSidebarItem;

