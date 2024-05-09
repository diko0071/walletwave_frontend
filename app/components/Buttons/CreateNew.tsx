import React from 'react';
import Image from 'next/image';
import createNewIcon from '../../../public/CreateNew.svg';

interface CreateNewButtonProps {
  label: string;
}

const CreateNewButton: React.FC<CreateNewButtonProps> = ({ label }) => {
  return (
    <button className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input hover:text-accent-foreground py-2 h-10 justify-start bg-zinc-50 pl-2 pr-4 shadow-none transition-colors hover:bg-zinc-200/40">
      <div className="flex items-center justify-center w-4 h-4"> {/* Управление размером и выравниванием иконки */}
        <Image src={createNewIcon} alt="Create new" width={12} height={12} layout="fixed" />
      </div>
      <span className="ml-3">{label}</span>
    </button>
  );
};
export default CreateNewButton;