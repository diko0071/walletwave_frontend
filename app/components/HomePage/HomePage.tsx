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
import { Badge } from "@/components/ui/badge"

import React, { useState } from 'react';
import { LoaderIcon, Sparkles } from "lucide-react";
import { ReloadIcon } from "@radix-ui/react-icons"
import { toast } from "sonner";
import ApiService from "@/app/services/apiService";

import { RocketIcon } from "@radix-ui/react-icons"
 
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

interface Transaction {
  description: string;
  amount: number;
  category: string;
  transaction_currency: string;
}

export type TransactionStat = {
  today_sum: number,
  yesterday_sum: number,
  daily_change: number,
  daily_change_absolute: number,

}

function processApiData(apiResponse: any): TransactionStat {
  return {
    today_sum: apiResponse.today_sum,
    yesterday_sum: apiResponse.yesterday_sum,
    daily_change: Math.abs(apiResponse.daily_change),
    daily_change_absolute: Math.abs(apiResponse.daily_change_absolute),
  };
}

export default function HomePage() {

  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  const fetchTransactionData = () => {
    if (inputValue.trim() === '') {
      console.error("Text input is required");
      return;
    }

    setButtonLoading(true);
    ApiService.post_auth('/api/transactions/create/ai/', JSON.stringify({ text: inputValue }))
      .then(data => {
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
        setButtonLoading(false);
      });
  };

  const [data, setData] = useState<TransactionStat | null>(null);

  React.useEffect(() => {
    setLoading(true);
    ApiService.get('/api/transactions/stats/').then(jsonData => {
      const transactions = processApiData(jsonData);
      setData(transactions);
      setLoading(false);
    }).catch(error => {
      console.error('Failed to fetch transactions:', error);
      setLoading(false);
    });
  }, []);

  function formatComparisonMessage(data: TransactionStat | null) {
    if (!data) return null;
  
    const todaySumColor = data.today_sum > data.yesterday_sum ? "text-red-500" : "text-green-500";
    const comparisonText = data.today_sum > data.yesterday_sum ? "more" : "less";
  
    return (
      <span>
        You spent today <span className={todaySumColor}>${data.today_sum}</span> that is {comparisonText} on {data.daily_change}% (${data.daily_change_absolute}) than you did on yesterday.
      </span>
    );
  }
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold text-center mb-3">Write your spendings, AI will add them.</h1>
      <div className="max-w-3xl mx-auto space-y-2">
        <div className="flex justify-center p-3">
          <Badge variant="outline" className="text-center font-normal">
          {formatComparisonMessage(data)}
          </Badge>
        </div> 
        <div className="p-4 border rounded-md space-y-2">
          <div className="flex items-center justify-between space-x-4">
            <input
              className="flex-grow bg-transparent border-none placeholder-gray-500 text-xs py-2"
              placeholder="Add your transactions..."
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Button onClick={fetchTransactionData} className="px-4" disabled={buttonLoading}>
              {buttonLoading ? <ReloadIcon className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            </Button>
          </div>
        </div>
        <div className="max-w-xl mx-auto mt-6 space-y-2 text-xs text-gray-600">
        </div>
      </div>
    </main>
  );
}