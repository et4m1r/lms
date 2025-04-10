'use server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { updateLessonStatus } from '@/lib/course/progress-utils'

export async function markLessonCompleted(courseId: number, moduleId: number, lessonId: number) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return { success: false, message: 'User not authenticated' }
    }

    const userId = session.user.id

    // Update lesson status using the utility function
    const success = await updateLessonStatus(courseId, moduleId, lessonId, 'completed', userId)

    if (!success) {
      return { success: false, message: 'Failed to update lesson status' }
    }

    // Revalidate the course page to show updated progress
    revalidatePath(`/courses/${courseId}`)

    return { success: true }
  } catch (error) {
    console.error('Error marking lesson as completed:', error)
    return { success: false, message: 'Failed to mark lesson as completed' }
  }
}

export async function markLessonInProgress(courseId: number, moduleId: number, lessonId: number) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return { success: false, message: 'User not authenticated' }
    }

    const userId = session.user.id

    // Update lesson status using the utility function
    const success = await updateLessonStatus(courseId, moduleId, lessonId, 'in_progress', userId)

    if (!success) {
      return { success: false, message: 'Failed to update lesson status' }
    }

    // Revalidate the course page to show updated progress
    revalidatePath(`/courses/${courseId}`)

    return { success: true }
  } catch (error) {
    console.error('Error marking lesson as in progress:', error)
    return { success: false, message: 'Failed to mark lesson as in progress' }
  }
}
