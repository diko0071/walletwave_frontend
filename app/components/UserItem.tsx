'use client'
import {
    Avatar,
    AvatarFallback,
} from "@/components/ui/avatar"

export default function UserItem() {
  return <div className="flex items-center justify-between gap-2 border rounded-[8px] p-2">
    <div>
        <Avatar>
            <AvatarFallback className="rounded-full bg-black flex items-center justify-center text-white font-[700] font-medium">
                DK
            </AvatarFallback>
        </Avatar>
    </div>
    <div className="grow">
        <p className="text-[16px] font-bold">Dmitry Korzhov</p>
        <p className="text-[12px] text-neutral-500">korzhov.work2019@gmail.com</p>
    </div>
  </div>
}