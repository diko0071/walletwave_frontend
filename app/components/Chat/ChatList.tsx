import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'

export interface ChatList {
  isShared: boolean
}

export function ChatList() {

  return (
    <div className="relative mx-auto max-w-2xl px-4">

        <>
          <div className="group relative mb-4 flex items-start md:-ml-12">
            <div className="bg-background flex size-[25px] shrink-0 select-none items-center justify-center rounded-md border shadow-sm">
              <ExclamationTriangleIcon />
            </div>
            <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
            </div>
          </div>
          <Separator className="my-4" />
        </>
    </div>
  )
}