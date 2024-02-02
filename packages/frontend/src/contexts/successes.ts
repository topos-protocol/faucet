import { createContext, Dispatch, SetStateAction } from 'react'

export interface SuccessesContext {
  setSuccesses: Dispatch<SetStateAction<string[]>>
}

export const SuccessesContext = createContext<SuccessesContext>({
  setSuccesses: () => {},
})
