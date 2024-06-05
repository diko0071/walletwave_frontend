'use client'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"

import { ExternalLink } from "lucide-react"

export const Voting = () => {
  return (
    <div className="bg-white p-6 w-full">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Vote for your favorite feature</h2>
        <p className="text-gray-500">
          Help us prioritize our roadmap by voting for the feature you\'d like to see next.
        </p>
        <div className="flex items-center justify-center space-x-4">
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900 transition-colors">
            <ExternalLink className="w-6 h-6" />
            <span className="sr-only">Vote</span>
          </Button>
          <div className="text-4xl font-bold">
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
      </div>
    </div>
  )
}