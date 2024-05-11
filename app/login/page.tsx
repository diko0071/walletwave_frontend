'use client';
import Link from "next/link"
import { useRouter } from "next/navigation";
import { useState } from "react";
import ApiService from "../services/apiService";
import { handleLogin } from "../lib/actions";
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
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { useEffect } from "react";
import { getRefreshToken, handleRefresh } from "../lib/actions";

export default function Login() {

  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string[]>([]);

  useEffect(() => {
    async function checkAndRefreshToken() {
      const refreshToken = await getRefreshToken();
      if (refreshToken) {
        const newAccessToken = await handleRefresh();
        if (newAccessToken) {
          router.replace('/');
        }
      }
    }

    checkAndRefreshToken();
  }, [router]);

  const submitLogin = async () => {
    const formData = {
      email: email,
      password: password,
    }

  const response = await ApiService.post('/api/auth/login/', JSON.stringify(formData));
  if (response.access) {
    handleLogin(response.user.pk, response.access, response.refresh).then(() => {
      router.push('/');
    });
  } else {
    setError(response.non_field_errors);
  }

}
  return (
    <div>
    <Card className="mx-auto max-w-sm">
      <form action={submitLogin}>
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error.map((error, index) => (
            <Alert key={index} variant="destructive">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ))}
          <Button type="submit" className="w-full">
            Login
          </Button>
        </div>
      </CardContent>
      </form>
    </Card>
    </div>
  )
}