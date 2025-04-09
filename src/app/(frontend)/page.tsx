import React from 'react'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  redirect('/dashboard')
  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-black">
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-md shadow-md">Home page is coming soon</div>
      </div>
    </div>
  )
}
