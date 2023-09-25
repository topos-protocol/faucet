import React, { createContext } from 'react'

interface SuccessesContext {
  setSuccesses: React.Dispatch<React.SetStateAction<string[]>>
}

export const SuccessesContext = createContext<SuccessesContext>({
  setSuccesses: () => {},
})
