'use client'
import Link from "next/link"


import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
 
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

import { useState } from "react";
import { useRouter } from "next/navigation";
import ApiService from "../services/apiService"
import { handleLogin } from "@/app/lib/actions";
import { get } from "http"

export function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState<string[]>([]);
  const [access_token, setAccessToken] = useState('');
  const [refresh_token, setRefreshToken] = useState('');


  const submitSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = {
      email: email,
      password1: password,
      password2: repeatPassword,
      first_name: firstName,
      last_name: lastName
    };

    const response = await ApiService.post('/api/auth/register/', JSON.stringify(formData));

    if (response.access) {
      
      handleLogin(response.user.pk, response.access, response.refresh);

      router.push('/');
    } else {
      const tmpError: string[] = Object.values(response).map((error: any) => error);
      setError(tmpError);
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <form action={submitSignup}>
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password1" type="password" onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Repeat Password</Label>
            <Input id="password2" type="password" onChange={(e) => setRepeatPassword(e.target.value)} />
          </div>
          {error.map((error, index) => (
            <Alert key={index} variant="destructive">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ))}
          <Button type="submit" className="w-full" onClick={submitSignup}>
            Create an account
          </Button>
          <Button variant="outline" className="w-full">
            Sign up with GitHub
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="#" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
      </form>
    </Card>
  )
}

export default Signup;

