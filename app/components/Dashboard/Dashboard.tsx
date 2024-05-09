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

import {
  ChevronLeft,
  ChevronRight,
  Copy,
  File,
  Home,
  LineChart,
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
  weekly_sum: number
  weekly_change: number
  transactions_count: number
  transactions_count_change: number
  top_category_current_month: string
  top_category_previous_month: string
}

function processApiData(apiResponse: any): TransactionStat {
  return {
    monthly_sum: apiResponse.monthly_sum,
    monthly_change: apiResponse.monthly_change,
    weekly_sum: apiResponse.weekly_sum,
    weekly_change: apiResponse.weekly_change,
    transactions_count: apiResponse.transactions_count,
    transactions_count_change: apiResponse.transactions_count_change,
    top_category_current_month: apiResponse.top_category_current_month ? apiResponse.top_category_current_month.category : 'None',
    top_category_previous_month: apiResponse.top_category_previous_month ? apiResponse.top_category_previous_month.category : 'None',
  };
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
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <>
                <Skeleton className="h-6 w-full rounded-md" />
                <Skeleton className="h-4 w-3/4 mt-2 rounded-md" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {`$${data?.monthly_sum ? data.monthly_sum.toFixed(2) : '0.00'}`}
                </div>
                <p className="text-xs text-muted-foreground">
                  {`${data?.monthly_change}% change MoM`}
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Weekly
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <>
                <Skeleton className="h-6 w-full rounded-md" />
                <Skeleton className="h-4 w-3/4 mt-2 rounded-md" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {`$${data?.weekly_sum ? data.weekly_sum.toFixed(2) : '0.00'}`}
                </div>
                <p className="text-xs text-muted-foreground">
                  {`${data?.weekly_change}% change WoW`}
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <>
                <Skeleton className="h-6 w-full rounded-md" />
                <Skeleton className="h-4 w-3/4 mt-2 rounded-md" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">{data?.transactions_count}</div>
                <p className="text-xs text-muted-foreground">
                  {`${data?.transactions_count_change}% change MoM`}
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Category</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <>
                <Skeleton className="h-6 w-full rounded-md" />
                <Skeleton className="h-4 w-3/4 mt-2 rounded-md" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">{data?.top_category_current_month}</div>
                <p className="text-xs text-muted-foreground">
                  Last month «{data?.top_category_previous_month}»
                </p>
              </>
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
              <CardTitle className="mb-2">Transactions</CardTitle>
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
