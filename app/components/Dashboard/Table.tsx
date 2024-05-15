"use client"
import * as React from "react";
import { DateRange } from "react-day-picker";
import { format, addDays, parseISO, subDays, parse} from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from "../../lib/utils"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

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

import ApiService from "@/app/services/apiService";

import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { toast } from "sonner";

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { DatePickerWithRange } from "./DateRangePicker"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

  export type Transaction = {
    id: string
    description: string
    date: string
    category: string
    converted_amount: number
    converted_currency: string
  }


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

export const columns: ColumnDef<Transaction>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("description")}</div>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Amount
        <ArrowUpDown className="ml-2 h-3 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const currency = row.original.converted_currency; 
      const symbol = currencySymbol(currency);
      return <div className="flex justify-between">{symbol}{amount}</div>;
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("category")}</div>
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-3 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("date")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const transaction = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(transaction.id)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function DataTable() {


  const [data, setData] = React.useState<Transaction[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [loadingState, setLoadingState] = React.useState({ save: false, delete: false });

  const showNotification = (action: 'save' | 'delete', transaction: Transaction) => {
    if (action === 'save') {
      setLoadingState(prevState => ({ ...prevState, save: true }));
      toast(`${transaction.description} transaction has been successfully saved.`, {
        action: {
          label: "Close",
          onClick: () => console.log("Notification closed"),
        },
      });
      setLoadingState(prevState => ({ ...prevState, save: false }));
    }
    if (action === 'delete') {
      setLoadingState(prevState => ({ ...prevState, delete: true }));
      toast(`${transaction.description} transaction has been successfully deleted.`, {
        action: {
          label: "Close",
          onClick: () => console.log("Notification closed"),
        },
      });
      setLoadingState(prevState => ({ ...prevState, delete: false }));
    }
  };

  const [isEditSheetOpen, setIsEditSheetOpen] = React.useState(false);
  const [editingTransaction, setEditingTransaction] = React.useState<Transaction | null>(null);
  
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'date', desc: true }
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(() => {
    return Array.from(new Set(data.map(item => item.category)));
  });

  const parseDateString = (dateString: string) => {
    const cleanedDateString = dateString.replace(/(\d+)(st|nd|rd|th)/, '$1');
    return parse(cleanedDateString, 'MMMM d, yyyy', new Date());
  };

  const filteredData = React.useMemo(() => {
    if (selectedCategories.length === 0) {
      return [];
    }
  
    return data.filter((transaction) => {
      const dateInRange = !dateRange || !dateRange.from || !dateRange.to || 
        (transaction.date >= format(dateRange.from, 'yyyy-MM-dd') && transaction.date <= format(dateRange.to, 'yyyy-MM-dd'));
      const categoryMatches = selectedCategories.includes(transaction.category);
      return dateInRange && categoryMatches;
    });
  }, [dateRange, selectedCategories, data]);

  const updateTransaction = (transaction: Transaction) => {
    setLoadingState(prevState => ({ ...prevState, save: true }));
    ApiService.put(`/api/transactions/${transaction.id}/update/`, JSON.stringify({
      description: transaction.description,
      category: transaction.category,
      amount: transaction.converted_amount,
      currency: transaction.converted_currency,
      transaction_date: transaction.date 
    }))
      .then(() => {
        showNotification('save', transaction);
      })
      .catch(error => {
        console.error('Failed to update transaction:', error);
      })
      .finally(() => {
        setLoadingState(prevState => ({ ...prevState, save: false }));
        setIsEditSheetOpen(false);
      });
  };


  const handleCategoryChange = (category: string, isChecked: boolean) => {
    setSelectedCategories(prev => {
      if (isChecked) {
        return [...prev, category];
      } else {
        return prev.filter(c => c !== category);
      }
    });
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction); 
    fetchTransaction(transaction.id);
    setIsEditSheetOpen(true);
  };

  const handleSaveTransaction = (transaction: Transaction) => {
    updateTransaction(transaction);
  };

  const handleDeleteTransaction = (transaction: Transaction) => {
    setLoadingState(prevState => ({ ...prevState, delete: true }));
    ApiService.delete(`/api/transactions/${transaction.id}/delete/`)
      .then(() => {
        // Теперь передаём весь объект транзакции в showNotification
        showNotification('delete', transaction);
        // Обновляем состояние, удаляя транзакцию
        setData(prevData => prevData.filter(t => t.id !== transaction.id));
      })
      .catch(error => {
        console.error('Failed to delete transaction:', error);
      })
      .finally(() => {
        setLoadingState(prevState => ({ ...prevState, delete: false }));
      });
  };

  const [isAlertDialogOpen, setIsAlertDialogOpen] = React.useState(false);
  const [transactionToDelete, setTransactionToDelete] = React.useState<Transaction | null>(null);

  const handleDeleteClick = async (transaction: Transaction) => {
    try {

      const transactionDetails = await ApiService.get(`/api/transactions/${transaction.id}`);

      setTransactionToDelete(transactionDetails);

      setIsAlertDialogOpen(true);
    } catch (error) {
      console.error('Failed to fetch transaction details:', error);

    }
  };

  const confirmDeleteTransaction = () => {
    if (transactionToDelete) {
      handleDeleteTransaction(transactionToDelete);
      setIsAlertDialogOpen(false);
      setTransactionToDelete(null);
    }
  };

  function processTransactionsData(jsonData: any[]): Transaction[] {
    return jsonData.map((item: any) => ({
      id: item.id.toString(),
      description: item.description,
      date: item.transaction_date ? item.transaction_date : 'No date provided',
      category: item.category,
      converted_amount: item.converted_amount,
      converted_currency: item.converted_currency,
    }));
  }

  React.useEffect(() => {
    setLoading(true);
    ApiService.get('/api/transactions/')
      .then(jsonData => {
        const transactions = processTransactionsData(jsonData);
        setData(transactions);
        setLoading(false);
  
        const allCategories = Array.from(new Set(transactions.map(item => item.category)));
        setSelectedCategories(allCategories);
      })
      .catch(error => {
        console.error('Failed to fetch transactions:', error);
        setLoading(false);
      });
  }, [dateRange]);
  
  const renderCategoryCheckboxes = () => {
    const uniqueCategories = Array.from(new Set(data.map(item => item.category)));
    return uniqueCategories.map(category => (
      <DropdownMenuItem key={category} className="flex items-center">
        <div onClick={(event) => event.stopPropagation()}>
          <Checkbox
            checked={selectedCategories.includes(category)}
            onCheckedChange={(isChecked) => handleCategoryChange(category, !!isChecked)}
          />
        </div>
        <span className="ml-2">{category}</span>
      </DropdownMenuItem>
    ));
  };

