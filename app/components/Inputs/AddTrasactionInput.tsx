import React, { useState } from 'react';
import SendPrompt from '../Buttons/SendPrompt'; // Убедитесь, что путь корректен

const AddTransactionInput = () => {
  const [transaction, setTransaction] = useState('');

  const handleSubmit = () => {
    console.log(transaction);
    setTransaction('');
  };

  return (
    <div className="relative flex items-center w-full">
      <input
        type="text"
        value={transaction}
        onChange={(e) => setTransaction(e.target.value)}
        className="w-full pl-4 pr-12 py-[1.3rem] bg-transparent focus:outline-none text-sm border border-gray-300 rounded-md"
        placeholder="Add new transactions here..."
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
        <SendPrompt onClick={handleSubmit}>
          Send
        </SendPrompt>
      </div>
    </div>
  );
};

export default AddTransactionInput;