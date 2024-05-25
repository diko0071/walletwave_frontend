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
import ApiService from "@/app/services/apiService";
import { ReloadIcon } from "@radix-ui/react-icons"
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
    MoreHorizontal
  } from "lucide-react"

import React, { useState, useEffect } from 'react';
  

  const frequencies = ["Monthly"]; 

  const categories = [
    "Travel",
    "Food & Drinks",
    "Entertainment",
    "Utilities & Bills",
    "Health & Wellness",
    "Shopping",
    "Education",
    "Gifts",
    "Rent",
    "Subscription",
    "Other"
  ]; 
  
  const currencies = ["USD", "EUR", "RUB", "AED", "GBP", "AUD", "KZT"]; 

  type Transaction = {
    id: number;
    description: string;
    category: string;
    charge_day: string; 
    amount: string;
    currency: string;
    frequency: string; 
    next_charge_date: string;
  };

  function currencySymbol(currencyCode: string): string {
    switch (currencyCode) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'JPY': return '¥';
      case 'RUB': return '₽';
      case 'AED': return 'AED';
      case 'AUD': return 'AUD';
      case 'KZT': return '₸';
      default: return currencyCode;
    }
  }

  
  export default function TransactionSettings() {

    const [currentTransactions, setCurrentTransactions] = useState<Transaction[]>([]);
    const [userSettings, setUserSettings] = useState({ currency: '', email: '' });


    useEffect(() => {
      setIsLoading(true); 
      ApiService.get('/api/transactions/recurring/')
        .then(data => {
          console.log("API Response:", data);
          setCurrentTransactions(data);
          setIsLoading(false); 
        })
        .catch(error => {
          console.error("Error fetching transactions:", error);
          setIsLoading(false); 
        });
    }, []);


    useEffect(() => {
      setIsLoading(true);
      ApiService.get('/api/auth/user/data/')
        .then(response => {
          console.log("API Response:", response);

          setUserSettings({ currency: response.currency, email: response.email }); 
          setIsLoading(false); 
        })
        .catch(error => {
          console.error("Error fetching user settings:", error);
          setIsLoading(false); 
        });
    }, []);
  
    const handleSaveCurrencyChange = () => {
      setIsLoadingSaveCurrency(true);
      const payload = {
        email: userSettings.email,
        currency: userSettings.currency,
      };
      ApiService.put('/api/auth/user/data/update/', JSON.stringify(payload))
        .then(() => {
          toast("Currency updated successfully.", {
            action: {
              label: "Close",
              onClick: () => console.log("Notification closed"),
            },
          });
        })
        .catch(error => {
          console.error("Error updating currency:", error);
        })
        .finally(() => {
          setIsLoadingSaveCurrency(false);
        });
    };

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
        setIsLoading(true);
        ApiService.get(`/api/transactions/recurring/${transactionId}/`)
          .then(data => {
            console.log("Transaction data:", data);
            setIsAlertDialogOpen(true);
            setDeletingTransactionId(transactionId);
            setIsLoading(false);
          })
          .catch(error => {
            console.error("Error fetching transaction details:", error);
            setIsLoading(false);
          });
      };

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingSaveCurrency, setIsLoadingSaveCurrency] = useState(false);

    const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

    const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false);
    const [newTransaction, setNewTransaction] = useState<Transaction>({
      id: Date.now(),
      description: '',
      category: '',
      charge_day: '',
      amount: '',
      currency: 'USD',
      frequency: 'Monthly',
      next_charge_date: ''
    });
    

    const handleCreateNewTransaction = () => {
      setIsNewTransactionOpen(true);
      setNewTransaction({
        id: Date.now(), 
        description: '',
        category: '',
        charge_day: '',
        amount: '',
        currency: 'USD',
        frequency: 'Monthly',
        next_charge_date: ''
      });
    };
    
    const handleSaveNewTransaction = () => {
      console.log("Adding new transaction:", newTransaction);
      setIsLoading(true);
    
      ApiService.post_auth('/api/transactions/recurring/create/', JSON.stringify({
        description: newTransaction.description, 
        category: newTransaction.category,
        charge_day: newTransaction.charge_day, 
        amount: newTransaction.amount,
        currency: newTransaction.currency,
        frequency: newTransaction.frequency
      }))
      .then(response => {
        setCurrentTransactions(prevData => [...prevData, response]);
        setIsNewTransactionOpen(false);
        setIsLoading(false);
        toast(`Transaction ${response.description} has been successfully added.`, {
          action: {
              label: "Close",
              onClick: () => console.log("Notification closed"),
          },
        });
      })
      .catch(error => {
        console.error("Error adding new transaction:", error);
        setIsLoading(false);
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
            <Label htmlFor="newName">Name</Label>
            <Input
              id="newName"
              value={newTransaction.description}
              onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
            />
            <Label htmlFor="newCategory">Category</Label>
            <Select value={newTransaction.category} onValueChange={(value) => setNewTransaction({ ...newTransaction, category: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Label htmlFor="newChargeDate">Charge Day</Label>
            <Input
              id="newChargeDate"
              value={newTransaction.charge_day}
              onChange={(e) => setNewTransaction({ ...newTransaction, charge_day: e.target.value })}
            />
            <Label htmlFor="newAmount">Amount</Label>
            <Input
              id="newAmount"
              value={newTransaction.amount}
              onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
            />
            <Label htmlFor="newCurrency">Currency</Label>
            <Select value={newTransaction.currency} onValueChange={(value) => setNewTransaction({ ...newTransaction, currency: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Currencies</SelectLabel>
                  {currencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Label htmlFor="newFrequency">Frequency</Label>
            <Select value={newTransaction.frequency} onValueChange={(value) => setNewTransaction({ ...newTransaction, frequency: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Frequencies</SelectLabel>
                  {frequencies.map((frequency) => (
                    <SelectItem key={frequency} value={frequency}>{frequency}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <SheetFooter>
          <SheetClose asChild>
            <Button onClick={handleSaveNewTransaction}>
              {isLoading ? <ReloadIcon className="w-4 h-4 animate-spin"/> : 'Save'}
            </Button>
          </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  
    const handleEdit = (transactionId: number) => {
      setIsLoading(true);
      ApiService.get(`/api/transactions/recurring/${transactionId}/`)
        .then(data => {
          setEditingTransaction(data);
          setIsEditSheetOpen(true);
          setIsLoading(false);
        })
        .catch(error => {
          console.error("Error fetching transaction details:", error);
          setIsLoading(false);
        });
    };
    const handleSaveTransaction = () => {
      if (editingTransaction) {
        setIsLoading(true); 
        ApiService.put(`/api/transactions/recurring/${editingTransaction.id}/update/`, JSON.stringify(editingTransaction))
          .then(response => {
            console.log("Transaction updated successfully:", response);
            setIsEditSheetOpen(false); 
            setIsLoading(false); 
            toast(`Transaction ${response.description} has been successfully updated.`, {
              action: {
                  label: "Close",
                  onClick: () => console.log("Notification closed"),
              },
            });
          })
          .catch(error => {
            console.error("Error updating transaction:", error);
            setIsLoading(false); 
          });
      }
    };

    const confirmDeleteTransaction = () => {
      if (deletingTransactionId !== null) {
        setIsLoading(true);
        ApiService.delete(`/api/transactions/recurring/${deletingTransactionId}/delete`)
          .then(() => {
            console.log(`Transaction with ID: ${deletingTransactionId} has been successfully deleted.`);
            const updatedTransactions = currentTransactions.filter(t => t.id !== deletingTransactionId);
            setCurrentTransactions(updatedTransactions);
            setIsAlertDialogOpen(false);
            setDeletingTransactionId(null);
            setIsLoading(false);
            toast("Transaction has been successfully deleted.", {
              action: {
                label: "Close",
                onClick: () => console.log("Notification closed"),
              },
            });
          })
          .catch(error => {
            console.error("Error deleting transaction:", error);
            setIsLoading(false);
          });
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
                <Label htmlFor="editDescription">Description</Label>
                <Input
                  id="editDescription"
                  value={editingTransaction.description}
                  onChange={(e) => setEditingTransaction({ ...editingTransaction, description: e.target.value })}
                />
                  <Label htmlFor="editCategory">Category</Label>
                  <Select 
                    value={editingTransaction.category} 
                    onValueChange={(value) => setEditingTransaction({ ...editingTransaction, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Categories</SelectLabel>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                <Label htmlFor="editChargeDay">Charge Day</Label>
                <Input
                  id="editChargeDay"
                  type="text" 
                  value={editingTransaction.charge_day}
                  onChange={(e) => setEditingTransaction({ ...editingTransaction, charge_day: e.target.value })}
                />
      
                <Label htmlFor="editAmount">Amount</Label>
                <Input
                  id="editAmount"
                  type="text" 
                  value={editingTransaction.amount}
                  onChange={(e) => setEditingTransaction({ ...editingTransaction, amount: e.target.value })}
                />
      
                    <Label htmlFor="editCurrency">Currency</Label>
              <Select 
                value={editingTransaction.currency} 
                onValueChange={(value) => setEditingTransaction({ ...editingTransaction, currency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Currencies</SelectLabel>
                    {currencies.map((currency) => (
                      <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Label htmlFor="editFrequency">Frequency</Label>
              <Select 
                value={editingTransaction.frequency} 
                onValueChange={(value) => setEditingTransaction({ ...editingTransaction, frequency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {frequencies.map((frequency) => (
                    <SelectItem key={frequency} value={frequency}>{frequency}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              </div>
              <SheetFooter>
              <SheetClose asChild>
                  <Button onClick={handleSaveTransaction}>
                    {isLoading ? <ReloadIcon className="w-4 h-4 animate-spin"/> : 'Save'}
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        );
      };

    const renderActionMenu = (transaction: Transaction) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => handleEdit(transaction.id)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => handleDeleteClick(transaction.id)} className="text-red-500">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  
    return (
      <div className="grid gap-6">
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
              <Select value={userSettings.currency} onValueChange={(value) => setUserSettings({ ...userSettings, currency: value })}>
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
                <Button onClick={handleSaveCurrencyChange}>
                    {isLoadingSaveCurrency ? <ReloadIcon className="w-4 h-4 animate-spin"/> : 'Save'}
                  </Button>
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
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Next Charge Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentTransactions && currentTransactions.length > 0 ? (
                      currentTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell><span>{transaction.description}</span></TableCell>
                          <TableCell><span>{transaction.category}</span></TableCell>
                          <TableCell><span>{transaction.next_charge_date}</span></TableCell>
                          <TableCell><span>{currencySymbol(transaction.currency) + transaction.amount}</span></TableCell>
                          <TableCell><span>{transaction.frequency}</span></TableCell>
                          <TableCell>
                            {renderActionMenu(transaction)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6}>No transactions found</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <div className="flex justify-between mt-4">
                  <Button onClick={handleCreateNewTransaction}>Add Reccuring Transaction</Button>
              </div>
              </CardContent>
            </Card>
        </div>
    );
  }