const fetchTransaction = async (transactionId: string) => {
  setLoading(true);
  try {
    const response = await ApiService.get(`/api/transactions/${transactionId}/`);
    const transaction = {
      id: response.id.toString(),
      description: response.description,
      date: response.transaction_date.split('T')[0],
      category: response.category,
      converted_amount: response.converted_amount,
      converted_currency: response.converted_currency,
    };
    setEditingTransaction(transaction);
    setIsEditSheetOpen(true);
  } catch (error) {
    console.error('Failed to fetch transaction details:', error);
  } finally {
    setLoading(false);
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

  const editSheet = editingTransaction && (
    <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Transaction</SheetTitle>
          <SheetDescription>
            Modify the details of your transaction.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={editingTransaction.description}
              onChange={(e) => setEditingTransaction({ ...editingTransaction, description: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              value={editingTransaction.converted_amount}
              onChange={(e) => setEditingTransaction({ ...editingTransaction, converted_amount: parseFloat(e.target.value) })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="currency" className="text-right">
            Currency
          </Label>
          <div className="col-span-3">
            <Select
              value={editingTransaction.converted_currency || "Select a currency"} 
              onValueChange={(value) => setEditingTransaction({ ...editingTransaction, converted_currency: value })}
            >
              <SelectTrigger className="w-full">
                {editingTransaction.converted_currency || "Select a currency"}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="RUB">RUB</SelectItem>
                <SelectItem value="AED">AED</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <div className="col-span-3">
              <Select
                value={editingTransaction.category}
                onValueChange={(value) => setEditingTransaction({ ...editingTransaction, category: value })}
              >
                <SelectTrigger className="w-full">
                  {editingTransaction.category || "Select a category"}
                </SelectTrigger>
                <SelectContent>
                  {Array.from(new Set(data.map(item => item.category))).map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="date" className="text-right">
            Date
          </Label>
          <div className="col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn(
                    "w-full justify-start text-left font-normal",
                    !editingTransaction.date && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editingTransaction.date ? format(new Date(editingTransaction.date), "PPP") : "No date provided"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar 
                    mode="single" 
                    selected={editingTransaction.date ? new Date(editingTransaction.date) : undefined}
                    onSelect={(date: Date | undefined) => {
                      if (date) {
                        setEditingTransaction({ ...editingTransaction, date: format(date, "yyyy-MM-dd") });
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              </div>
            </div>
          </div>
      <SheetFooter>
          <SheetClose asChild>
            <Button type="button" onClick={() => {
              if (editingTransaction) {
                handleSaveTransaction(editingTransaction);
              }
              setIsEditSheetOpen(false);
            }}>Save</Button>
          </SheetClose>
        </SheetFooter>
    </SheetContent>
  </Sheet>
);

  columns.find(col => col.id === 'actions')!.cell = ({ row }) => {
    const transaction = row.original;
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleEditTransaction(transaction)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-500" onClick={() => handleDeleteClick(transaction)}>
            Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  return (
        <div className="w-full">
          {renderDeleteConfirmationDialog()}
          {editSheet}
          <div className="flex items-center py-4">
          <DatePickerWithRange 
          className="max-w-sm"
          onDateChange={setDateRange} 
          initialDateRange={dateRange}
        />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="ml-auto">
            Filter by category <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {renderCategoryCheckboxes()}
        </DropdownMenuContent>
      </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
