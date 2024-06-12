'use client';
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion, useAnimation } from 'framer-motion';

import React, { useState } from 'react';
import { LoaderIcon, Sparkles } from "lucide-react";
import { ReloadIcon } from "@radix-ui/react-icons"
import { toast } from "sonner";
import ApiService from "@/app/services/apiService";

import { RocketIcon } from "@radix-ui/react-icons"
import { keyframes } from '@emotion/react';
import { css } from '@emotion/react';
 
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
  transaction_date: string;
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
    daily_change: parseFloat(Math.abs(apiResponse.daily_change).toFixed(2)),
    daily_change_absolute: parseFloat(Math.abs(apiResponse.daily_change_absolute).toFixed(2)),
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
        if (data.error) {
          if (data.error === "No API key provided. Please provide a valid OpenAI API key.") {
            toast.error(data.error);
          }
        } else {
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
        }
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
        You spent today <span className={todaySumColor}>${data.today_sum}</span> that is {comparisonText} on {data.daily_change}% (${data.daily_change_absolute}) than you did on yesterday
      </span>
    );
  }
  const Coin = () => {
    const controls = useAnimation();
    const initialY = 0; // начальное положение по оси Y
    const endY = 100 + Math.random() * 550; // случайное конечное положение по оси Y
    const deviation = window.innerWidth * 0.25;
    const initialX = (window.innerWidth / 2) - deviation + Math.random() * (2 * deviation); // случайное начальное положение по оси X
    const endX = initialX + Math.random() * 200 - 100; // случайное конечное положение по оси X

    const coinImages = ['/coin.svg', '/dollar-16.png', '/golden_bar.png']; // массив с именами файлов изображений
    const randomImage = coinImages[Math.floor(Math.random() * coinImages.length)]; // выбираем случайное изображение

    React.useEffect(() => {
      controls.start({
        y: [initialY, endY],
        x: [initialX, endX],
        rotate: [0, 360],
        transition: { duration: 2 },
      });
    }, [controls]);
  
    return (
      <motion.img 
        src={randomImage} // используем случайное изображение
        animate={controls}
        initial={{ y: initialY, x: initialX, rotate: 0 }}
        style={{ width: '25px', height: '25px', position: 'absolute', top: 0 }} // Установите позицию монеты здесь
      />
    );
  }
  
  const [coins, setCoins] = useState<Array<JSX.Element>>([]);
  
  const startCoinAnimation = () => {
    setCoins(prevCoins => [...prevCoins, <Coin key={prevCoins.length} />]);
  }

  const gradientAnimation = keyframes`
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
`;

  const controls = useAnimation();

  const startShakeAnimation = () => {
    controls.start({
      rotate: [0, -5, 0, 5, 0],
      transition: { duration: 0.5, loop: Infinity },
    });
  };

  const stopShakeAnimation = () => {
    controls.stop();
  };

  const [isShaking, setIsShaking] = useState(false);

  const shakeControls = useAnimation();


  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold text-center mb-3">
        Write your{" "}
        <motion.span 
  animate={shakeControls}
  onClick={() => {
    shakeControls.start({
      rotate: [0, -5, 0, 5, 0],
      transition: { duration: 0.5, loop: Infinity },
    });
    setTimeout(() => shakeControls.stop(), 500);
    startCoinAnimation();
  }}
  style={{ 
    cursor: 'pointer', 
    display: 'inline-block',
    background: 'linear-gradient(270deg, #000022, #000066, #000022)',
    backgroundSize: '200% 200%',
    color: 'transparent',
    WebkitBackgroundClip: 'text',
    animation: `${gradientAnimation} 6s ease infinite`
  }} 
>
  spendings
</motion.span>
        , AI will sort them out.
      </h1>
      {coins}
      <div className="max-w-3xl mx-auto space-y-2">
        <div className="flex justify-center p-3">
          <Badge variant="outline" className="text-center font-normal">
          {formatComparisonMessage(data)}
          </Badge>
        </div> 
        <div className="p-4 border rounded-md space-y-2">
          <div className="flex items-center justify-between space-x-4">
            <Input
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