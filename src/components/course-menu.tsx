'use client'

import type { EachRoute } from '@/lib/routes-config'
import SubLink from './sublink'
import type { CourseProgress } from '@/lib/course/progress-utils'

interface CourseMenuProps {
  data: EachRoute
  isSheet?: boolean
  progress?: CourseProgress | null
}

export default function CourseMenu({ data, isSheet = false, progress }: CourseMenuProps) {
  // Process the data to include progress information
  const processRouteWithProgress = (route: EachRoute): EachRoute => {
    // Process module items
    const processedItems = route.items?.map((moduleItem) => {
      // Find module progress
      const moduleId = Number(moduleItem.id)
      const moduleProgress = progress?.modules.find((m) => m.moduleId === moduleId)
      const moduleStatus = moduleProgress?.status || 'not_started'

      // Process lesson items
      const processedLessons = moduleItem.items?.map((lessonItem) => {
        const lessonId = Number(lessonItem.id)
        const lessonProgress = moduleProgress?.lessons.find((l) => l.lessonId === lessonId)
        const lessonStatus = lessonProgress?.status || 'not_started'

        return {
          ...lessonItem,
          status: lessonStatus,
        }
      })

      return {
        ...moduleItem,
        status: moduleStatus,
        items: processedLessons,
      }
    })

    return {
      ...route,
      items: processedItems,
    }
  }

  const processedData = processRouteWithProgress(data)

  return (
    <div className="flex flex-col gap-3.5 mt-5 pr-2 pb-6 sm:text-base text-[14.5px]">
      {[processedData].map((item, index) => {
        const modifiedItems = {
          ...item,
          href: `${item.href}`,
          level: 0,
          isSheet,
        }
        return <SubLink key={item.title + index} {...modifiedItems} />
      })}
    </div>
  )
}
