import { createContext, Dispatch, SetStateAction } from 'react'

interface SuccessesContext {
  setSuccesses: Dispatch<SetStateAction<string[]>>
}

export const SuccessesContext = createContext<SuccessesContext>({
  setSuccesses: () => {},
})
