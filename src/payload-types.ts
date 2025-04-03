/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

/**
 * Supported timezones in IANA format.
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "supportedTimezones".
 */
export type SupportedTimezones =
  | 'Pacific/Midway'
  | 'Pacific/Niue'
  | 'Pacific/Honolulu'
  | 'Pacific/Rarotonga'
  | 'America/Anchorage'
  | 'Pacific/Gambier'
  | 'America/Los_Angeles'
  | 'America/Tijuana'
  | 'America/Denver'
  | 'America/Phoenix'
  | 'America/Chicago'
  | 'America/Guatemala'
  | 'America/New_York'
  | 'America/Bogota'
  | 'America/Caracas'
  | 'America/Santiago'
  | 'America/Buenos_Aires'
  | 'America/Sao_Paulo'
  | 'Atlantic/South_Georgia'
  | 'Atlantic/Azores'
  | 'Atlantic/Cape_Verde'
  | 'Europe/London'
  | 'Europe/Berlin'
  | 'Africa/Lagos'
  | 'Europe/Athens'
  | 'Africa/Cairo'
  | 'Europe/Moscow'
  | 'Asia/Riyadh'
  | 'Asia/Dubai'
  | 'Asia/Baku'
  | 'Asia/Karachi'
  | 'Asia/Tashkent'
  | 'Asia/Calcutta'
  | 'Asia/Dhaka'
  | 'Asia/Almaty'
  | 'Asia/Jakarta'
  | 'Asia/Bangkok'
  | 'Asia/Shanghai'
  | 'Asia/Singapore'
  | 'Asia/Tokyo'
  | 'Asia/Seoul'
  | 'Australia/Brisbane'
  | 'Australia/Sydney'
  | 'Pacific/Guam'
  | 'Pacific/Noumea'
  | 'Pacific/Auckland'
  | 'Pacific/Fiji';

