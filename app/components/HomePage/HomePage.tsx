'use client';
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import React, { useState } from 'react';
import { LoaderIcon, Sparkles } from "lucide-react";
import { ReloadIcon } from "@radix-ui/react-icons"
import { toast } from "sonner";
import ApiService from "@/app/services/apiService";

interface Transaction {
  description: string;
  amount: number;
  category: string;
  transaction_currency: string;
}

export default function HomePage() {

  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTransactionData = () => {
    if (inputValue.trim() === '') {
      console.error("Text input is required");
      return;
    }

    setLoading(true);
    ApiService.post_auth('/api/transactions/create/ai/', JSON.stringify({ text: inputValue }))
      .then(data => {
        // Assuming data is an array of transactions
        data.forEach((tx: Transaction) => {
          toast("Transaction has been created.", {
            description: `Name: ${tx.description}, Amount: ${tx.amount}, Category: ${tx.category}, Currency: ${tx.transaction_currency}`,
            action: {
              label: "Close",
              onClick: () => console.log("Notification closed"),
            },
          });
        });
        setInputValue('');
      })
      .catch(error => {
        console.error('Failed to fetch transaction:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };


  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold text-center mb-8">Write your spendings, AI will add them.</h1>
      <div className="max-w-3xl mx-auto p-4 border rounded-md space-y-2">
        <div className="flex items-center justify-between space-x-4">
          <input
            className="flex-grow bg-transparent border-none placeholder-gray-500 text-sm py-2"
            placeholder="Add your transactions..."
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        <Button onClick={fetchTransactionData} className="px-4" disabled={loading}>
            {loading ? <ReloadIcon className="w-4 h-4 animate-spin"/> : <Sparkles className="w-4 h-4"/>}
          </Button>
        </div>
      </div>
      <div className="max-w-xl mx-auto mt-6 space-y-2 text-sm text-gray-600">
      </div>
    </main>
  )
}