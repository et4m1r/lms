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
    framework: [],
    category: [],
    deployment: [],
  })

  const handleFilterChange = (filters: any) => {
    setActiveFilters(filters)

    let filtered = [...products]

    if (filters.framework.length > 0) {
      filtered = filtered.filter((course) => filters.framework.includes(products.course.categories))
    }

    if (filters.category.length > 0) {
      filtered = filtered.filter((course) => filters.category.includes(products.course.categories))
    }

    if (filters.deployment.length > 0) {
      filtered = filtered.filter((course) => filters.deployment.includes(products.course.categories))
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
