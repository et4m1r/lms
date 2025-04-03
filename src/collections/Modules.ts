import type { CollectionConfig, CollectionSlug } from 'payload'

export const Modules: CollectionConfig = {
  slug: 'modules' as CollectionSlug,
  admin: {
    useAsTitle: 'title',
    group: 'Learning',
    defaultColumns: ['title', 'course', 'status'],
    description: 'Course modules and sections',
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
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses' as CollectionSlug,
      required: true,
      hasMany: false,
      admin: {
        description: 'The course this module belongs to',
      },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Order in which this module appears in the course',
      },
    },
    {
      name: 'lessons',
      type: 'relationship',
      relationTo: 'lessons' as CollectionSlug,
      hasMany: true,
      admin: {
        description: 'Lessons within this module',
      },
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
    {
      name: 'completionCriteria',
      type: 'group',
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          defaultValue: 'all_lessons',
          options: [
            { label: 'All Lessons', value: 'all_lessons' },
            { label: 'Minimum Score', value: 'min_score' },
            { label: 'Custom', value: 'custom' },
          ],
        },
        {
          name: 'minimumScore',
          type: 'number',
          min: 0,
          max: 100,
          admin: {
            condition: (data, siblingData) => siblingData?.type === 'min_score',
            description: 'Minimum score required to complete this module',
          },
        },
        {
          name: 'customRule',
          type: 'textarea',
          admin: {
            condition: (data, siblingData) => siblingData?.type === 'custom',
            description: 'Custom completion rule (evaluated at runtime)',
          },
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        // Ensure order is set for new modules
        if (operation === 'create' && typeof data.order === 'undefined') {
          data.order = 0
        }
        return data
      },
    ],
  },
}
