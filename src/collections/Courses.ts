import type { CollectionConfig, CollectionSlug } from 'payload'

export const Courses: CollectionConfig = {
  slug: 'courses',
  admin: {
    useAsTitle: 'title',
    group: 'Learning',
    defaultColumns: ['title', 'instructor', 'status', 'updatedAt'],
    description: 'Course content and structure',
    listSearchableFields: ['title', 'slug'],
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
        description: 'The title of the course',
        placeholder: 'e.g., Introduction to Programming',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly version of the title (auto-generated if not provided)',
        placeholder: 'e.g., intro-to-programming',
      },
    },
    {
      name: 'description',
      type: 'text',
      required: true,
      admin: {
        description: 'Detailed description of the course content and objectives',
      },
    },
    {
      name: 'categories',
      label: 'Categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: {
        description: 'Category tag for courses',
      },
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media' as CollectionSlug,
      required: true,
      admin: {
        description: 'Course thumbnail image (16:9 ratio recommended)',
      },
    },
    {
      name: 'modules',
      type: 'relationship',
      relationTo: 'modules' as CollectionSlug,
      hasMany: true,
      admin: {
        description: 'Course modules in sequential order',
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
  ],
}
