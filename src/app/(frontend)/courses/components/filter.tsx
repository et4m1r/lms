'use client'
import { ChevronDown, Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Category } from '@/payload-types'

interface TemplateFiltersProps {
  onFilterChange: (filters: any) => void
  activeFilters: {
    category: string[]
  }
  filters: Category[]
}

export function CourseFilters({ onFilterChange, activeFilters, filters }: TemplateFiltersProps) {
  const categories = filters.map((category) => ({
    label: category.title,
    value: category.title.toLowerCase().replace(/\s+/g, ''),
  }))

  const handleCategoryChange = (value: string) => {
    const newCategories = activeFilters.category.includes(value)
      ? activeFilters.category.filter((c) => c !== value)
      : [...activeFilters.category, value]

    onFilterChange({
      ...activeFilters,
      category: newCategories,
    })
  }

  const clearFilters = () => {
    onFilterChange({
      category: [],
    })
  }

  const totalActiveFilters = activeFilters.category.length

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-wrap gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-9 border-[#eaeaea] dark:border-[#333] text-sm font-normal"
            >
              Category
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Select Category</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {categories.map((category) => (
              <DropdownMenuCheckboxItem
                key={category.value}
                checked={activeFilters.category.includes(category.value)}
                onCheckedChange={() => handleCategoryChange(category.value)}
              >
                {category.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="outline"
          size="sm"
          className="h-9 border-[#eaeaea] dark:border-[#333] text-sm font-normal"
        >
          <Filter className="mr-2 h-4 w-4" />
          More Filters
        </Button>

        {totalActiveFilters > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-9 text-sm font-normal text-[#666] dark:text-[#888]"
          >
            Clear filters
          </Button>
        )}
      </div>

      {totalActiveFilters > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.category.map((category) => {
            const label = categories.find((c) => c.value === category)?.label
            return (
              <Badge
                key={category}
                variant="outline"
                className="rounded-md h-7 px-2 border-[#eaeaea] dark:border-[#333] text-sm font-normal"
              >
                {label}
                <X
                  className="ml-1 h-3 w-3 cursor-pointer"
                  onClick={() => handleCategoryChange(category)}
                />
              </Badge>
            )
          })}
        </div>
      )}
    </div>
  )
}
