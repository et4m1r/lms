import type { CollectionConfig } from 'payload'
import {
  BlocksFeature,
  LinkFeature,
  UploadFeature,
  FixedToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const languages = {
  ts: 'TypeScript',
  tsx: 'TSX',
  js: 'JavaScript',
  jsx: 'JSX',
  html: 'HTML',
}
export const Lessons: CollectionConfig = {
  slug: 'lessons',
  admin: {
    useAsTitle: 'title',
    group: 'Learning',
    defaultColumns: ['title', 'module', 'type', 'status'],
    description: 'Individual lessons within modules',
    listSearchableFields: ['title'],
  },
  versions: {
    drafts: true,
  },
  access: {},
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'The title of the lesson',
      },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Order in which this lesson appears in the module',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Video', value: 'video' },
        { label: 'Reading', value: 'reading' },
        { label: 'Quiz', value: 'quiz' },
        { label: 'Assignment', value: 'assignment' },
        { label: 'Discussion', value: 'discussion' },
      ],
      admin: {
        description: 'The type of lesson content',
      },
    },
    {
      name: 'description',
      type: 'text',
      admin: {
        description: 'Brief overview of the lesson',
      },
    },
    // Video specific fields
    {
      name: 'video',
      type: 'group',
      admin: {
        condition: (data) => data.type === 'video',
      },
      fields: [
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: {
            description: 'URL of the video (YouTube, Vimeo, etc.)',
          },
        },
        {
          name: 'duration',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            description: 'Duration in minutes',
          },
        },
        {
          name: 'transcript',
          type: 'textarea',
          admin: {
            description: 'Video transcript for accessibility',
          },
        },
      ],
    },
    // Reading specific fields
    {
      name: 'content',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures, rootFeatures }) => [
          ...defaultFeatures,
          FixedToolbarFeature(),
          BlocksFeature({
            blocks: [
              {
                slug: 'Code',
                fields: [
                  {
                    type: 'select',
                    name: 'language',
                    options: Object.entries(languages).map(([key, value]) => ({
                      label: value,
                      value: key,
                    })),
                    defaultValue: 'ts',
                  },
                  {
                    admin: {
                      components: {
                        Field: '@/components/CodeComponent#Code',
                      },
                    },
                    name: 'code',
                    type: 'code',
                  },
                ],
              },
            ],
          }),
        ],
      }),
      admin: {
        description: 'Lesson content in rich text format',
        condition: (data) => data.type === 'reading',
      },
    },
    // Quiz specific fields
    {
      name: 'quiz',
      type: 'group',
      admin: {
        condition: (data) => data.type === 'quiz',
      },
      fields: [
        {
          name: 'questions',
          type: 'array',
          required: true,
          fields: [
            {
              name: 'question',
              type: 'text',
              required: true,
            },
            {
              name: 'type',
              type: 'select',
              required: true,
              options: [
                { label: 'Multiple Choice', value: 'multiple' },
                { label: 'True/False', value: 'boolean' },
                { label: 'Short Answer', value: 'text' },
              ],
            },
            {
              name: 'options',
              type: 'array',
              required: true,
              admin: {
                condition: (data, siblingData) => siblingData?.type === 'multiple',
              },
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'correct',
                  type: 'checkbox',
                  required: true,
                },
              ],
            },
            {
              name: 'answer',
              type: 'text',
              required: true,
              admin: {
                condition: (data, siblingData) =>
                  siblingData?.type === 'boolean' || siblingData?.type === 'text',
              },
            },
            {
              name: 'points',
              type: 'number',
              required: true,
              min: 0,
            },
            {
              name: 'explanation',
              type: 'richText',
              admin: {
                description: 'Explanation of the correct answer',
              },
            },
          ],
        },
        {
          name: 'settings',
          type: 'group',
          fields: [
            {
              name: 'timeLimit',
              type: 'number',
              min: 0,
              admin: {
                description: 'Time limit in minutes (0 for no limit)',
              },
            },
            {
              name: 'attempts',
              type: 'number',
              min: 1,
              defaultValue: 1,
              admin: {
                description: 'Number of attempts allowed',
              },
            },
            {
              name: 'passingScore',
              type: 'number',
              min: 0,
              max: 100,
              required: true,
              defaultValue: 70,
              admin: {
                description: 'Minimum score required to pass (%)',
              },
            },
            {
              name: 'randomizeQuestions',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'showCorrectAnswers',
              type: 'select',
              options: [
                { label: 'Never', value: 'never' },
                { label: 'After Each Question', value: 'after_each' },
                { label: 'After Submission', value: 'after_submit' },
                { label: 'After All Attempts', value: 'after_all' },
              ],
              defaultValue: 'after_submit',
            },
          ],
        },
      ],
    },
    // Assignment specific fields
    {
      name: 'assignment',
      type: 'group',
      admin: {
        condition: (data) => data.type === 'assignment',
      },
      fields: [
        {
          name: 'instructions',
          type: 'richText',
          required: true,
        },
        {
          name: 'dueDate',
          type: 'date',
          required: true,
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'points',
          type: 'number',
          required: true,
          min: 0,
        },
        {
          name: 'rubric',
          type: 'array',
          fields: [
            {
              name: 'criterion',
              type: 'text',
              required: true,
            },
            {
              name: 'points',
              type: 'number',
              required: true,
              min: 0,
            },
            {
              name: 'description',
              type: 'textarea',
            },
          ],
        },
        {
          name: 'allowedFileTypes',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'PDF', value: 'pdf' },
            { label: 'Word', value: 'doc' },
            { label: 'Images', value: 'image' },
            { label: 'ZIP', value: 'zip' },
            { label: 'Code', value: 'code' },
          ],
        },
      ],
    },
    // Discussion specific fields
    {
      name: 'discussion',
      type: 'group',
      admin: {
        condition: (data) => data.type === 'discussion',
      },
      fields: [
        {
          name: 'prompt',
          type: 'richText',
          required: true,
        },
        {
          name: 'guidelines',
          type: 'array',
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'settings',
          type: 'group',
          fields: [
            {
              name: 'requireResponse',
              type: 'checkbox',
              defaultValue: true,
            },
            {
              name: 'requireReplies',
              type: 'number',
              min: 0,
              defaultValue: 2,
              admin: {
                description: 'Number of replies required (0 for none)',
              },
            },
            {
              name: 'minimumWords',
              type: 'number',
              min: 0,
              admin: {
                description: 'Minimum words required per post',
              },
            },
            {
              name: 'dueDate',
              type: 'date',
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
          ],
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        // Ensure order is set for new lessons
        if (operation === 'create' && typeof data.order === 'undefined') {
          data.order = 0
        }
        return data
      },
    ],
  },
}
