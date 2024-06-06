'use client'
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Fingerprint } from 'lucide-react';

export default function Features() {
  return (
    <div className="bg-white text-black p-8 py-12 md:py-24 px-4 md:px-6">
    <div className="mb-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4 text-center">Our Features</h1>
      <p className="text-gray-500 dark:text-gray-400 max-w-[600px] text-center">
        We offer a variety of features to help you build your next project. Explore our offerings below.
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <Card className="bg-gray-100">
        <CardContent className="space-y-4">
          <div className="flex justify-center space-x-2">
            <Fingerprint className="text-gray-800" />
          </div>
          <h3 className="text-xl font-semibold">Stripe Subscriptions Starter</h3>
          <p>
            The all-in-one subscription starter kit for high-performance SaaS applications, powered by Stripe, Supabase,
            and Vercel.
          </p>
        </CardContent>
      </Card>
      <Card className="bg-gray-100">
        <CardContent className="space-y-4">
          <div className="flex justify-center space-x-2">
            <Fingerprint className="text-gray-800" />
          </div>
          <h3 className="text-xl font-semibold">Next.js Starter</h3>
          <p>
            A Next.js App Router template configured with cookie-based auth using Supabase, TypeScript and Tailwind CSS.
          </p>
        </CardContent>
      </Card>
      <Card className="bg-gray-100">
        <CardContent className="space-y-4">
          <div className="flex justify-center space-x-2">
            <Fingerprint className="text-gray-800" />
          </div>
          <h3 className="text-xl font-semibold">AI Chatbot</h3>
          <p>An open-source AI chatbot app template built with Next.js, the Vercel AI SDK, OpenAI, and Supabase.</p>
        </CardContent>
      </Card>
      <Card className="bg-gray-100">
        <CardContent className="space-y-4">
          <div className="flex justify-center space-x-2">
            <Fingerprint className="text-gray-800" />
          </div>
          <h3 className="text-xl font-semibold">LangChain + Next.js Starter</h3>
          <p>
            Starter template and example use-cases for LangChain projects in Next.js, including chat, agents, and
            retrieval.
          </p>
        </CardContent>
      </Card>
      <Card className="bg-gray-100">
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <Fingerprint className="text-gray-800" />
          </div>
          <h3 className="text-xl font-semibold">Flutter User Management</h3>
          <p>
            Get started with Supabase and Flutter by building a user management app with auth, file storage, and
            database.
          </p>
        </CardContent>
      </Card>
      <Card className="bg-gray-100">
        <CardContent className="space-y-4">
          <div className="flex justify-center space-x-2">
            <Fingerprint className="text-gray-800" />
          </div>
          <h3 className="text-xl font-semibold">Expo React Native Starter</h3>
          <p>
            An extended version of create-t3-turbo implementing authentication on both the web and mobile applications.
          </p>
        </CardContent>
      </Card>
    </div>
    </div>
  )
}