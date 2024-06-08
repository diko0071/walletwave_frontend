'use client'
import Link from "next/link"
import React, { useState, useEffect } from 'react';
import {
  Activity,
  ArrowUpRight,
  CircleUser,
  CreditCard,
  DollarSign,
  Menu,
  Package2,
  Search,
  Users,
} from "lucide-react"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

import {
  ChevronLeft,
  ChevronRight,
  Copy,
  File,
  Home,
  ListFilter,
  MoreVertical,
  Package,
  PanelLeft,
  Settings,
  ShoppingCart,
  Truck,
  Users2,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { DataTable } from "./Table";

import ApiService from "@/app/services/apiService";

import { Skeleton } from "@/components/ui/skeleton";


export type TransactionStat = {
  monthly_sum: number
  monthly_change: number  
  transactions_count: number
  top_category_current_month: string
  transactions_by_category: { category: string, total_sum: number }[]
  total_monthly_sum: number
  monthly_transactions_details: { transaction_date: string, converted_amount: number }[]
  monthly_sum_comparison: { current_month_sum: number, previous_month_sum: number, absolute_change: number, percentage_change: number }
  upcoming_recurring_transactions: { next_charge_date: string, amount: number, description: string, currency: string }[]
  total_upcoming_transactions_sum: number
  transactions_by_month: { month: string, month_sum: number }[]
}

function processApiData(apiResponse: any): TransactionStat {
  return {
    monthly_sum: apiResponse.total_monthly_sum,
    monthly_change: apiResponse.monthly_sum_comparison.percentage_change,
    transactions_count: apiResponse.monthly_transactions_details.length,
    top_category_current_month: apiResponse.top_category_current_month.category,
    transactions_by_category: apiResponse.transactions_by_category,
    total_monthly_sum: apiResponse.total_monthly_sum,
    monthly_transactions_details: apiResponse.monthly_transactions_details.map((detail: any) => ({
      transaction_date: detail.transaction_date,
      converted_amount: detail.total_sum
    })),
    monthly_sum_comparison: apiResponse.monthly_sum_comparison,
    upcoming_recurring_transactions: apiResponse.upcoming_recurring_transactions,
    total_upcoming_transactions_sum: apiResponse.total_upcoming_transactions_sum,
    transactions_by_month: apiResponse.transactions_by_month
  };
}


function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };
  return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
}

function formatDateWithDay(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
}

export function Dashboard() {

  const [loading, setLoading] = useState<boolean>(false);
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


  return (
    <div className="flex min-h-screen w-full flex-col">
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-2">
      <Card x-chunk="dashboard-01-chunk-0">
        <CardHeader className="flex flex-col items-start space-y-2">
          <CardTitle className="font-semibold">
            Spend this month
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            You spent {data?.monthly_sum ? data.monthly_sum.toFixed(2) : '0.00'} this month.
          </CardDescription>
        </CardHeader>
        <CardContent>
        {data?.monthly_transactions_details.length ? (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={data?.monthly_transactions_details.map((detail) => ({ name: formatDateWithDay(detail.transaction_date), spending: detail.converted_amount }))}
              margin={{ top: 5, right: 20, left: -30, bottom: 5 }}
            >
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="name" stroke="rgba(0, 0, 0, 0.5)" tick={{ fontSize: '0.7rem' }} tickLine={false} />
              <YAxis stroke="rgba(0, 0, 0, 0.5)" tick={{ fontSize: '0.7rem' }} tickLine={false} tickFormatter={(value) => value !== 0 ? value : ''} />
              <Tooltip />
              <Line type="monotone" dataKey="spending" stroke="#0F172A" dot={true} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-muted-foreground">No data for this month.</p>
        )}
        </CardContent>
      </Card>
      <Card x-chunk="dashboard-01-chunk-1">
            <CardHeader className="flex flex-col items-start space-y-2">
                <CardTitle className="font-semibold">
                  Spend by month
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Comparision of your spendings across months.
                </CardDescription>
              </CardHeader>
        <CardContent>
        {data?.transactions_by_month.length ? (
          <ResponsiveContainer width="100%" height={350}>
          <BarChart
          data={data?.transactions_by_month.map((month) => ({ name: formatDate(month.month), spending: month.month_sum }))}
          margin={{ top: 5, right: 20, left: -15, bottom: 5 }}
        >
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="name" stroke="rgba(0, 0, 0, 0.5)" tick={{ fontSize: '0.7rem' }} tickLine={false} />
          <YAxis stroke="rgba(0, 0, 0, 0.5)" tick={{ fontSize: '0.7rem' }} tickLine={false} tickFormatter={(value) => value !== 0 ? value : ''} />
          <Tooltip />
          <Bar dataKey="spending" fill="#0F172A" />
          </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-muted-foreground">No data for this month.</p>
        )}
        </CardContent>
      </Card>
      <Card x-chunk="dashboard-01-chunk-2">
      <CardHeader className="flex flex-col items-start space-y-2">
                <CardTitle className="font-semibold">
                  Spend by category this month
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                {data?.top_category_current_month 
                  ? `Your highest category in this month is ${data.top_category_current_month}.` 
                  : "You don't have transactions for this month."}
              </CardDescription>
              </CardHeader>
  <CardContent>
    {data?.transactions_by_category.length ? (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        layout="vertical"
        data={data?.transactions_by_category.map((category) => ({ name: category.category, value: category.total_sum }))}
        margin={{ top: 5, right: 20, left: 15, bottom: 5 }}
      >
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis type="number" stroke="rgba(0, 0, 0, 0.5)" tick={{ fontSize: '0.7rem' }} tickLine={false} />
        <YAxis type="category" dataKey="name" stroke="rgba(0, 0, 0, 0.5)" tick={{ fontSize: '0.7rem' }} tickLine={false} />
        <Tooltip />
        <Bar dataKey="value" fill="#0F172A" />
      </BarChart>
    </ResponsiveContainer>
    ) : (
      <p className="text-sm text-muted-foreground">No data for this month.</p>
    )}
  </CardContent>
</Card>
  <Card x-chunk="dashboard-01-chunk-3">
  <CardHeader className="flex flex-col items-start space-y-2">
                  <CardTitle className="font-semibold">
                    Upcoming transactions
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                  {data?.upcoming_recurring_transactions.length 
                  ? `You have ${data.upcoming_recurring_transactions.length} upcoming transactions.` 
                  : "You don't have upcoming transactions this month."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-2">
    {data?.upcoming_recurring_transactions.length ? (
      data.upcoming_recurring_transactions.map((transaction, index) => (
        <div key={index}>
          <div className="flex items-center gap-4">
            <div className="grid gap-1">
              <p className="text-sm font-medium leading-none">
                {transaction.description}
              </p>
              <p className="text-xs text-gray-500 opacity-50">
                Charge date: {transaction.next_charge_date}
              </p>
            </div>
            <div className="ml-auto font-medium">{`${transaction.currency} ${transaction.amount.toFixed(2)}`}</div>
          </div>
          {index < data.upcoming_recurring_transactions.length - 1 && <hr className="my-2" />}
        </div>
      ))
    ) : (
      <p className="text-sm text-muted-foreground">No upcoming transactions.</p>
    )}
  </CardContent>
  </Card>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-1 xl:grid-cols-1">
          <Card
            className="xl:col-span-2" x-chunk="dashboard-01-chunk-4"
          >
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="mb-2">All Transactions</CardTitle>
              <CardDescription>
                Recent transactions from your wallet.
              </CardDescription>
            </div>
            </CardHeader>
            <CardContent>
              <DataTable />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
