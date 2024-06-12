'use client'
import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

import { Pickaxe, Sparkles } from "lucide-react";
import { ReloadIcon } from "@radix-ui/react-icons"

import ApiService from "@/app/services/apiService";

import { toast } from "sonner";

export type GetTransactionsNew = {
  amount: string;
  category: string;
  description: string;
  id: number;
  transaction_currency: string;
  transaction_date: string;
}

function processApiData(apiResponse: any[]): GetTransactionsNew[] {
  return apiResponse.map(tx => ({
    amount: tx.amount,
    category: tx.category,
    description: tx.description,
    id: tx.id,
    transaction_currency: tx.transaction_currency,
    transaction_date: tx.transaction_date,
  }));
}
  
export default function Header() {
  
    const [inputValue, setInputValue] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [currency, setCurrency] = useState('');
    const [loadingState, setLoadingState] = useState({ firstButton: false, secondButton: false });
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<GetTransactionsNew | null>(null);


    function processApiData(apiResponse: any): GetTransactionsNew[] {
      return apiResponse.map((tx: any) => ({
        amount: tx.amount,
        category: tx.category,
        currency: tx.currency,
        description: tx.description,
        transaction_date: tx.transaction_date,
      }));
    }

    const fetchTransactionData = () => {
      if (inputValue.trim() === '') {
        console.error("Text input is required");
        return; 
      }
    
      setLoadingState(prevState => ({ ...prevState, firstButton: true }));
      setLoading(true);
      ApiService.post_auth('/api/transactions/create/ai/', JSON.stringify({ text: inputValue }))
        .then(data => {
          if (data.error) {
            if (data.error === "No API key provided. Please provide a valid OpenAI API key.") {
              toast.error(data.error);
            }
          } else {
            const processedTransactions = data.map((tx: GetTransactionsNew) => ({
              description: tx.description, 
              amount: tx.amount,
              category: tx.category,
              currency: tx.transaction_currency,
              transaction_date: tx.transaction_date,
            }));
    
            showNotification('firstButton', processedTransactions.map((tx: GetTransactionsNew) => ({
              description: tx.description, 
              amount: tx.amount,
              category: tx.category,
              currency: tx.transaction_currency,
              transaction_date: tx.transaction_date,
            })));
          }
          setLoading(false);
          setLoadingState(prevState => ({ ...prevState, firstButton: false }));
        })
        .catch(error => {
          console.error('Failed to fetch transaction:', error);
          setLoading(false);
        });
    };

    const fetchTransactionDataWithDetails = () => {
      if (inputValue.trim() === '' || category.trim() === '' || amount.trim() === '' || currency.trim() === '') {
        console.error("All fields are required");
        return;
      }
    
      const requestBody = {
        description: inputValue,
        category: category,
        amount: amount,
        transaction_currency: currency,
      };
      console.log("Sending request with currency:", currency);
      console.log("Request body:", requestBody);
    
      setLoadingState(prevState => ({ ...prevState, secondButton: true }));
      setLoading(true);
      ApiService.post_auth('/api/transactions/create/', JSON.stringify(requestBody))
        .then(response => {

          const responseData = Array.isArray(response) ? response : [response];
    
          const processedTransactions = responseData.map(tx => ({
            description: tx.description,
            amount: tx.amount,
            category: tx.category,
            currency: tx.transaction_currency,
            transaction_date: tx.transaction_date,
          }));
    
          showNotification('secondButton', processedTransactions);
        })
        .catch(error => {
          console.error('Failed to fetch transaction with details:', error);
        })
        .finally(() => {
          setLoading(false);
          setLoadingState(prevState => ({ ...prevState, secondButton: false }));
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setAmount(e.target.value);
    };

    const handleCategoryChange = (value: string) => {
        setCategory(value);
      };

    const handleCurrencyChange = (value: string) => {
        console.log("Selected currency:", value);
        setCurrency(value);
      };

      const handleFocus = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = event.target.value;
        event.target.value = '';
        event.target.value = value;
    };

    const showNotification = async (buttonKey: 'firstButton' | 'secondButton', transactions: Array<{description: string, amount: number, category: string, currency: string, transaction_date: string}>) => {
      setLoadingState(prevState => ({ ...prevState, [buttonKey]: true }));
      transactions.forEach(transaction => {
        toast("Transaction has been created.", {
          description: `Name: ${transaction.description}, Amount: ${transaction.amount}, Category: ${transaction.category}`,
          action: {
            label: "Close",
            onClick: () => console.log("Notification closed"),
          },
        });
      });
      setLoadingState(prevState => ({ ...prevState, [buttonKey]: false }));
    
      setInputValue('');
      setAmount('');
      setCategory('');
      setCurrency('');
      setIsPopoverOpen(false);
    };
    
    return (
      <div className="flex justify-between gap-4 p-2 border-b pl-8 sm:pl-4 md:pl-8 lg:pl-8 xl:pl-8 2xl:pl-8">
        <div className="flex w-full items-center space-x-2 mr-6 sm:mr-2 md:mr-6 lg:mr-6 xl:mr-6 2xl:mr-6">
          <Input type="text" placeholder="Be honest... how much did you spend today?" value={inputValue} onChange={handleInputChange} />
          <Button 
              onClick={fetchTransactionData}
              disabled={loadingState.firstButton || loading}
            >
              {loadingState.firstButton ? <ReloadIcon className="w-4 h-4 animate-spin"/> : <Sparkles className="w-4 h-4"/>}
        </Button>
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}> 
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Pickaxe className="w-4 h-4"/>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-100 max-w-full overflow-auto">
                <div className="grid gap-4">
                <h3 className="text-lg font-semibold">Ugh... manually...</h3>
                    <div className="grid gap-2">
                        <Textarea placeholder="Description" id="width" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onFocus={handleFocus} className="col-span-2 h-8" />
                        <Input placeholder="Amount" value={amount} onChange={handleAmountChange} />
                        <Select value={category} onValueChange={handleCategoryChange}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Categories</SelectLabel>
                                <SelectItem value="Travel">Travel</SelectItem>
                                <SelectItem value="Food & Drinks">Food & Drinks</SelectItem>
                                <SelectItem value="Entertainment">Entertainment</SelectItem>
                                <SelectItem value="Utilities & Bills">Utilities & Bills</SelectItem>
                                <SelectItem value="Health & Wellness">Health & Wellness</SelectItem>
                                <SelectItem value="Shopping">Shopping</SelectItem>
                                <SelectItem value="Education">Education</SelectItem>
                                <SelectItem value="Gifts">Gifts</SelectItem>
                                <SelectItem value="Rent">Rent</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <Select value={currency} onValueChange={handleCurrencyChange}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Currencies</SelectLabel>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="RUB">RUB</SelectItem>
                            <SelectItem value="AED">AED</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                            <SelectItem value="AUD">AUD</SelectItem>
                            <SelectItem value="KZT">KZT</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                          </Select>
                    </div>
                    <Button onClick={fetchTransactionDataWithDetails} disabled={loadingState.secondButton}>
                      {loadingState.secondButton ? <ReloadIcon className="w-4 h-4 animate-spin"/> : "Create"}
                    </Button>
                </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    );
}