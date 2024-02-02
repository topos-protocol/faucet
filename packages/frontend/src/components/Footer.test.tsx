import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import packageJson from '../../../../package.json'
import Footer from './Footer'

describe('Footer', () => {
  it('should display expected test', async () => {
    const expectedText = `zk Foundation © ${new Date().getFullYear()}`
    render(<Footer />)
    expect(screen.queryByText(expectedText)).toBeInTheDocument()
    expect(screen.queryByText(`v${packageJson.version}`)).toBeInTheDocument()
  })
})
