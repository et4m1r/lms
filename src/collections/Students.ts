import type { CollectionConfig } from 'payload'

export const Students: CollectionConfig = {
  slug: 'students',
  admin: {
    useAsTitle: 'email',
  },
  access: {
    create: () => true,
  },
  auth: true,
  fields: [],
}
