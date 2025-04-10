import { payload } from '@/lib/payload'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * Checks if the current user has access to a specific course
 * @param courseId The ID of the course to check access for
 * @returns Object containing access status and subscription info
 */
export async function checkCourseAccess(courseId: number) {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return { hasAccess: false, message: 'Please log in to access this course' }
    }

    const userId = session.user.id

    // Find the student record
    const student = await payload.findByID({
      collection: 'students',
      id: userId,
    })

    if (!student) {
      return { hasAccess: false, message: 'Student record not found' }
    }

    // Find active subscriptions for this student
    const subscriptions = await payload.find({
      collection: 'subscriptions',
      where: {
        and: [{ student: { equals: userId } }, { status: { equals: 'active' } }],
      },
      depth: 2, // Load related product data
    })

    if (!subscriptions.docs || subscriptions.docs.length === 0) {
      return {
        hasAccess: false,
        message: "You don't have any active subscriptions",
      }
    }

    // Check if any of the student's subscriptions include this course
    for (const subscription of subscriptions.docs) {
      // Get the product from the subscription
      const productId = subscription.product.id

      if (!productId) continue

      // Fetch the product with its related course
      const product = await payload.findByID({
        collection: 'products',
        id: productId,
        depth: 1,
      })

      if (!product) continue

      // Check if this product grants access to the requested course
      if (product.course.id === courseId) {
        return {
          hasAccess: true,
          subscription,
          product,
        }
      }
    }

    return {
      hasAccess: false,
      message: "Oops! It looks like you haven’t unlocked this course yet.",
    }
  } catch (error) {
    console.error('Error checking course access:', error)
    return {
      hasAccess: false,
      message: 'An error occurred while checking course access',
    }
  }
}
