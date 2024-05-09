'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { resetAuthCookies } from '../lib/actions';
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const LogoutButton = React.forwardRef((props, ref) => {
  const router = useRouter();
  
  const submitLogout = async () => {
    resetAuthCookies();
    router.push('/login');
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={submitLogout}
          variant="ghost"
          size="icon"
          className="mt-auto rounded-lg"
          aria-label="Logout"
        >
          <LogOut className="size-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={5}>
        Logout
      </TooltipContent>
    </Tooltip>
  );
});

export default LogoutButton;