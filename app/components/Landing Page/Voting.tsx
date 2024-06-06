'use client'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

import { ExternalLink } from "lucide-react"

export const Voting = () => {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-24 grid md:grid-cols-1 gap-8 items-center">
      <div className="text-center space-y-4">
      <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Vote for your favorite feature</h1>
        <p className="text-gray-500">
          Help us prioritize our roadmap by voting for the feature you\'d like to see next.
        </p>
        <Card>
        <CardContent className="flex flex-col space-y-6 gap-6 py-6">
          <div className="flex items-center justify-center">
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900 transition-colors">
              <span className="sr-only">Vote</span>
            </Button>
            <div className="text-2xl font-bold">
              <span className="text-gray-900">15</span>
              <span className="text-gray-500"> / 1000 votes</span>
            </div>
          </div>
          <Progress value={15} max={1000} className="w-full h-4" />
          <form className="space-y-2">
            <Input type="email" placeholder="Enter your email" className="w-full" />
            <Button type="submit" className="w-full">
              Cast your vote
            </Button>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}