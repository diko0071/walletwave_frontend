import React, { useState } from 'react';
import Image from 'next/image';
import closeIconPath from '../../../public/Close.svg';
import InputNew from '../Inputs/InputNew';
import AddTransactionManual from '../Forms/AddTransactionManual';
import { Switch } from "@/components/ui/switch";

interface PopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const PopupModal = ({ isOpen, onClose, children }: PopupModalProps) => {
  const [isManual, setIsManual] = useState(false);

  if (!isOpen) return null;

  const handleSwitchChange = (newState: boolean) => {
    setIsManual(newState);
  };

  return (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-100">
    <div className="bg-white rounded-lg relative p-10" style={{ width: '70%' }}>
        <button onClick={onClose} className="absolute top-2 right-2">
          <Image src={closeIconPath} alt="Close" width={13} height={13} />
        </button>
        <h1 className="text-2xl font-semibold text-center mb-2">Let AI write transactions for you.</h1>
        <p className="text-sm text-center mb-4">Just write how much did you spend, the things and currency (by default it will use your main).</p>
        <div className="flex justify-center items-center mb-4">
          <div className="mr-2">AI</div>
          <Switch checked={isManual} onCheckedChange={handleSwitchChange} />
          <div className="ml-2">Manual</div>
        </div>
        {isManual ? <AddTransactionManual /> : <InputNew />}
        {children}
      </div>
    </div>
  );
};

export default PopupModal;