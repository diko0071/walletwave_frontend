import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
  

export default function AddTransactionManual() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>New Expense</CardTitle>
        <CardDescription>Add a new expense to your records.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4">
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Enter expense description" />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" placeholder="0.00" type="number" />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD</SelectItem>
                  <SelectItem value="eur">EUR</SelectItem>
                  <SelectItem value="gbp">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
  <div className="flex justify-between">
    <Button>Add Expense</Button>
  </div>
</CardFooter>
    </Card>
  )
}

export { AddTransactionManual }; 

