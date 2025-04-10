import { payload } from '@/lib/payload'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Lesson, Module } from '@/payload-types'

export type LearningStatus = 'not_started' | 'in_progress' | 'completed'

export interface LessonProgress {
  lessonId: number
  status: LearningStatus
  lastAccessed?: string
  completedAt?: string
  timeSpent?: number
}

export interface ModuleProgress {
  moduleId: number
  status: LearningStatus
  progress: number
  lessons: LessonProgress[]
}

export interface CourseProgress {
  courseId: number
  status: LearningStatus
  overallProgress: number
  modules: ModuleProgress[]
}

/**
 * Fetches progress data for the current user and course
 * Creates a new progress record if one doesn't exist
 */
export async function fetchCourseProgress(courseId: number): Promise<CourseProgress | null> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return null
    }

    const userId = Number(session.user.id)

    // Get the course data to build the initial progress structure
    const course = await payload.findByID({
      collection: 'courses',
      id: courseId,
      depth: 2,
    })

    if (!course || !course.modules) {
      return null
    }

    // Find progress record for this student and course
    const progressData = await payload.find({
      collection: 'progress',
      where: {
        and: [{ student: { equals: userId } }, { course: { equals: courseId } }],
      },
      depth: 2, // Load related data
    })

    let progress

    // If no progress record exists, create one
    if (!progressData.docs || progressData.docs.length === 0) {
      // Create module progress entries for each module in the course
      const moduleProgress = course.modules.map((module: Module) => ({
        module: module.id,
        status: 'not_started' as LearningStatus,
        progress: 0,
      }))

      // Create lesson progress entries for each lesson in the course
      const lessonProgress = []
      for (const curModule of course.modules) {
        if (curModule.lessons && Array.isArray(curModule.lessons)) {
          for (const lesson of curModule.lessons) {
            lessonProgress.push({
              lesson: lesson.id,
              status: 'not_started',
              lastAccessed: new Date().toISOString(),
            })
          }
        }
      }

      // Create a new progress record
      const newProgress = await payload.create({
        collection: 'progress',
        data: {
          student: userId,
          course: courseId,
          status: 'not_started',
          overallProgress: 0,
          pointsEarned: 0,
          totalPoints: 0,
          startedAt: new Date().toISOString(),
          lastAccessed: new Date().toISOString(),
          moduleProgress,
          lessonProgress,
        },
      })

      // Fetch the newly created progress with related data
      // const newProgressData = await payload.findByID({
      //   collection: 'progress',
      //   id: newProgress.id,
      //   depth: 2,
      // })

      progress = newProgress
    } else {
      progress = progressData.docs[0]
    }

    // Process module progress data
    const moduleProgressMap = new Map<number, ModuleProgress>()

    if (progress.moduleProgress && Array.isArray(progress.moduleProgress)) {
      progress.moduleProgress.forEach((moduleProgress: any) => {
        if (moduleProgress.module) {
          moduleProgressMap.set(moduleProgress.module.id, {
            moduleId: moduleProgress.module.id,
            status: moduleProgress.status,
            progress: moduleProgress.progress,
            lessons: [],
          })
        }
      })
    }

    // Process lesson progress data
    const lessonStatusMap = new Map<number, LessonProgress>()

    // First check the lessonProgress array (new field)
    if (progress.lessonProgress && Array.isArray(progress.lessonProgress)) {
      progress.lessonProgress.forEach((lessonProgress: any) => {
        if (lessonProgress.lesson) {
          lessonStatusMap.set(lessonProgress.lesson.id, {
            lessonId: lessonProgress.lesson.id,
            status: lessonProgress.status,
            lastAccessed: lessonProgress.lastAccessed,
            completedAt: lessonProgress.completedAt,
            timeSpent: lessonProgress.timeSpent,
          })
        }
      })
    }

    // Then check quiz attempts for additional lesson status info
    if (progress.quizAttempts && Array.isArray(progress.quizAttempts)) {
      progress.quizAttempts.forEach((attempt: any) => {
        if (attempt.lesson) {
          // If there's a quiz attempt, the lesson is at least in progress
          // If score is good (e.g., > 70%), consider it completed
          const status: LearningStatus = attempt.score >= 70 ? 'completed' : 'in_progress'

          // Only update if the status is better than what we already have
          const existingProgress = lessonStatusMap.get(attempt.lesson.id)
          if (!existingProgress || existingProgress.status !== 'completed') {
            lessonStatusMap.set(attempt.lesson.id, {
              lessonId: attempt.lesson.id,
              status,
              completedAt: status === 'completed' ? attempt.completedAt : undefined,
              ...existingProgress,
            })
          }
        }
      })
    }
    // Build the complete progress structure
    const modules: ModuleProgress[] = []

    course.modules.forEach((module: Module) => {
      const moduleProgress = moduleProgressMap.get(module.id) || {
        moduleId: module.id,
        status: 'not_started' as LearningStatus,
        progress: 0,
        lessons: [],
      }

      if (module.lessons && Array.isArray(module.lessons)) {
        ;(module.lessons as Lesson[]).forEach((lesson: Lesson) => {
          moduleProgress.lessons.push(
            lessonStatusMap.get(lesson.id) || {
              lessonId: lesson.id,
              status: 'not_started' as LearningStatus,
            },
          )
        })
      }

      modules.push(moduleProgress)
    })

    return {
      courseId,
      status: progress.status as LearningStatus,
      overallProgress: progress.overallProgress,
      modules,
    }
  } catch (error) {
    console.error('Error fetching course progress:', error)
    return null
  }
}

