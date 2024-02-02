import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import Content, { TEXT1, TEXT2 } from './Content'

const childrenMock = <div data-testid="childrenMock" />

describe('Content', () => {
  it('should display expected text', async () => {
    render(<Content>{childrenMock}</Content>)
    expect(screen.queryByText(TEXT1)).toBeInTheDocument()
    expect(screen.queryByText(TEXT2)).toBeInTheDocument()
  })

  it('should display child content', async () => {
    render(<Content>{childrenMock}</Content>)
    expect(screen.queryByTestId('childrenMock')).toBeInTheDocument()
  })
})
