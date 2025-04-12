import type { CollectionConfig } from 'payload'

export const Test: CollectionConfig = {
  slug: 'tests',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
    },
  ],
}