//
// /**
//  * Gets the status of a specific lesson
//  */
// export function getLessonStatus(
//   progress: CourseProgress | null,
//   moduleId: number,
//   lessonId: number,
// ): LearningStatus {
//   if (!progress) return 'not_started'
//
//   const module = progress.modules.find((m) => m.moduleId === moduleId)
//   if (!module) return 'not_started'
//
//   const lesson = module.lessons.find((l) => l.lessonId === lessonId)
//   return lesson?.status || 'not_started'
// }
//
// /**
//  * Gets the status of a specific module
//  */
// export function getModuleStatus(progress: CourseProgress | null, moduleId: number): LearningStatus {
//   if (!progress) return 'not_started'
//
//   const module = progress.modules.find((m) => m.moduleId === moduleId)
//   return module?.status || 'not_started'
// }
//
/**
 * Updates the status of a specific lesson
 */
export async function updateLessonStatus(
  courseId: number,
  moduleId: number,
  lessonId: number,
  status: LearningStatus,
  userId?: string,
): Promise<boolean> {
  try {
    // Get user ID from session if not provided
    if (!userId) {
      const session = await getServerSession(authOptions)
      if (!session?.user?.id) {
        return false
      }
      userId = session.user.id
    }

    // Find progress record
    const progressData = await payload.find({
      collection: 'progress',
      where: {
        and: [{ student: { equals: userId } }, { course: { equals: courseId } }],
      },
    })

    if (progressData.docs.length === 0) {
      // Create new progress if none exists
      const newProgress = await payload.create({
        collection: 'progress',
        data: {
          student: userId,
          course: courseId,
          status: 'in_progress',
          overallProgress: 0,
          pointsEarned: 0,
          totalPoints: 0,
          startedAt: new Date().toISOString(),
          lastAccessed: new Date().toISOString(),
          moduleProgress: [
            {
              module: moduleId,
              status: 'in_progress',
              progress: 0,
            },
          ],
          lessonProgress: [
            {
              lesson: lessonId,
              status,
              lastAccessed: new Date().toISOString(),
              completedAt: status === 'completed' ? new Date().toISOString() : undefined,
            },
          ],
        },
      })

      return true
    }

    // Update existing progress
    const progressId = progressData.docs[0].id
    const existingProgress = progressData.docs[0]

    // Check if this lesson already has progress
    const existingLessonProgress = existingProgress.lessonProgress?.find(
      (lp: any) => lp.lesson === lessonId || lp.lesson?.id === lessonId,
    )

    let updatedLessonProgress

    if (existingLessonProgress) {
      // Update existing lesson progress
      updatedLessonProgress = existingProgress.lessonProgress.map((lp: any) => {
        if (lp.lesson === lessonId || lp.lesson?.id === lessonId) {
          return {
            ...lp,
            status,
            lastAccessed: new Date().toISOString(),
            completedAt: status === 'completed' ? new Date().toISOString() : lp.completedAt,
          }
        }
        return lp
      })
    } else {
      // Add new lesson progress
      updatedLessonProgress = [
        ...(existingProgress.lessonProgress || []),
        {
          lesson: lessonId,
          status,
          lastAccessed: new Date().toISOString(),
          completedAt: status === 'completed' ? new Date().toISOString() : undefined,
        },
      ]
    }

    // Update the progress record
    await payload.update({
      collection: 'progress',
      id: progressId,
      data: {
        lastAccessed: new Date().toISOString(),
        lessonProgress: updatedLessonProgress,
      },
    })

    // Update module progress if needed
    await updateModuleProgress(courseId, moduleId, userId)

    return true
  } catch (error) {
    console.error('Error updating lesson status:', error)
    return false
  }
}

