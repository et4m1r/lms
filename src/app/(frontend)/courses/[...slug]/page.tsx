import { notFound } from 'next/navigation'
import { payload } from '@/lib/payload'
import type { Lesson } from '@/payload-types'
import ClientNavigationSetup from '@/context/navbar-setup'
import { Leftbar } from '@/components/leftbar'
import CourseContent from './course-content'
import { createCourseMetaData } from '@/lib/course/course-utils'
import { fetchCourseProgress } from '@/lib/course/progress-utils'
import { checkCourseAccess } from '@/lib/course/access-control'
import { NoAccess } from '@/components/course/no-access'
import type { EachRoute } from '@/lib/routes-config'

type PageProps = {
  params: Promise<{ slug: string[] }>
}

export default async function CoursePage(props: PageProps) {
  const params = await props.params
  const { slug = [] } = params

  // Parse IDs from the URL
  const { courseId, lessonId, moduleId } = parseSlug(slug)

  if (!courseId) {
    return notFound()
  }

  // Fetch course data
  const course = await fetchCourse(courseId)

  if (!course) {
    return notFound()
  }

  // Check if the user has access to this course
  const accessCheck = await checkCourseAccess(courseId)

  // Fetch course progress data
  const progress = await fetchCourseProgress(courseId)

  // Create metadata for sidebar navigation
  const courseMetaData: EachRoute = createCourseMetaData(course)

  // Get the first lesson if none is specified
  const currentLessonId = lessonId || course.modules[0]?.lessons[0]?.id
  const currentModuleId = moduleId || course.modules[0]?.id

  if (!currentLessonId) {
    return notFound()
  }

  // Only fetch lesson data if the user has access
  let lesson = null
  if (accessCheck.hasAccess) {
    lesson = await fetchLesson(currentLessonId)
    if (!lesson) {
      return notFound()
    }
  }

  return (
    <div className="flex items-start gap-8">
      <ClientNavigationSetup navbarProps={{ data: courseMetaData, progress }} />{' '}
      <Leftbar key="leftbar" data={courseMetaData} progress={progress} />
      <div className="flex-[5.25]">
        {accessCheck.hasAccess && lesson ? (
          <CourseContent
            lesson={lesson}
            course={course}
            courseId={courseId}
            lessonId={currentLessonId}
            moduleId={currentModuleId}
          />
        ) : (
          <NoAccess
            message={
              accessCheck.message || 'Oops! It looks like you haven’t unlocked this course yet.'
            }
          />
        )}
      </div>
    </div>
  )
}

// Helper functions
function parseSlug(slug: string[]) {
  let courseId: number | undefined
  let lessonId: number | undefined
  let moduleId: number | undefined

  if (slug.length === 1) {
    courseId = Number(slug[0])
  } else if (slug.length === 5 && slug[3] === 'lessons') {
    courseId = Number(slug[0])
    lessonId = Number(slug[4])
    moduleId = Number(slug[2])
  }

  return { courseId, lessonId, moduleId }
}

async function fetchCourse(courseId: number) {
  try {
    return await payload.findByID({
      collection: 'courses',
      id: courseId,
    })
  } catch (error) {
    console.error('Error fetching course:', error)
    return null
  }
}

async function fetchLesson(lessonId: number): Promise<Lesson | null> {
  try {
    return await payload.findByID({
      collection: 'lessons',
      id: lessonId,
    })
  } catch (error) {
    console.error('Error fetching lesson:', error)
    return null
  }
}
