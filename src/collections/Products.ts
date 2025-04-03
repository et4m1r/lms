import { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    group: 'Sales',
  },
  access: {},
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Product Name',
    },
    {
      name: 'description',
      type: 'text',
      required: true,
      label: 'Short Product Description',
    },
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
      hasMany: false,
    },
    {
      name: 'productStatus',
      type: 'radio',
      required: true,
      defaultValue: 'active',
      options: [
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
      name: 'productPrice',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'price',
          type: 'number',
          required: true,
          label: 'Price',
        },
        {
          name: 'acceptedCurrency',
          type: 'radio',
          required: true,
          defaultValue: 'USD',
          options: [
            {
              label: 'AU Dollars',
              value: 'AUD',
            },
            {
              label: 'US Dollars',
              value: 'USD',
            },
          ],
        },
      ],
    },
    {
      name: 'productImage',
      type: 'upload',
      required: false,
      relationTo: 'media',
    },
  ],
}