/**
 * Updates the progress of a module based on lesson completion
 */
async function updateModuleProgress(
  courseId: number,
  moduleId: number,
  userId: string,
): Promise<void> {
  try {
    // Get the module to find all its lessons
    const c_module = await payload.findByID({
      collection: 'modules',
      id: moduleId,
      depth: 1,
    })

    if (!c_module || !c_module.lessons || !Array.isArray(c_module.lessons)) {
      return
    }

    // Get progress record
    const progressData = await payload.find({
      collection: 'progress',
      where: {
        and: [{ student: { equals: userId } }, { course: { equals: courseId } }],
      },
      depth: 2,
    })

    if (progressData.docs.length === 0) {
      return
    }

    const progress = progressData.docs[0]

    // Count completed lessons
    let completedLessons = 0
    const totalLessons = c_module.lessons.length

    for (const lesson of c_module.lessons) {
      const lessonId = typeof lesson === 'object' ? lesson.id : lesson
      const lessonProgress = progress.lessonProgress?.find(
        (lp: any) => lp.lesson.id === lessonId || lp.lesson === lessonId,
      )

      if (lessonProgress && lessonProgress.status === 'completed') {
        completedLessons++
      }
    }

    // Calculate module progress percentage
    const moduleProgressPercentage =
      totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

    // Determine module status
    let moduleStatus: LearningStatus = 'not_started'
    if (completedLessons === totalLessons && totalLessons > 0) {
      moduleStatus = 'completed'
    } else if (completedLessons > 0) {
      moduleStatus = 'in_progress'
    }

    // Update module progress
    const existingModuleProgress = progress.moduleProgress?.find(
      (mp: any) => mp.module.id === moduleId || mp.module === moduleId,
    )

    let updatedModuleProgress

    if (existingModuleProgress) {
      updatedModuleProgress = progress.moduleProgress.map((mp: any) => {
        if (mp.module.id === moduleId || mp.module === moduleId) {
          return {
            ...mp,
            status: moduleStatus,
            progress: moduleProgressPercentage,
          }
        }
        return mp
      })
    } else {
      updatedModuleProgress = [
        ...(progress.moduleProgress || []),
        {
          module: moduleId,
          status: moduleStatus,
          progress: moduleProgressPercentage,
        },
      ]
    }

    // Update the progress record
    await payload.update({
      collection: 'progress',
      id: progress.id,
      data: {
        moduleProgress: updatedModuleProgress,
      },
    })

    // Update overall course progress
    await updateCourseProgress(courseId, userId)
  } catch (error) {
    console.error('Error updating module progress:', error)
  }
}

/**
 * Updates the overall course progress based on module completion
 */
async function updateCourseProgress(courseId: number, userId: string): Promise<void> {
  try {
    // Get the course to find all its modules
    const course = await payload.findByID({
      collection: 'courses',
      id: courseId,
      depth: 1,
    })

    if (!course || !course.modules || !Array.isArray(course.modules)) {
      return
    }

    // Get progress record
    const progressData = await payload.find({
      collection: 'progress',
      where: {
        and: [{ student: { equals: userId } }, { course: { equals: courseId } }],
      },
      depth: 2,
    })

    if (progressData.docs.length === 0) {
      return
    }

    const progress = progressData.docs[0]

    // Count completed modules
    let completedModules = 0
    const totalModules = course.modules.length
    let totalProgress = 0

    for (const c_module of course.modules) {
      const moduleId = typeof c_module === 'object' ? c_module.id : c_module
      const moduleProgress = progress.moduleProgress?.find(
        (mp: any) => mp.module.id === moduleId || mp.module === moduleId,
      )

      if (moduleProgress) {
        totalProgress += moduleProgress.progress

        if (moduleProgress.status === 'completed') {
          completedModules++
        }
      }
    }

    // Calculate overall progress percentage
    const overallProgress = totalModules > 0 ? Math.round(totalProgress / totalModules) : 0

    // Determine course status
    let courseStatus: LearningStatus = 'not_started'
    if (completedModules === totalModules && totalModules > 0) {
      courseStatus = 'completed'
    } else if (completedModules > 0 || overallProgress > 0) {
      courseStatus = 'in_progress'
    }

    // Update the progress record
    await payload.update({
      collection: 'progress',
      id: progress.id,
      data: {
        status: courseStatus,
        overallProgress,
        completedAt: courseStatus === 'completed' ? new Date().toISOString() : undefined,
      },
    })
  } catch (error) {
    console.error('Error updating course progress:', error)
  }
}
