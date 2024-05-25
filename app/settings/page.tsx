'use client';
import Link from "next/link"
import { CircleUser, Menu, Package2, Search } from "lucide-react"

import ReccuringTransactions from "@/app/components/Settings/TransactionSettings"
import UserSettings from "@/app/components/Settings/UserSettings"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react";


type Section = 'General' | 'Transactions';

export default function Settings() {

  const [activeSection, setActiveSection] = useState('General');


  const changeSection = (section: Section) => () => {
    setActiveSection(section);
  };

  const getButtonClass = (section: Section) => {
    return activeSection === section ? 'font-semibold' : '';
  };


  const renderSection = () => {
    switch (activeSection) {
      case 'General':
        return <UserSettings />;
      case 'Transactions':
        return <ReccuringTransactions />;
      default:
        return null; 
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col pl-[56px]">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">Settings</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <nav className="grid gap-4 text-sm text-muted-foreground justify-items-start">
          <button onClick={changeSection('General')} className={getButtonClass('General')}>
              General
            </button>
            <button onClick={changeSection('Transactions')} className={getButtonClass('Transactions')}>
              Transactions
            </button>
          </nav>
          <div>
            {renderSection()}
          </div>
        </div>
      </main>
    </div>
  );
}