/**
 * v0 by Vercel.
 * @see https://v0.dev/t/6AiHRjrUkxY
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import React, { useState } from 'react'; // Импортируем useState
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Component() {
  const [isAIMode, setIsAIMode] = useState(false);

  // Явно указываем тип события для обработчика и добавляем логирование
  const toggleMode = () => {
    setIsAIMode(prevMode => !prevMode); // Используйте функциональное обновление состояния
    console.log("Переключение режима после изменения: ", !isAIMode); // Логируем ожидаемое новое состояние
  };

  console.log("Текущий режим AI: ", isAIMode); // Логируем текущее состояние при каждом рендере

  return (
    <div className="bg-[#1e1e1e] p-4 rounded-lg flex flex-col items-center justify-between text-white">
      <div className="flex items-center justify-between w-full">
        <Input
          className="bg-transparent border-none placeholder-gray-400 flex-1"
          placeholder="A landing page for my design portfolio"
        />
        <Button className="text-gray-400 ml-2" variant="ghost">
          <ArrowUpIcon className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}

function ArrowUpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </svg>
  )
}


function GlobeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}