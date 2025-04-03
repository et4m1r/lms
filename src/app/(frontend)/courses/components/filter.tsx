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

const frameworks = [
  { label: 'Next.js', value: 'nextjs' },
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Nuxt', value: 'nuxt' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'SvelteKit', value: 'sveltekit' },
  { label: 'Astro', value: 'astro' },
  { label: 'Solid', value: 'solid' },
]

const deployments = [
  { label: 'Vercel', value: 'vercel' },
  { label: 'Netlify', value: 'netlify' },
  { label: 'AWS', value: 'aws' },
  { label: 'Static', value: 'static' },
]

interface TemplateFiltersProps {
  onFilterChange: (filters: any) => void
  activeFilters: {
    framework: string[]
    category: string[]
    deployment: string[]
  }
  filters: Category[]
}

export function CourseFilters({ onFilterChange, activeFilters, filters }: TemplateFiltersProps) {

  const categories = filters.map((category) => ({
    label: category.title,
    value: category.title.toLowerCase().replace(/\s+/g, ''),
  }))

  const handleFrameworkChange = (value: string) => {
    const newFrameworks = activeFilters.framework.includes(value)
      ? activeFilters.framework.filter((f) => f !== value)
      : [...activeFilters.framework, value]

    onFilterChange({
      ...activeFilters,
      framework: newFrameworks,
    })
  }

  const handleCategoryChange = (value: string) => {
    const newCategories = activeFilters.category.includes(value)
      ? activeFilters.category.filter((c) => c !== value)
      : [...activeFilters.category, value]

    onFilterChange({
      ...activeFilters,
      category: newCategories,
    })
  }

  const handleDeploymentChange = (value: string) => {
    const newDeployments = activeFilters.deployment.includes(value)
      ? activeFilters.deployment.filter((d) => d !== value)
      : [...activeFilters.deployment, value]

    onFilterChange({
      ...activeFilters,
      deployment: newDeployments,
    })
  }

  const clearFilters = () => {
    onFilterChange({
      framework: [],
      category: [],
      deployment: [],
    })
  }

  const totalActiveFilters =
    activeFilters.framework.length + activeFilters.category.length + activeFilters.deployment.length

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-wrap gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-9 border-[#eaeaea] dark:border-[#333] text-sm font-normal"
            >
              Framework
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Select Framework</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {frameworks.map((framework) => (
              <DropdownMenuCheckboxItem
                key={framework.value}
                checked={activeFilters.framework.includes(framework.value)}
                onCheckedChange={() => handleFrameworkChange(framework.value)}
              >
                {framework.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-9 border-[#eaeaea] dark:border-[#333] text-sm font-normal"
            >
              Deployment
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Select Deployment</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {deployments.map((deployment) => (
              <DropdownMenuCheckboxItem
                key={deployment.value}
                checked={activeFilters.deployment.includes(deployment.value)}
                onCheckedChange={() => handleDeploymentChange(deployment.value)}
              >
                {deployment.label}
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
          {activeFilters.framework.map((framework) => {
            const label = frameworks.find((f) => f.value === framework)?.label
            return (
              <Badge
                key={framework}
                variant="outline"
                className="rounded-md h-7 px-2 border-[#eaeaea] dark:border-[#333] text-sm font-normal"
              >
                {label}
                <X
                  className="ml-1 h-3 w-3 cursor-pointer"
                  onClick={() => handleFrameworkChange(framework)}
                />
              </Badge>
            )
          })}

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

          {activeFilters.deployment.map((deployment) => {
            const label = deployments.find((d) => d.value === deployment)?.label
            return (
              <Badge
                key={deployment}
                variant="outline"
                className="rounded-md h-7 px-2 border-[#eaeaea] dark:border-[#333] text-sm font-normal"
              >
                {label}
                <X
                  className="ml-1 h-3 w-3 cursor-pointer"
                  onClick={() => handleDeploymentChange(deployment)}
                />
              </Badge>
            )
          })}
        </div>
      )}
    </div>
  )
}
