'use client'
import { ModeToggle } from '@/components/theme-toggle'
import { StarsIcon } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from './ui/button'
import Anchor from './anchor'
import { SheetLeftbar } from './leftbar'
import { SheetClose } from '@/components/ui/sheet'
import { signOut } from 'next-auth/react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export const NAVLINKS = [
  {
    title: 'Courses',
    href: '/courses',
  },
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
]

export type User =
  | {
      name?: string | null
      email?: string | null
      image?: string | null
    }
  | null
  | undefined

export function Navbar({ user }: { user: User }) {
  return (
    <nav className="w-full border-b h-16 sticky top-0 z-50 bg-background">
      <div className="sm:container mx-auto w-[95vw] h-full flex items-center sm:justify-between md:gap-2">
        <div className="flex items-center sm:gap-5 gap-2.5">
          <SheetLeftbar />
          <div className="flex items-center gap-6">
            <div className="lg:flex hidden">
              <Logo />
            </div>
            <div className="md:flex hidden items-center gap-4 text-sm font-medium text-muted-foreground">
              <NavMenu />
            </div>
          </div>
        </div>
        <div className="flex items-center sm:justify-normal justify-between sm:gap-3 ml-1 sm:w-fit w-[90%]">
          <div className="flex items-center justify-between sm:gap-2">
            <div className="flex ml-4 sm:ml-0">
              {user && user.name && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer">
                      {user.image ? (
                        <AvatarImage src={user.image} alt={user.name} />
                      ) : (
                        <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                      )}
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="px-4 py-2">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {/* Add user email or other info here if available */}
                      </div>
                    </div>
                    <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {!user && (
                <Link href="/login" className={buttonVariants({ variant: 'ghost' })}>
                  Log In
                </Link>
              )}
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <StarsIcon className="w-6 h-6 text-muted-foreground" strokeWidth={2} />
      <h2 className="text-md font-bold font-code">lms</h2>
    </Link>
  )
}

export function NavMenu({ isSheet = false }) {
  return (
    <>
      {NAVLINKS.map((item) => {
        const Comp = (
          <Anchor
            key={item.title + item.href}
            activeClassName="!text-primary dark:font-medium font-semibold"
            absolute
            className="flex items-center gap-1 sm:text-sm text-[14.5px] dark:text-stone-300/85 text-stone-800"
            href={item.href}
          >
            {item.title}
          </Anchor>
        )
        return isSheet ? (
          <SheetClose key={item.title + item.href} asChild>
            {Comp}
          </SheetClose>
        ) : (
          Comp
        )
      })}
    </>
  )
}
