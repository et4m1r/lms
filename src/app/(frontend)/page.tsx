import React from 'react'
import { TopNavbar } from '@/components/NavBar'

export default async function HomePage() {
  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-black">
      <TopNavbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-md shadow-md">This is home page</div>
      </div>
    </div>
  )
}
