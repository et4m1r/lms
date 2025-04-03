import type { CollectionConfig } from 'payload'

export const Students: CollectionConfig = {
  slug: 'students',
  admin: {
    useAsTitle: 'email',
  },
  access: {
    create: () => true,
  },
  // auth: true,
  fields: [
    {
      name: 'email',
      type: 'text',
      required: true,
      label: 'Full Name',
    },
    {
      name: 'fullName',
      type: 'text',
      required: true,
      label: 'Full Name',
    },
    {
      name: 'provider',
      type: 'text',
      required: true,
      label: 'Auth Provider',
    },
    {
      name: 'providerAccountId',
      type: 'text',
      required: true,
      label: 'Auth Provider ID',
    },
    {
      name: 'imageUrl',
      type: 'text',
      required: false,
      label: 'Image Url',
    },
  ],
}
