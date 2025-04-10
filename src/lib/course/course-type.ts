export interface CourseModule {
  id: number
  title: string
  lessons: CourseLesson[]
}

export interface CourseLesson {
  id: number
  title: string
  description?: string
}

export interface Course {
  id: number
  title: string
  modules: CourseModule[]
}

export interface NavigationLink {
  href: string | null
  title: string
}

export interface LessonNavigation {
  prev: NavigationLink | null
  next: NavigationLink | null
}

export interface Product {
  id: string
  name: string
  description?: string
  price?: number
  course?: number | string // ID of the related course
}

export interface Subscription {
  id: string
  status: "active" | "inactive"
  stripeSubscriptionId?: string
  startDate: string
  endDate?: string
  student: string // ID of the related student
  product: string // ID of the related product
}
