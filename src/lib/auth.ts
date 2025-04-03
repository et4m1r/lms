import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' && profile) {
        const payload = await getPayload({ config: configPromise })

        const existingUser = await payload.find({
          collection: 'students',
          where: {
            email: {
              equals: user.email,
            },
          },
        })

        if (existingUser.docs.length === 0) {
          const newUser = await payload.create({
            collection: 'students',
            data: {
              providerAccountId: account.providerAccountId,
              provider: account.provider,
              fullName: profile.name as string,
              email: profile.email as string,
              imageUrl: 'picture' in profile ? (profile.picture as string) : '',
            },
            user: {
              email: profile.email as string,
            },
          })

          if (newUser) {
            user.id = String(newUser.id)
            return true
          } else {
            console.error('Failed to create new user from Google sign-in')
            return false
          }
        } else {
          user.id = String(existingUser.docs[0].id)
        }
        return true
      }
      return true
    },
    async session({ session, token }) {
      if (session?.user && token.sub) {
        session.user.id = token.sub
      }
      return session
    },
    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id
      }
      return token
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      // Redirect to the base URL by default
      return baseUrl
    },
  },
  pages: {
    signIn: '/login',
  },
}

const handler = NextAuth(authOptions)

export const handlers = { GET: handler, POST: handler }
