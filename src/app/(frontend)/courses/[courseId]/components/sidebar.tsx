'use client'

import * as React from 'react'
import {
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Menu,
  PlayCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

type Lesson = {
  lessonId: number
  lessonTitle: string
}

type Module = {
  moduleId: number
  moduleTitle: string
  lessons: Lesson[]
}

type Course = {
  id: number
  title: string
  progress: number
  modules: Module[]
}

interface CourseSidebarProps {
  courseMetaData: Course[]
  setActiveLesson: (lessonId: string) => void
  activeLesson: string
  isOpen: boolean
}

export function CourseSidebar({
  courseMetaData,
  setActiveLesson,
  activeLesson,
  isOpen,
}: CourseSidebarProps) {
  const [progressValue, setProgressValue] = React.useState(0)
  const [mobileExpanded, setMobileExpanded] = React.useState(false)

  // Animate progress value on mount
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setProgressValue(courseMetaData.progress)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const toggleMobileExpanded = () => {
    setMobileExpanded((prev) => !prev)
  }

  // Update the component to use Tailwind 4 compatible classes
  return (
    <>
      {/* Mobile bottom sidebar */}
      <div className="md:hidden order-2 border-t w-full">
        {/* Mobile sidebar header - always visible */}
        <div
          className="flex items-center justify-between p-3 cursor-pointer"
          onClick={toggleMobileExpanded}
        >
          <div className="flex items-center gap-2">
            <div className="flex aspect-square h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GraduationCap className="h-4 w-4" />
            </div>
            <div className="flex flex-col gap-0.5 text-left">
              <span className="font-semibold text-sm">{courseMetaData.title}</span>
              <div className="flex items-center gap-2">
                <Progress value={progressValue} className="h-1.5 w-24" />
                <span className="text-xs text-muted-foreground">{progressValue}%</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="p-1 h-auto cursor-pointer">
            {mobileExpanded ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronUp className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Expandable content */}
        {mobileExpanded && (
          <div className="max-h-[50vh] overflow-y-auto border-t">
            <div className="p-2">
              {courseMetaData.modules.map((module, index) => (
                <Collapsible key={module.title} defaultOpen={index === 0} className="mb-2">
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="cursor-pointer w-full justify-start font-medium text-sm"
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      <span className="truncate">{module.title}</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180 flex-shrink-0" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="ml-4 pl-4 border-l space-y-1">
                      {module.lessons.map((lesson) => (
                        <Button
                          key={lesson.id}
                          variant={activeLesson === lesson.id ? 'secondary' : 'ghost'}
                          className="w-full justify-start text-xs cursor-pointer"
                          onClick={() => {
                            setActiveLesson(lesson.id)
                            setMobileExpanded(false) // Close sidebar after selection on mobile
                          }}
                        >
                          <div className="flex items-center w-full">
                            {lesson.completed ? (
                              <div className="mr-2 h-3 w-3 rounded-full bg-green-500 flex items-center justify-center">
                                <Check className="h-2 w-2 text-white" />
                              </div>
                            ) : (
                              <PlayCircle className="mr-2 h-3 w-3 flex-shrink-0" />
                            )}
                            <span className="truncate">{lesson.title}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <div
        className={`hidden md:block border-r h-[calc(100vh-4rem)] bg-white ${isOpen ? 'w-64' : 'w-0'} 
                     transition-all duration-300 overflow-hidden flex-col sticky top-16 order-1`}
      >
        {/* Header */}
        <div className="border-b">
          <div className="flex items-center gap-2 p-4">
            <div className="flex aspect-square h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="flex flex-col gap-0.5 text-left">
              <span className="font-semibold">{courseMetaData.title}</span>
              <span className="text-xs text-muted-foreground">Progress: {progressValue}%</span>
            </div>
          </div>
          <div className="px-4 pb-2">
            <Progress value={progressValue} className="h-2" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-2">
          {courseMetaData.modules.map((module, index) => (
            <Collapsible key={module.id} defaultOpen={index === 0} className="px-2 mb-2">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-start font-medium cursor-pointer">
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span className="truncate">{module.title}</span>
                  <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180 flex-shrink-0" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="ml-4 pl-4 border-l space-y-1">
                  {module.lessons.map((lesson) => (
                    <Button
                      key={lesson.id}
                      variant={activeLesson === lesson.id ? 'secondary' : 'ghost'}
                      className="w-full justify-start text-sm cursor-pointer"
                      onClick={() => {
                        setActiveLesson(lesson.id)
                        setMobileExpanded(false) // Close sidebar after selection on mobile
                      }}
                    >
                      <div className="flex items-center w-full">
                        {lesson.completed ? (
                          <div className="mr-2 h-4 w-4 rounded-full bg-green-500 flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        ) : (
                          <PlayCircle className="mr-2 h-4 w-4 flex-shrink-0" />
                        )}
                        <span className="truncate">{lesson.title}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    </>
  )
}
