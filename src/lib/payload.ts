import config from '@payload-config'
import { getPayload } from 'payload'

// Cache the Payload instance
let cachedPayload: any = null

export async function getPayloadClient() {
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error('PAYLOAD_SECRET environment variable is missing')
  }

  if (cachedPayload) {
    return cachedPayload
  }

  const payload = await getPayload({
    config,
  })

  cachedPayload = payload

  return payload
}

// For easier imports
export const payload = {
  async find(args: any) {
    const client = await getPayloadClient()
    return client.find(args)
  },
  async findByID(args: any) {
    const client = await getPayloadClient()
    return client.findByID(args)
  },
  async create(args: any) {
    const client = await getPayloadClient()
    return client.create(args)
  },
  async update(args: any) {
    const client = await getPayloadClient()
    return client.update(args)
  },
  async delete(args: any) {
    const client = await getPayloadClient()
    return client.delete(args)
  },
  async login(args: any) {
    const client = await getPayloadClient()
    return client.login(args)
  },
}
