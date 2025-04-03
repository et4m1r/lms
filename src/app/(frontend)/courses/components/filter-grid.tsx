'use client'

import React, { useState } from 'react'
import { CourseFilters } from './filter'
import { CourseGrid } from './grid'
import { Category, Course, Product } from '@/payload-types'

interface FilterAndGridProps {
  products: Product[]
  categories: Category[]
}

export const FilterAndGrid: React.FC<FilterAndGridProps> = ({ products, categories }) => {
  const [filteredCourses, setFilteredCourses] = useState(products)
  const [activeFilters, setActiveFilters] = useState({
    category: [],
  })

  const handleFilterChange = (filters: any) => {
    setActiveFilters(filters)

    let filtered = [...products]
    if (filters.category.length > 0) {
      filtered = filtered.filter((product) => {
        const course = product.course as Course

        return (
          course.categories &&
          course.categories.some((category) =>
            filters.category.includes(
              (category as Category).title.toLowerCase().replace(/\s+/g, ''),
            ),
          )
        )
      })
    }
    setFilteredCourses(filtered)
  }

  return (
    <>
      <CourseFilters
        onFilterChange={handleFilterChange}
        activeFilters={activeFilters}
        filters={categories}
      />
      <div className="mt-8">
        <CourseGrid products={filteredCourses} />
      </div>
    </>
  )
}
