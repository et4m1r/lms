import { CollectionConfig } from 'payload'

export const Subscriptions: CollectionConfig = {
  slug: 'subscriptions',
  admin: {
    useAsTitle: 'id',
    group: 'Sales',
  },
  access: {},
  fields: [
    {
      name: 'status',
      type: 'radio',
      options: [
        // Required
        {
          label: 'Active',
          value: 'active',
        },
        {
          label: 'Inactive',
          value: 'inactive',
        },
      ],
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      label: 'Start Date',
    },
    {
      name: 'endDate',
      type: 'date',
      required: true,
      label: 'End Date',
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'students',
      hasMany: false,
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      hasMany: false,
    },
  ],
}

