'use client'

import { createContext, useContext } from 'react'

export const HeroVisibleContext = createContext(false)
export const useHeroVisible = () => useContext(HeroVisibleContext)
