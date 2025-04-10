import type { EachRoute } from '@/lib/routes-config'
import type { LessonNavigation } from './course-type'

/**
 * Creates metadata for course navigation
 */
export function createCourseMetaData(course: any): EachRoute {
  return {
    id: course.id,
    href: `/courses/${course.id}`,
    title: course.title,
    noLink: true,
    items: course.modules.map((module: any) => ({
      id: module.id,
      href: `/chapter/${module.id}`,
      title: module.title,
      noLink: true,
      items: module.lessons.map((lesson: any) => ({
        id: lesson.id,
        title: lesson.title,
        href: `/lessons/${lesson.id}`,
      })),
    })),
  }
}

/**
 * Finds previous and next lessons for navigation
 */
export function findPrevNextLesson(
  course: any,
  lessonId: number,
  courseId: number,
  moduleId: number,
): LessonNavigation {
  const allLessons = []

  // Flatten all lessons into one array
  for (const currentModule of course.modules) {
    for (const lesson of currentModule.lessons) {
      allLessons.push(lesson)
    }
  }

  // Find index of the current lesson
  const currentIndex = allLessons.findIndex((lesson) => lesson.id === lessonId)

  if (currentIndex === -1) {
    return { prev: null, next: null } // not found
  }

  // Get previous lesson info
  const prev =
    currentIndex > 0
      ? {
          href: `/courses/${courseId}/chapter/${moduleId}/lessons/${allLessons[currentIndex - 1].id}`,
          title: allLessons[currentIndex - 1].title || '',
        }
      : null

  // Get next lesson info
  const next =
    currentIndex < allLessons.length - 1
      ? {
          href: `/courses/${courseId}/chapter/${moduleId}/lessons/${allLessons[currentIndex + 1].id}`,
          title: allLessons[currentIndex + 1].title || '',
        }
      : null

  return { prev, next }
}
