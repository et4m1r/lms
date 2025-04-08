'use client'

import { useEffect } from 'react'
import { useNavigation } from '@/context/navbar-context'
import { EachRoute } from '@/lib/routes-config'

export interface NavBarProps {
  key?: React.Key | undefined
  data: EachRoute | undefined
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
