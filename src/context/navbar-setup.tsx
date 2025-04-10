'use client'

import { useEffect } from 'react'
import { useNavigation } from '@/context/navbar-context'
import { EachRoute } from '@/lib/routes-config'
import type { CourseProgress } from '@/lib/course/progress-utils'

export interface NavBarProps {
  key?: React.Key | undefined
  data: EachRoute | undefined
  progress?: CourseProgress | null
}

type ClientNavigationSetupProps = {
  navbarProps: NavBarProps
}

const ClientNavigationSetup = ({ navbarProps }: ClientNavigationSetupProps) => {
  const { setNavigationProps } = useNavigation()
  useEffect(() => {
    setNavigationProps(navbarProps)
  }, [navbarProps, setNavigationProps])

  return null
}

export default ClientNavigationSetup
