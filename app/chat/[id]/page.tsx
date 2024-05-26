'use client'
import Image from "next/image";
import ChatWithHistory from "../../components/Chat/ChatWithHistory";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const handleInvalidChatId = () => {
    router.replace('/chat/new');
  };

  return (
    <div className="pl-[56px] mt-5">
      <ChatWithHistory chatId={id} onInvalidChatId={handleInvalidChatId} />
    </div>
  );
}