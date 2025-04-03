import type { CollectionConfig, CollectionSlug } from 'payload'

export const Enrollments: CollectionConfig = {
  slug: 'enrollments',
  admin: {
    useAsTitle: 'id',
    group: 'Learning',
    defaultColumns: ['student', 'course', 'status', 'enrolledAt'],
    description: 'Student course enrollments',
  },
  access: {},
  fields: [
    {
      name: 'student',
      type: 'relationship',
      relationTo: 'students',
      required: true,
      admin: {
        description: 'The enrolled student',
      },
    },
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
      admin: {
        description: 'The course being enrolled in',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Completed', value: 'completed' },
        { label: 'Dropped', value: 'dropped' },
        { label: 'Pending', value: 'pending' },
      ],
    },
    {
      name: 'enrolledAt',
      type: 'date',
      required: true,
      admin: {
        description: 'When the enrollment was created',
      },
    },
    {
      name: 'startedAt',
      type: 'date',
      admin: {
        description: 'When the student started the course',
      },
    },
    {
      name: 'completedAt',
      type: 'date',
      admin: {
        description: 'When the student completed the course',
      },
    },
    {
      name: 'droppedAt',
      type: 'date',
      admin: {
        description: 'When the student dropped the course',
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      admin: {
        description: 'When the enrollment expires',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        // Set enrolledAt on creation
        if (operation === 'create') {
          data.enrolledAt = new Date().toISOString()
        }

        // Handle status changes
        if (operation === 'update' && data.status) {
          const now = new Date().toISOString()
          switch (data.status) {
            case 'active':
              if (!data.startedAt) data.startedAt = now
              break
            case 'completed':
              data.completedAt = now
              break
            case 'dropped':
              data.droppedAt = now
              break
          }
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        // Create initial progress record on enrollment
        if (operation === 'create') {
          await req.payload.create({
            collection: 'progress' as CollectionSlug,
            data: {
              student: doc.student,
              course: doc.course,
              startedAt: new Date().toISOString(),
              lastAccessed: new Date().toISOString(),
              status: 'not_started',
              overallProgress: 0,
              pointsEarned: 0,
              totalPoints: 0,
            },
          })
        }
      },
    ],
  },
}
