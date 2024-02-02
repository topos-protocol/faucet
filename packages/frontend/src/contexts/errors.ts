import { createContext, Dispatch, SetStateAction } from 'react'

export interface ErrorsContext {
  setErrors: Dispatch<SetStateAction<string[]>>
}

export const ErrorsContext = createContext<ErrorsContext>({
  setErrors: () => {},
})
