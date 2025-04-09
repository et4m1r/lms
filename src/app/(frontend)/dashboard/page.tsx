import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { payload } from '@/lib/payload'
import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { Subscription, Product, Course, Media, Category } from '@/payload-types'
import { Rocket } from 'lucide-react'

async function getSubscriptions() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect('/login')
  }

  try {
    const subscription = await payload.find({
      collection: 'subscriptions',
      depth: 3,
      where: {
        'student.id': {
          equals: session.user.id,
        },
      },
    })

    // Get first user if exists
    let user = subscription.docs.length > 0 ? subscription.docs[0].student : null
    const courses = subscription.docs.map((doc: Subscription) => (doc.product as Product).course)

    if (!user) {
      user = await payload.findByID({
        collection: 'students',
        id: session.user.id,
      })
    }

    return {
      user,
      courses,
    }
  } catch (error) {
    console.error('Error fetching subscriptions:', error)
    return null
  }
}

export default async function DashboardPage() {
  const result = await getSubscriptions()

  const user = result?.user
  const courses = result?.courses ?? []

  return (
    <div className="flex flex-col items-start justify-center pt-8 pb-10 w-full mx-auto">
      <div className="flex flex-col gap-1 sm:min-h-[91vh] min-h-[88vh] pt-2">
        <div className="mb-7 flex flex-col gap-2">
          <h1 className="sm:text-3xl text-2xl font-extrabold">
            Welcome back, {user.fullName}! Ready to level up?
          </h1>
          <p className="text-muted-foreground sm:text-[16.5px] text-[14.5px]">
            You&#39;ve already taken the first step—now keep the momentum going. Dive back into your
            courses and keep building your skills one lesson at a time. You&#39;ve got this!
          </p>
        </div>

        {courses.length > 0 ? (
          <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:gap-8 gap-4 mb-5">
            {courses.map((course: Course) => (
              <CourseCard {...course} key={course.id} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full mt-10 gap-4">
            <p className="text-lg text-muted-foreground text-center">
              No subscriptions yet. Start your journey today!
            </p>
            <Link
              href="/courses"
              className="px-4 py-2 bg-primary text-white rounded-sm font-semibold hover:bg-primary/90 transition"
            >
              Browse Courses
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function CourseCard({ id, title, description, thumbnail, categories }: Course) {
  const imageUrl = (thumbnail as Media).url || ''
  const categoryName = categories && categories.length > 0 ? (categories[0] as Category).title : ''

  return (
    <div className="flex flex-col gap-2 items-start border rounded-md py-5 px-3 min-h-[400px]">
      <Link href={`/courses/${id}`}>
        <h3 className="text-md font-semibold -mt-1 pr-7">{title}</h3>
        <div className="w-full">
          <Image
            src={imageUrl}
            alt={title}
            width={400}
            height={150}
            quality={80}
            className="w-full rounded-md object-cover h-[180px] border"
          />
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </Link>
      <div className="flex items-center justify-between w-full mt-auto">
        <p className="text-[13px] text-secondary-foreground">{categoryName}</p>
        <Link
          className={buttonVariants({
            variant: 'outline',
            className:
              'no-underline  flex flex-col sm:pl-7 pl-3 sm:py-5 py-4 !items-start text-xs sm:text-sm',
          })}
          href={`/courses/${id}`}
        >
          <span className="flex items-center text-muted-foreground text-xs">
            <Rocket className="w-[1rem] h-[1rem] mr-1 ml-1" />
            Get Smarter Now
          </span>
        </Link>
      </div>
    </div>
  )
}
