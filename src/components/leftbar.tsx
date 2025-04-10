import { ScrollArea } from '@/components/ui/scroll-area'
import CourseMenu from './course-menu'
import type { NavBarProps } from '@/context/navbar-setup'

export function Leftbar({ data, progress }: NavBarProps) {
  return (
    <aside className="md:flex hidden w-[20rem] sticky top-16 flex-col h-[93.75vh] overflow-y-auto">
      <ScrollArea className="py-4 px-2">
        {data && <CourseMenu data={data} progress={progress} />}
      </ScrollArea>
    </aside>
  )
}
