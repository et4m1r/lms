'use client'
import React, { createContext, useContext, useState } from 'react'
import { NavBarProps } from './navbar-setup'

type NavigationContextType = {
  navigationProps: NavBarProps
  setNavigationProps: React.Dispatch<React.SetStateAction<any>>
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export const useNavigation = () => {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [navigationProps, setNavigationProps] = useState<any>({}) // Provide your initial state here

  return (
    <NavigationContext.Provider value={{ navigationProps, setNavigationProps }}>
      {children}
    </NavigationContext.Provider>
  )
}
