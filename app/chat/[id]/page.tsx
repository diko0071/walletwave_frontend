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
    <div className="pl-[76px] sm:pl-[57px] md:pl-[80px] lg:pl-[80px] xl:pl-[52px] 2xl:pl-[56px] mt-5 pr-[16px] sm:pr-[0px] md:pr-[30px] lg:pr-[30px] xl:pr-[0px] 2xl:pr-[0px]">
      <ChatWithHistory chatId={id} onInvalidChatId={handleInvalidChatId} />
    </div>
  );
}