'use client'

import { cn } from '../../lib/utils'
import { ChatList } from './ChatList'

import { useEffect, useState, useRef } from 'react'

  export function Chat() {
  
    return (
      <div
        className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]"
      >
        <div
          className={cn('pb-[200px] pt-4 md:pt-10')}
        >
          <ChatList />
        </div>
      </div>
    )
  }