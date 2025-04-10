import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/contexts/theme-provider'
import { Navbar } from '@/components/navbar'
import { Space_Mono, Space_Grotesk } from 'next/font/google'
import { Footer } from '@/components/footer'
import '@/styles/globals.css'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NavigationProvider } from '@/context/navbar-context'

const sansFont = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
  weight: '400',
})

const monoFont = Space_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
  weight: '400',
})

export const metadata: Metadata = {
  title: 'LMS',
  metadataBase: new URL('https://lms-two.vercel.app/'),
  description:
    'An LMS platform developed using Payload CMS.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(authOptions)
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      <body
        className={`${sansFont.variable} ${monoFont.variable} font-regular antialiased tracking-wide`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NavigationProvider>
            <Navbar user={session?.user} />
            <main className="sm:container mx-auto w-[90vw] h-auto scroll-smooth">{children}</main>
          </NavigationProvider>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
