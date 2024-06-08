'use client'

import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { GitHubLogoIcon, NotionLogoIcon } from "@radix-ui/react-icons";
import {
  Wallet
} from "lucide-react"
import { buttonVariants } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  {
    href: "#features",
    label: "Features",
  },
  {
    href: "#testimonials",
    label: "Testimonials",
  },
  {
    href: "#pricing",
    label: "Pricing",
  },
  {
    href: "#faq",
    label: "FAQ",
  },
];

export const Navbar = () => {
  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between ">
          <NavigationMenuItem className="font-semibold flex items-center">
            <a
              rel="noreferrer noopener"
              href="/"
              className="ml-2 text-lg flex items-center"
            >
              <Wallet className="w-5 h-5" />
              <p className="ml-2 text-sm">WalletWave</p>
            </a>
          </NavigationMenuItem>

          <div className="flex gap-2">
            <a
              rel="noreferrer noopener"
              href="https://github.com/leoMirandaa/shadcn-landing-page.git"
              target="_blank"
              className={`border ${buttonVariants({ variant: "secondary" })}`}
            >
              <GitHubLogoIcon className="mr-2 w-5 h-5" />
              GitHub
            </a>
            <a
              rel="noreferrer noopener"
              href="https://dkorzhov.notion.site/WalletWave-a2d42b3157604dce833539da26d2663f?pvs=4"
              target="_blank"
              className={`border ${buttonVariants({ variant: "secondary" })}`}
            >
              <NotionLogoIcon className="mr-2 w-5 h-5" />
              Website
            </a>
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};