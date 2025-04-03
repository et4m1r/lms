import type { CollectionConfig } from 'payload'

export const Progress: CollectionConfig = {
  slug: 'progress',
  admin: {
    useAsTitle: 'id',
    group: 'Learning',
    defaultColumns: ['student', 'course', 'status', 'overallProgress'],
    description: 'Student progress in courses',
  },
  access: {
  },
  fields: [
    {
      name: 'student',
      type: 'relationship',
      relationTo: 'students',
      required: true,
      admin: {
        description: 'The student whose progress this is',
      },
    },
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
      admin: {
        description: 'The course this progress is for',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'not_started',
      options: [
        { label: 'Not Started', value: 'not_started' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Completed', value: 'completed' },
      ],
    },
    {
      name: 'overallProgress',
      type: 'number',
      required: true,
      min: 0,
      max: 100,
      defaultValue: 0,
      admin: {
        description: 'Overall progress percentage in the course',
      },
    },
    {
      name: 'pointsEarned',
      type: 'number',
      required: true,
      min: 0,
      defaultValue: 0,
      admin: {
        description: 'Total points earned in this course',
      },
    },
    {
      name: 'totalPoints',
      type: 'number',
      required: true,
      min: 0,
      defaultValue: 0,
      admin: {
        description: 'Total points earned across all courses',
      },
    },
    {
      name: 'startedAt',
      type: 'date',
      required: true,
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
      name: 'lastAccessed',
      type: 'date',
      required: true,
      admin: {
        description: 'When the student last accessed the course',
      },
    },
    {
      name: 'moduleProgress',
      type: 'array',
      admin: {
        description: 'Progress in individual modules',
      },
      fields: [
        {
          name: 'module',
          type: 'relationship',
          relationTo: 'modules',
          required: true,
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          options: [
            { label: 'Not Started', value: 'not_started' },
            { label: 'In Progress', value: 'in_progress' },
            { label: 'Completed', value: 'completed' },
          ],
        },
        {
          name: 'progress',
          type: 'number',
          required: true,
          min: 0,
          max: 100,
        },
      ],
    },
    {
      name: 'quizAttempts',
      type: 'array',
      admin: {
        description: 'Quiz attempts and scores',
      },
      fields: [
        {
          name: 'lesson',
          type: 'relationship',
          relationTo: 'lessons',
          required: true,
          admin: {
            description: 'The lesson containing the quiz',
            condition: (data, siblingData) => {
              return data?.type === 'quiz'
            },
          },
        },
        {
          name: 'score',
          type: 'number',
          required: true,
          min: 0,
          max: 100,
        },
        {
          name: 'completedAt',
          type: 'date',
          required: true,
        },
      ],
    },
    {
      name: 'discussions',
      type: 'array',
      admin: {
        description: 'Discussion participation',
      },
      fields: [
        {
          name: 'lesson',
          type: 'relationship',
          relationTo: 'lessons',
          required: true,
          admin: {
            description: 'The lesson containing the discussion',
            condition: (data, siblingData) => {
              return data?.type === 'discussion'
            },
          },
        },
        {
          name: 'participatedAt',
          type: 'date',
          required: true,
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        data.lastAccessed = new Date().toISOString()
        return data
      },
    ],
  },
}