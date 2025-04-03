import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { CourseView } from '@/app/(frontend)/courses/[courseId]/components/course-view'
import { TopNavbar } from '@/components/NavBar'

type Params = { courseId: string }

export default async function CoursePage({ params }: { params: Promise<Params> }) {
  const { courseId: courseId } = await params
  const payload = await getPayload({ config: configPromise })

  const course = await payload.findByID({
    collection: 'courses',
    id: courseId,
  })

  return (
    <div className=" min-h-screen bg-gray-50">
      <TopNavbar />
      <CourseView course={course} />
    </div>
  )
}
