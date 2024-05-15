'use client';
import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import Link from "next/link";
import { CircleUser, Menu, Package2, Search } from "lucide-react";

import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select, SelectGroup, SelectLabel } from "@/components/ui/select";
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import ApiService from "@/app/services/apiService"; // Assuming you have a service like this for API calls
import { toast } from "sonner";

export default function UserSettings() {
  const [userData, setUserData] = useState({ name: '', email: '' });

  useEffect(() => {
    ApiService.get('/api/auth/user/data')
      .then(data => {
        setUserData({ name: data.name, email: data.email });
      })
      .catch(error => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  const handleSave = () => {
    const payload = { 
      name: userData.name,
      email: userData.email // Ensure email is included if required by your backend
    };
    ApiService.put('/api/auth/user/data/update/', JSON.stringify(payload))
      .then(() => {
        console.log("User data updated successfully");
        // Add the toast notification here with the user's name
        toast(`${userData.name}'s data has been updated successfully.`, {
          action: {
            label: "Close",
            onClick: () => console.log("Notification closed"),
          },
        });
      })
      .catch(error => {
        console.error("Error updating user data:", error);
        // Optionally, show an error message to the user
      });
  };

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
            <Input
              placeholder="Name" 
              value={userData.name} 
              onChange={(e) => setUserData({ ...userData, name: e.target.value })} 
            />
            <Input disabled
              placeholder="Email" 
              value={userData.email} 
            />
          </form>
          <div className="flex justify-between mt-4">
            <Button onClick={handleSave}>Save</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}