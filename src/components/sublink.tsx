'use client'

import type { EachRoute } from '@/lib/routes-config'
import Anchor from './anchor'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import { SheetClose } from '@/components/ui/sheet'
import { ChevronDown, ChevronRight, CheckCircle, Circle, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import type { LearningStatus } from '@/lib/course/progress-utils'

export default function SubLink({
  title,
  href,
  items,
  noLink,
  level,
  isSheet,
  tag,
  status,
}: EachRoute & { level: number; isSheet: boolean; status?: LearningStatus }) {
  const path = usePathname()
  const [isOpen, setIsOpen] = useState(level == 0)

  useEffect(() => {
    if (path == href || path.includes(href)) setIsOpen(true)
  }, [href, path])

  // Status icon based on completion status
  const StatusIcon = () => {
    if (!status || items?.length) return null // Only show status for lessons (no items)

    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500 ml-2 flex-shrink-0" />
      case 'in_progress':
        return <Clock className="h-4 w-4 text-amber-500 ml-2 flex-shrink-0" />
      default:
        return <Circle className="h-4 w-4 text-gray-300 ml-2 flex-shrink-0" />
    }
  }

  const Comp = (
    <div className="flex items-center">
      <Anchor
        activeClassName="text-primary dark:font-medium font-semibold"
        href={href}
        className="flex-grow overflow-hidden text-ellipsis"
      >
        {title}
        {tag && (
          <span className="dark:bg-blue-700 bg-blue-500 rounded-md px-1.5 py-0.5 mx-2 text-xs text-white !font-normal">
            {tag}
          </span>
        )}
      </Anchor>
      <StatusIcon />
    </div>
  )

  const titleOrLink = !noLink ? (
    isSheet ? (
      <SheetClose asChild>{Comp}</SheetClose>
    ) : (
      Comp
    )
  ) : (
    <div className="flex items-center">
      <h4 className="font-medium sm:text-sm text-primary flex-grow">
        {title}
        {tag && (
          <span className="dark:bg-blue-700 bg-blue-500 rounded-md px-1.5 py-0.5 mx-2 text-xs text-white !font-normal">
            {tag}
          </span>
        )}
      </h4>
      <StatusIcon />
    </div>
  )

  if (!items) {
    return <div className="flex flex-col">{titleOrLink}</div>
  }

  // For modules, we can show a progress indicator based on the number of completed lessons
  const ModuleProgress = () => {
    if (!items || level !== 1) return null // Only show for modules (level 1)

    const completedCount = items.filter((item) => item.status === 'completed').length
    const totalCount = items.length
    const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

    return (
      <div className="flex items-center gap-2 ml-2">
        <div className="h-1.5 w-16 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full',
              percentage === 100 ? 'bg-green-500' : percentage > 0 ? 'bg-amber-500' : 'bg-gray-300',
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground">{percentage}%</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1 w-full">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full pr-5">
          <div className="flex items-center justify-between cursor-pointer w-full">
            <span className="w-[95%] overflow-hidden text-ellipsis text-start flex items-center">
              {titleOrLink}
              {level === 1 && <ModuleProgress />}
            </span>
            <span className="sm:ml-0 -mr-1.5 flex-shrink-0">
              {!isOpen ? (
                <ChevronRight className="h-[0.9rem] w-[0.9rem]" />
              ) : (
                <ChevronDown className="h-[0.9rem] w-[0.9rem]" />
              )}
            </span>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div
            className={cn(
              'flex flex-col items-start sm:text-sm dark:text-stone-300/85 text-stone-800 ml-0.5 mt-2.5 gap-3',
              level > 0 && 'pl-4 border-l ml-1.5',
            )}
          >
            {items?.map((innerLink) => {
              const modifiedItems = {
                ...innerLink,
                href: `${href + innerLink.href}`,
                level: level + 1,
                isSheet,
              }
              return <SubLink key={modifiedItems.href} {...modifiedItems} />
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
