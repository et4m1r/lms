'use client'

import { EachRoute } from '@/lib/routes-config'
import SubLink from './sublink'

interface CourseMenuProps {
  data: EachRoute
  isSheet?: boolean
}

export default function CourseMenu({ data, isSheet = false }: CourseMenuProps) {
  return (
    <div className="flex flex-col gap-3.5 mt-5 pr-2 pb-6 sm:text-base text-[14.5px]">
      {[data].map((item, index) => {
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
