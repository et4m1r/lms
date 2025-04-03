'use client'

import { Course, Module, Lesson } from '@/payload-types'
import { CourseSidebar } from './sidebar'
import { LessonContent } from './lesson-content'
import React from 'react'

interface CourseViewProps {
  course: Course
}

type LessonSimple = {
  id: number
  title: string
}

type ModuleSimple = {
  id: number
  title: string
  lessons: LessonSimple[]
}

type CourseSimple = {
  id: number
  title: string
  progress: number
  modules: ModuleSimple[]
}
export const CourseView: React.FC<CourseViewProps> = ({ course }) => {
  const transformToCourseMetaData = (data: any): CourseSimple => {
    return {
      id: data.id,
      title: data.title,
      progress: 0, // Assuming progress is initially 0; modify as needed
      modules: data.modules.map((module: any) => ({
        id: module.id,
        title: module.title,
        lessons: module.lessons.map((lesson: any) => ({
          id: lesson.id,
          title: lesson.title,
        })),
      })),
    }
  }

  const courseMetaData: CourseSimple = transformToCourseMetaData(course)

  const [activeLesson, setActiveLesson] = React.useState(
    // @ts-ignore
    (course.modules[0] as Module).lessons[0].id,
  )

  const findLessonById = (lessonId: number): Lesson | null => {
    const modules = course.modules as Module[]

    return (
      modules
        .map((module) => (module.lessons as Lesson[]).find((lesson) => lesson.id === lessonId))
        .find((lesson) => lesson !== undefined) || null
    )
  }

  const lesson = findLessonById(activeLesson) // Replace 3 with the desired lesson ID

  // const [activeLesson, setActiveLesson] = useState('introduction')
  // const [sidebarOpen, setSidebarOpen] = useState(true)
  //
  // const toggleSidebar = () => setSidebarOpen((prev) => !prev)
  const sidebarOpen = true

  return (
    <div className="mx-auto w-full max-w-5xl bg-white shadow-sm">
      {/* Flex column on mobile, row on desktop */}
      <div className="flex flex-col md:flex-row relative">
        {/* Main content - full width on mobile */}
        <main className="flex-1 overflow-y-auto order-1 md:order-2 border-l-0 md:border-l">
          <LessonContent lesson={lesson as Lesson} />
        </main>
        {/*Sidebar - bottom on mobile, left on desktop*/}
        <CourseSidebar
          courseMetaData={courseMetaData}
          setActiveLesson={setActiveLesson}
          activeLesson={activeLesson}
          isOpen={sidebarOpen}
        />
      </div>
    </div>
  )
}
