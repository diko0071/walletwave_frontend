'use client';
import { CardTitle, CardHeader, CardContent, Card, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select, SelectGroup, SelectLabel } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table";
import { Button } from "@/components/ui/button"
import { PopoverTrigger, PopoverContent, Popover } from "@/components/ui/popover"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Calendar } from "@/components/ui/calendar"
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import {
    Bird,
    Book,
    Bot,
    Code2,
    CornerDownLeft,
    LifeBuoy,
    Mic,
    Paperclip,
    Rabbit,
    Settings,
    Settings2,
    Share,
    SquareTerminal,
    SquareUser,
    Triangle,
    Turtle,
    Wallet,
    AreaChart,
    LogOut,
    Home,
    Currency,
    Gem,
    Coins, 
    CalendarFold,
    Delete,
    Edit2,
  } from "lucide-react"

import React, { useState } from 'react';

const transactions = [
    { id: 1, name: "Spotify", category: "Subscriptions", chargeDate: "1st of every month", amount: "14.99", currency: "USD", frequency: "Monthly" },
    { id: 2, name: "Netflix", category: "Subscriptions", chargeDate: "5th of every month", amount: "9.99", currency: "USD", frequency: "Monthly" },
    { id: 3, name: "Electricity", category: "Utilities", chargeDate: "10th of every month", amount: "30.00", currency: "USD", frequency: "Monthly" },
  ];
  

  const frequencies = ["Weekly", "Monthly", "Yearly"];
  
  const categories = ["Entertainment", "Utilities", "Subscriptions", "Other"];
  const currencies = ["USD", "EUR", "GBP"];

  type Transaction = {
    id: number;
    name: string;
    category: string;
    chargeDate: string;
    amount: string;
    currency: string;
    frequency: string; 
  };

  
  export default function TransactionSettings() {

    const [currentTransactions, setCurrentTransactions] = useState(transactions);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deletingTransactionId, setDeletingTransactionId] = useState<number | null>(null);
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  
    const handleDelete = (transactionId: number) => {
        console.log(`Deleting transaction with ID: ${transactionId}`);
        const updatedTransactions = currentTransactions.filter(t => t.id !== transactionId);
        setCurrentTransactions(updatedTransactions);
        setIsDeleteDialogOpen(false);
        toast(`${transactionId} has been successfully deleted.`, {
          action: {
            label: "Close",
            onClick: () => console.log("Notification closed"),
          },
        });
      };

      const handleDeleteClick = (transactionId: number) => {
        setDeletingTransactionId(transactionId);
        setIsAlertDialogOpen(true);
    };

    const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

    const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false);
    const [newTransaction, setNewTransaction] = useState<Transaction>({
      id: Date.now(),
      name: '',
      category: '',
      chargeDate: '',
      amount: '',
      currency: 'USD',
      frequency: 'Monthly' // Provide a default value or adjust based on your application's needs
    });
    

    const handleCreateNewTransaction = () => {
      setIsNewTransactionOpen(true);
      // Initialize newTransaction with default/empty values, including frequency
      setNewTransaction({
        id: Date.now(),
        name: '',
        category: '',
        chargeDate: '',
        amount: '',
        currency: 'USD',
        frequency: 'Monthly' // Make sure to include frequency
      });
    };

    const handleSaveNewTransaction = () => {
      console.log("Adding new transaction:", newTransaction);
      setCurrentTransactions([...currentTransactions, newTransaction]);
      setIsNewTransactionOpen(false);
      toast(`${newTransaction.name} has been successfully added.`, {
        action: {
            label: "Close",
            onClick: () => console.log("Notification closed"),
        },
      });
    };

    const renderCreateTransactionSheet = () => (
      <Sheet open={isNewTransactionOpen} onOpenChange={setIsNewTransactionOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Create New Transaction</SheetTitle>
            <SheetDescription>Enter the details of the new transaction.</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="newDescription">Description</Label>
            <Input
              id="newDescription"
              value={newTransaction.name}
              onChange={(e) => setNewTransaction({ ...newTransaction, name: e.target.value })}
            />
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button onClick={handleSaveNewTransaction}>Save</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  
    const handleEdit = (transaction: any) => {
      setEditingTransaction(transaction);
      setIsEditSheetOpen(true);
    };
  
    const handleSaveTransaction = () => {
      console.log("Saving changes for transaction:", editingTransaction);
  
      setIsEditSheetOpen(false);
      if (editingTransaction) {
          toast(`${editingTransaction.name} has been successfully updated.`, {
              action: {
                  label: "Close",
                  onClick: () => console.log("Notification closed"),
              },
          });
      } 
    };

      const confirmDeleteTransaction = () => {
        if (deletingTransactionId !== null) {
            handleDelete(deletingTransactionId);
            setIsAlertDialogOpen(false); 
            setDeletingTransactionId(null); 
        }
    };

    const renderDeleteConfirmationDialog = () => (
        <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="outline" style={{ display: "none" }}>Open</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the transaction and remove it from your records.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button onClick={() => setIsAlertDialogOpen(false)}>Cancel</Button>
              <Button className="ml-2 bg-red-500 hover:bg-red-700" onClick={confirmDeleteTransaction}>Continue</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
  
    const renderEditSheet = () => {
      if (!editingTransaction) return null;
  
      return (
        <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Edit Transaction</SheetTitle>
              <SheetDescription>Modify the details of your transaction.</SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={editingTransaction.name}
                onChange={(e) => setEditingTransaction({ ...editingTransaction, name: e.target.value })}
              />
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button onClick={handleSaveTransaction}>Save</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      );
    };

    const renderActionMenu = (transaction: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline">
              <Edit2 className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => handleEdit(transaction)}>Edit</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => handleDeleteClick(transaction.id)} color="red">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
  
    return (
      <div className="grid gap-10">
            {renderEditSheet()}
            {renderDeleteConfirmationDialog()}
            {renderCreateTransactionSheet()}
            <Card x-chunk="transaction-settings-chunk-1">
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
            <Card x-chunk="transaction-settings-chunk-2">
            <CardHeader>
              <CardTitle>Recurring Transactions</CardTitle>
              <CardDescription>
                Add recurring transactions, they will be added automatically in your transactions based on charge date.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Charge Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell><span>{transaction.name}</span></TableCell>
                      <TableCell><span>{transaction.category}</span></TableCell>
                      <TableCell><span>{transaction.chargeDate}</span></TableCell>
                      <TableCell><span>{`${transaction.currency} ${transaction.amount}`}</span></TableCell>
                      <TableCell><span>{transaction.frequency}</span></TableCell>
                      <TableCell>
                        {renderActionMenu(transaction)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-between mt-4">
                <Button onClick={handleCreateNewTransaction}>Add Transaction</Button>
              </div>
            </CardContent>
          </Card>
        </div>
    );
  }