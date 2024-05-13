'use client';
import Link from "next/link"
import { CircleUser, Menu, Package2, Search } from "lucide-react"

import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select, SelectGroup, SelectLabel } from "@/components/ui/select"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"

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

export default function UserSettings() {
  return (
<div className="grid gap-10">
<Card x-chunk="user-settings-chunk-1">
  <CardHeader>
    <CardTitle>User Settings</CardTitle>
    <CardDescription>
      Update your basic information.
    </CardDescription>
  </CardHeader>
  <CardContent>
    <form className="flex flex-col gap-4">
      <Input placeholder="First Name" />
      <Input placeholder="Last Name" />
      <Input placeholder="Email" />
    </form>
    <div className="flex justify-between mt-4">
        <Button>Save</Button>
    </div>
  </CardContent>
</Card>
<Card x-chunk="user-settings-chunk-2">
  <CardHeader>
    <CardTitle>Default Currency</CardTitle>
    <CardDescription>
      Select your preferred currency.
    </CardDescription>
  </CardHeader>
  <CardContent>
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Select a currency" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Currencies</SelectLabel>
          <SelectItem value="USD">USD</SelectItem>
          <SelectItem value="EUR">EUR</SelectItem>
          <SelectItem value="GBP">GBP</SelectItem>
          <SelectItem value="JPY">JPY</SelectItem>
          <SelectItem value="RUB">RUB</SelectItem>
          <SelectItem value="AED">AED</SelectItem>
          <SelectItem value="AUD">AUD</SelectItem>
          <SelectItem value="KZT">KZT</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
    <div className="flex justify-between mt-4">
        <Button>Save</Button>
    </div>
  </CardContent>
</Card>
</div>
  )
}