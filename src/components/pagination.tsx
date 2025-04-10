'use client'

import type React from 'react'

import { ChevronLeftIcon, ChevronRightIcon, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from './ui/button'
import { Button } from './ui/button'
import { markLessonCompleted } from '@/actions/update-progress'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export interface PaginationProps {
  prev?: {
    href: string | null
    title: string
  } | null
  next?: {
    href: string | null
    title: string
  } | null
  courseId?: number
  moduleId?: number
  lessonId?: number
}

export default function Pagination({ prev, next, courseId, moduleId, lessonId }: PaginationProps) {
  const router = useRouter()
  const [isCompleting, setIsCompleting] = useState(false)

  // Function to mark the current lesson as complete
  const handleMarkComplete = async () => {
    if (!courseId || !moduleId || !lessonId) return

    setIsCompleting(true)
    try {
      await markLessonCompleted(courseId, moduleId, lessonId)
    } finally {
      setIsCompleting(false)
    }
  }

  // Function to mark as complete and navigate to next lesson
  const handleNextAndComplete = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!courseId || !moduleId || !lessonId || !next?.href) return

    e.preventDefault()
    setIsCompleting(true)

    try {
      await markLessonCompleted(courseId, moduleId, lessonId)
      router.push(next.href)
    } finally {
      setIsCompleting(false)
    }
  }

  return (
    <div className="grid grid-cols-3 flex-grow sm:py-10 sm:py-7 py-4 pt-5 gap-5">
      {/* Previous button */}
      <div>
        {prev && prev.href && (
          <Link
            className={buttonVariants({
              variant: 'outline',
              className:
                'no-underline w-full flex flex-col sm:pl-7 pl-3 sm:py-10 py-8 !items-start text-xs sm:text-sm',
            })}
            href={`${prev.href}`}
          >
            <span className="flex items-center text-muted-foreground text-xs">
              <ChevronLeftIcon className="w-[1rem] h-[1rem] mr-1" />
              Previous
            </span>
            <span className="mt-1 ml-1">{prev.title}</span>
          </Link>
        )}
      </div>

      {/* Mark as Complete button */}
      <div className="flex items-center justify-center">
        {courseId && moduleId && lessonId && (
          <Button
            className={buttonVariants({
              variant: 'default',
              className:
                'no-underline w-full flex flex-col sm:pr-7 pr-3 sm:py-10 py-8 !items-end text-xs sm:text-sm',
            })}
            onClick={handleMarkComplete}
            disabled={isCompleting}
          >
            <span className="flex items-center text-muted-background text-xs">
              <CheckCircle className="w-[1rem] h-[1rem] mr-1" />
              {isCompleting ? 'Marking...' : 'Mark as Complete'}
            </span>
          </Button>
        )}
      </div>

      {/* Next button */}
      <div>
        {next && next.href && (
          <Link
            className={buttonVariants({
              variant: 'outline',
              className:
                'no-underline w-full flex flex-col sm:pr-7 pr-3 sm:py-10 py-8 !items-end text-xs sm:text-sm',
            })}
            href={`${next.href}`}
            onClick={courseId && moduleId && lessonId ? handleNextAndComplete : undefined}
          >
            <span className="flex items-center text-muted-foreground text-xs">
              Next
              <ChevronRightIcon className="w-[1rem] h-[1rem] ml-1" />
            </span>
            <span className="mt-1 mr-1">{next.title}</span>
          </Link>
        )}
      </div>
    </div>
  )
}
