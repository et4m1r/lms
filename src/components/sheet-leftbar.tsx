import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { AlignLeftIcon } from 'lucide-react'
import { DialogTitle } from '@/components/ui/dialog'
import { Logo, NavMenu } from '@/components/navbar'
import type { NavBarProps } from '@/context/navbar-setup'
import CourseMenu from './course-menu'

export function SheetLeftbar({ data, progress }: NavBarProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden flex">
          <AlignLeftIcon />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-4 px-0" side="left">
        <DialogTitle className="sr-only">Menu</DialogTitle>
        <SheetHeader>
          <SheetClose className="px-5" asChild>
            <Logo />
          </SheetClose>
        </SheetHeader>
        <div className="flex flex-col gap-4 overflow-y-auto">
          <div className="flex flex-col gap-2.5 mt-3 mx-2 px-5">
            <NavMenu isSheet />
          </div>
          <div className="ml-2 pl-5">
            {data && <CourseMenu isSheet data={data} progress={progress} />}
          </div>
          <div className="p-6 pb-4 flex gap-2.5">{/*<FooterButtons />*/}</div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
