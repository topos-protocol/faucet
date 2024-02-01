import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import Header from './Header'

describe('Header', () => {
  it('should display web app logo', async () => {
    render(<Header />)
    expect(screen.queryByRole('img', { name: 'logo' })).toBeInTheDocument()
  })

  it('should display web app title', async () => {
    render(<Header />)
    expect(screen.queryByText('Topos Faucet')).toBeInTheDocument()
  })
})
