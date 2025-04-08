import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'caxmltwcjw0u59uz.public.blob.vercel-storage.com',
      },
    ],
  },
  transpilePackages: ['next-mdx-remote'],
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
