import React from 'react';
import Image from 'next/image'; // Import the Image component from Next.js

interface SendPromptProps {
  onClick: () => void;
  disabled?: boolean;
  children?: React.ReactNode; // Made children optional if you're planning to use only the icon
}

const SendPrompt: React.FC<SendPromptProps> = ({ onClick, disabled = false, children }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-12 w-12 border border-gray-300" // Добавлены классы для бордера
    >
      {/* Assuming the icon is used without text. If you want text, include {children} as well */}
      <Image src="/Submit.svg" alt="Submit" width={14} height={14} />
    </button>
  );
};

export default SendPrompt;