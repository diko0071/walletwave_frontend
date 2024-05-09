import { Button } from "@/components/ui/button"
import { MagicWandIcon, Pencil1Icon, HandIcon } from '@radix-ui/react-icons'

export function InputWithButton() {
    return (
      <div className="w-full px-1">
        <div className="flex items-center space-x-3 p-3 w-3/4 ml-auto">
          <div className="flex-grow flex items-center space-x-3 h-12 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300">
            <Pencil1Icon className="text-slate-400 h-4 w-4" /> 
            <input type="text" placeholder="Type your transactions..." className="flex-grow bg-transparent outline-none placeholder:text-slate-400 text-sm" />
          </div>
          <Button type="submit" className="flex items-center space-x-2 border text-sm">
            <MagicWandIcon className="h-3 w-3" />
            <span>Add with AI</span>
          </Button>
          <Button type="button" className="flex items-center space-x-2 border text-sm">
            <HandIcon className="h-3 w-3" />
            <span>Add Manually</span>
          </Button>
        </div>
      </div>
    )
  }