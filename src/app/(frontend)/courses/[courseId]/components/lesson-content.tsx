'use client'
import { Lesson } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { RichText } from '@payloadcms/richtext-lexical/react'

interface LessonContentProps {
  lesson: Lesson
}

export function LessonContent({ lesson }: LessonContentProps) {
  return (
    <div className="p-6 h-[calc(100vh-4rem-56px)] md:h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{lesson.title}</h1>
        <p className="mt-2 text-muted-foreground">{lesson.description}</p>
      </div>

      {/* Main lesson content */}
      <div className="prose prose-slate dark:prose-invert max-w-none mb-8">
        <RichText data={lesson.content} />
      </div>

      {/* Navigation controls */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-6 pb-12 md:pb-0">
        <Button variant="outline" size="sm">
          Previous Lesson
        </Button>
        <Button size="sm">Next Lesson</Button>
      </div>
    </div>
  )
}
