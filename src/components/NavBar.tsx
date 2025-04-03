'use client'
import Link from 'next/link'
import { Bell, Home, Menu, Search, Settings, User } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

interface TopNavbarProps {
}

export function TopNavbar() {
  return (
    <div className="border-b z-20 bg-white">
      <div className="mx-auto h-16 w-full max-w-5xl flex items-center px-4">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] sm:w-[300px]">
            <div className="flex flex-col gap-6 py-4">
              <div className="flex items-center gap-2 font-semibold">
                <Home className="h-5 w-5" />
                <span>Learning Platform</span>
              </div>
              <nav className="flex flex-col space-y-3">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
                >
                  Home
                </Link>
                <Link
                  href="/courses"
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  My Courses
                </Link>
                <Link
                  href="/catalog"
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Course Catalog
                </Link>
                <Link
                  href="/calendar"
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Calendar
                </Link>
              </nav>
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <div className="flex items-center gap-2 font-semibold">
          <Home className="h-5 w-5" />
          <span className="hidden sm:inline">Learning Platform</span>
        </div>

        {/* Desktop navigation */}
        <nav className="mx-6 hidden md:flex items-center space-x-4 lg:space-x-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link
            href="/courses"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            My Courses
          </Link>
          <Link
            href="/catalog"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Course Catalog
          </Link>
          <Link
            href="/calendar"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Calendar
          </Link>
        </nav>

        <div className="ml-auto flex items-center space-x-4">
          {/* Desktop search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search courses..."
              className="w-[200px] pl-8 md:w-[200px] lg:w-[300px]"
            />
          </div>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-primary"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">John Doe</p>
                  <p className="text-xs leading-none text-muted-foreground">student@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