export interface Config {
  auth: {
    users: UserAuthOperations;
  };
  blocks: {};
  collections: {
    users: User;
    media: Media;
    courses: Course;
    modules: Module;
    lessons: Lesson;
    students: Student;
    enrollments: Enrollment;
    progress: Progress;
    products: Product;
    subscriptions: Subscription;
    categories: Category;
    'payload-locked-documents': PayloadLockedDocument;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  collectionsJoins: {};
  collectionsSelect: {
    users: UsersSelect<false> | UsersSelect<true>;
    media: MediaSelect<false> | MediaSelect<true>;
    courses: CoursesSelect<false> | CoursesSelect<true>;
    modules: ModulesSelect<false> | ModulesSelect<true>;
    lessons: LessonsSelect<false> | LessonsSelect<true>;
    students: StudentsSelect<false> | StudentsSelect<true>;
    enrollments: EnrollmentsSelect<false> | EnrollmentsSelect<true>;
    progress: ProgressSelect<false> | ProgressSelect<true>;
    products: ProductsSelect<false> | ProductsSelect<true>;
    subscriptions: SubscriptionsSelect<false> | SubscriptionsSelect<true>;
    categories: CategoriesSelect<false> | CategoriesSelect<true>;
    'payload-locked-documents': PayloadLockedDocumentsSelect<false> | PayloadLockedDocumentsSelect<true>;
    'payload-preferences': PayloadPreferencesSelect<false> | PayloadPreferencesSelect<true>;
    'payload-migrations': PayloadMigrationsSelect<false> | PayloadMigrationsSelect<true>;
  };
  db: {
    defaultIDType: number;
  };
  globals: {};
  globalsSelect: {};
  locale: null;
  user: User & {
    collection: 'users';
  };
  jobs: {
    tasks: unknown;
    workflows: unknown;
  };
}
export interface UserAuthOperations {
  forgotPassword: {
    email: string;
    password: string;
  };
  login: {
    email: string;
    password: string;
  };
  registerFirstUser: {
    email: string;
    password: string;
  };
  unlock: {
    email: string;
    password: string;
  };
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users".
 */
export interface User {
  id: number;
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "media".
 */
export interface Media {
  id: number;
  alt: string;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  thumbnailURL?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  focalX?: number | null;
  focalY?: number | null;
}
/**
 * Course content and structure
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "courses".
 */
export interface Course {
  id: number;
  /**
   * The title of the course
   */
  title: string;
  /**
   * URL-friendly version of the title (auto-generated if not provided)
   */
  slug: string;
  /**
   * Detailed description of the course content and objectives
   */
  description: string;
  /**
   * Category tag for courses
   */
  categories?: (number | Category)[] | null;
  /**
   * Course thumbnail image (16:9 ratio recommended)
   */
  thumbnail: number | Media;
  /**
   * Course modules in sequential order
   */
  modules?: (number | Module)[] | null;
  status: 'draft' | 'published' | 'archived';
  updatedAt: string;
  createdAt: string;
  _status?: ('draft' | 'published') | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "categories".
 */
export interface Category {
  id: number;
  title: string;
  updatedAt: string;
  createdAt: string;
}
/**
 * Course modules and sections
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "modules".
 */
export interface Module {
  id: number;
  title: string;
  description?: {
    root: {
      type: string;
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
  /**
   * The course this module belongs to
   */
  course: number | Course;
  /**
   * Order in which this module appears in the course
   */
  order: number;
  /**
   * Lessons within this module
   */
  lessons?: (number | Lesson)[] | null;
  status: 'draft' | 'published' | 'archived';
  completionCriteria: {
    type: 'all_lessons' | 'min_score' | 'custom';
    /**
     * Minimum score required to complete this module
     */
    minimumScore?: number | null;
    /**
     * Custom completion rule (evaluated at runtime)
     */
    customRule?: string | null;
  };
  updatedAt: string;
  createdAt: string;
  _status?: ('draft' | 'published') | null;
}
/**
 * Individual lessons within modules
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "lessons".
 */
export interface Lesson {
  id: number;
  /**
   * The title of the lesson
   */
  title: string;
  /**
   * Order in which this lesson appears in the module
   */
  order: number;
  /**
   * The type of lesson content
   */
  type: 'video' | 'reading' | 'quiz' | 'assignment' | 'discussion';
  /**
   * Brief overview of the lesson
   */
  description?: string | null;
  video?: {
    /**
     * URL of the video (YouTube, Vimeo, etc.)
     */
    url: string;
    /**
     * Duration in minutes
     */
    duration: number;
    /**
     * Video transcript for accessibility
     */
    transcript?: string | null;
  };
  /**
   * Lesson content in rich text format
   */
  content?: {
    root: {
      type: string;
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
  quiz?: {
    questions: {
      question: string;
      type: 'multiple' | 'boolean' | 'text';
      options?:
        | {
            text: string;
            correct: boolean;
            id?: string | null;
          }[]
        | null;
      answer?: string | null;
      points: number;
      /**
       * Explanation of the correct answer
       */
      explanation?: {
        root: {
          type: string;
          children: {
            type: string;
            version: number;
            [k: string]: unknown;
          }[];
          direction: ('ltr' | 'rtl') | null;
          format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
          indent: number;
          version: number;
        };
        [k: string]: unknown;
      } | null;
      id?: string | null;
    }[];
    settings: {
      /**
       * Time limit in minutes (0 for no limit)
       */
      timeLimit?: number | null;
      /**
       * Number of attempts allowed
       */
      attempts?: number | null;
      /**
       * Minimum score required to pass (%)
       */
      passingScore: number;
      randomizeQuestions?: boolean | null;
      showCorrectAnswers?: ('never' | 'after_each' | 'after_submit' | 'after_all') | null;
    };
  };
  assignment?: {
    instructions: {
      root: {
        type: string;
        children: {
          type: string;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ('ltr' | 'rtl') | null;
        format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    };
    dueDate: string;
    points: number;
    rubric?:
      | {
          criterion: string;
          points: number;
          description?: string | null;
          id?: string | null;
        }[]
      | null;
    allowedFileTypes?: ('pdf' | 'doc' | 'image' | 'zip' | 'code')[] | null;
  };
  discussion?: {
    prompt: {
      root: {
        type: string;
        children: {
          type: string;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ('ltr' | 'rtl') | null;
        format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    };
    guidelines?:
      | {
          text: string;
          id?: string | null;
        }[]
      | null;
    settings?: {
      requireResponse?: boolean | null;
      /**
       * Number of replies required (0 for none)
       */
      requireReplies?: number | null;
      /**
       * Minimum words required per post
       */
      minimumWords?: number | null;
      dueDate?: string | null;
    };
  };
  status: 'draft' | 'published' | 'archived';
  updatedAt: string;
  createdAt: string;
  _status?: ('draft' | 'published') | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "students".
 */
export interface Student {
  id: number;
  email: string;
  fullName: string;
  provider: string;
  providerAccountId: string;
  imageUrl?: string | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * Student course enrollments
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "enrollments".
 */
export interface Enrollment {
  id: number;
  /**
   * The enrolled student
   */
  student: number | Student;
  /**
   * The course being enrolled in
   */
  course: number | Course;
  status: 'active' | 'completed' | 'dropped' | 'pending';
  /**
   * When the enrollment was created
   */
  enrolledAt: string;
  /**
   * When the student started the course
   */
  startedAt?: string | null;
  /**
   * When the student completed the course
   */
  completedAt?: string | null;
  /**
   * When the student dropped the course
   */
  droppedAt?: string | null;
  /**
   * When the enrollment expires
   */
  expiresAt?: string | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * Student progress in courses
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "progress".
 */
export interface Progress {
  id: number;
  /**
   * The student whose progress this is
   */
  student: number | Student;
  /**
   * The course this progress is for
   */
  course: number | Course;
  status: 'not_started' | 'in_progress' | 'completed';
  /**
   * Overall progress percentage in the course
   */
  overallProgress: number;
  /**
   * Total points earned in this course
   */
  pointsEarned: number;
  /**
   * Total points earned across all courses
   */
  totalPoints: number;
  /**
   * When the student started the course
   */
  startedAt: string;
  /**
   * When the student completed the course
   */
  completedAt?: string | null;
  /**
   * When the student last accessed the course
   */
  lastAccessed: string;
  /**
   * Progress in individual modules
   */
  moduleProgress?:
    | {
        module: number | Module;
        status: 'not_started' | 'in_progress' | 'completed';
        progress: number;
        id?: string | null;
      }[]
    | null;
  /**
   * Quiz attempts and scores
   */
  quizAttempts?:
    | {
        /**
         * The lesson containing the quiz
         */
        lesson?: (number | null) | Lesson;
        score: number;
        completedAt: string;
        id?: string | null;
      }[]
    | null;
  /**
   * Discussion participation
   */
  discussions?:
    | {
        /**
         * The lesson containing the discussion
         */
        lesson?: (number | null) | Lesson;
        participatedAt: string;
        id?: string | null;
      }[]
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "products".
 */
export interface Product {
  id: number;
  name: string;
  description: string;
  course: number | Course;
  productStatus: 'active' | 'inactive';
  productPrice: {
    price: number;
    acceptedCurrency: 'AUD' | 'USD';
    id?: string | null;
  }[];
  productImage?: (number | null) | Media;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "subscriptions".
 */
export interface Subscription {
  id: number;
  status?: ('active' | 'inactive') | null;
  startDate: string;
  endDate: string;
  user?: (number | null) | Student;
  product?: (number | null) | Product;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents".
 */
export interface PayloadLockedDocument {
  id: number;
  document?:
    | ({
        relationTo: 'users';
        value: number | User;
      } | null)
    | ({
        relationTo: 'media';
        value: number | Media;
      } | null)
    | ({
        relationTo: 'courses';
        value: number | Course;
      } | null)
    | ({
        relationTo: 'modules';
        value: number | Module;
      } | null)
    | ({
        relationTo: 'lessons';
        value: number | Lesson;
      } | null)
    | ({
        relationTo: 'students';
        value: number | Student;
      } | null)
    | ({
        relationTo: 'enrollments';
        value: number | Enrollment;
      } | null)
    | ({
        relationTo: 'progress';
        value: number | Progress;
      } | null)
    | ({
        relationTo: 'products';
        value: number | Product;
      } | null)
    | ({
        relationTo: 'subscriptions';
        value: number | Subscription;
      } | null)
    | ({
        relationTo: 'categories';
        value: number | Category;
      } | null);
  globalSlug?: string | null;
  user: {
    relationTo: 'users';
    value: number | User;
  };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences".
 */
export interface PayloadPreference {
  id: number;
  user: {
    relationTo: 'users';
    value: number | User;
  };
  key?: string | null;
  value?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations".
 */
export interface PayloadMigration {
  id: number;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users_select".
 */
export interface UsersSelect<T extends boolean = true> {
  updatedAt?: T;
  createdAt?: T;
  email?: T;
  resetPasswordToken?: T;
  resetPasswordExpiration?: T;
  salt?: T;
  hash?: T;
  loginAttempts?: T;
  lockUntil?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "media_select".
 */
export interface MediaSelect<T extends boolean = true> {
  alt?: T;
  updatedAt?: T;
  createdAt?: T;
  url?: T;
  thumbnailURL?: T;
  filename?: T;
  mimeType?: T;
  filesize?: T;
  width?: T;
  height?: T;
  focalX?: T;
  focalY?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "courses_select".
 */
export interface CoursesSelect<T extends boolean = true> {
  title?: T;
  slug?: T;
  description?: T;
  categories?: T;
  thumbnail?: T;
  modules?: T;
  status?: T;
  updatedAt?: T;
  createdAt?: T;
  _status?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "modules_select".
 */
export interface ModulesSelect<T extends boolean = true> {
  title?: T;
  description?: T;
  course?: T;
  order?: T;
  lessons?: T;
  status?: T;
  completionCriteria?:
    | T
    | {
        type?: T;
        minimumScore?: T;
        customRule?: T;
      };
  updatedAt?: T;
  createdAt?: T;
  _status?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "lessons_select".
 */
export interface LessonsSelect<T extends boolean = true> {
  title?: T;
  order?: T;
  type?: T;
  description?: T;
  video?:
    | T
    | {
        url?: T;
        duration?: T;
        transcript?: T;
      };
  content?: T;
  quiz?:
    | T
    | {
        questions?:
          | T
          | {
              question?: T;
              type?: T;
              options?:
                | T
                | {
                    text?: T;
                    correct?: T;
                    id?: T;
                  };
              answer?: T;
              points?: T;
              explanation?: T;
              id?: T;
            };
        settings?:
          | T
          | {
              timeLimit?: T;
              attempts?: T;
              passingScore?: T;
              randomizeQuestions?: T;
              showCorrectAnswers?: T;
            };
      };
  assignment?:
    | T
    | {
        instructions?: T;
        dueDate?: T;
        points?: T;
        rubric?:
          | T
          | {
              criterion?: T;
              points?: T;
              description?: T;
              id?: T;
            };
        allowedFileTypes?: T;
      };
  discussion?:
    | T
    | {
        prompt?: T;
        guidelines?:
          | T
          | {
              text?: T;
              id?: T;
            };
        settings?:
          | T
          | {
              requireResponse?: T;
              requireReplies?: T;
              minimumWords?: T;
              dueDate?: T;
            };
      };
  status?: T;
  updatedAt?: T;
  createdAt?: T;
  _status?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "students_select".
 */
export interface StudentsSelect<T extends boolean = true> {
  email?: T;
  fullName?: T;
  provider?: T;
  providerAccountId?: T;
  imageUrl?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "enrollments_select".
 */
export interface EnrollmentsSelect<T extends boolean = true> {
  student?: T;
  course?: T;
  status?: T;
  enrolledAt?: T;
  startedAt?: T;
  completedAt?: T;
  droppedAt?: T;
  expiresAt?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "progress_select".
 */
export interface ProgressSelect<T extends boolean = true> {
  student?: T;
  course?: T;
  status?: T;
  overallProgress?: T;
  pointsEarned?: T;
  totalPoints?: T;
  startedAt?: T;
  completedAt?: T;
  lastAccessed?: T;
  moduleProgress?:
    | T
    | {
        module?: T;
        status?: T;
        progress?: T;
        id?: T;
      };
  quizAttempts?:
    | T
    | {
        lesson?: T;
        score?: T;
        completedAt?: T;
        id?: T;
      };
  discussions?:
    | T
    | {
        lesson?: T;
        participatedAt?: T;
        id?: T;
      };
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "products_select".
 */
export interface ProductsSelect<T extends boolean = true> {
  name?: T;
  description?: T;
  course?: T;
  productStatus?: T;
  productPrice?:
    | T
    | {
        price?: T;
        acceptedCurrency?: T;
        id?: T;
      };
  productImage?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "subscriptions_select".
 */
export interface SubscriptionsSelect<T extends boolean = true> {
  status?: T;
  startDate?: T;
  endDate?: T;
  user?: T;
  product?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "categories_select".
 */
export interface CategoriesSelect<T extends boolean = true> {
  title?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents_select".
 */
export interface PayloadLockedDocumentsSelect<T extends boolean = true> {
  document?: T;
  globalSlug?: T;
  user?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences_select".
 */
export interface PayloadPreferencesSelect<T extends boolean = true> {
  user?: T;
  key?: T;
  value?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations_select".
 */
export interface PayloadMigrationsSelect<T extends boolean = true> {
  name?: T;
  batch?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "auth".
 */
export interface Auth {
  [k: string]: unknown;
}


declare module 'payload' {
  export interface GeneratedTypes extends Config {}
}