'use client'

import { cn } from '../../lib/utils'
import { useEffect, useState, useRef } from 'react'
import ChatPanel from './ChatWithHistory'

export function Chat() {

  return (
    <div>
        <ChatPanel />
    </div>
  )
}