import { render, screen } from '@testing-library/react'
import HelpCenterPage from '../../pages/help-center'

describe('Help Center Page', () => {
  it('renders correctly', () => {
    render(<HelpCenterPage />)

    expect(screen.getByText('Bantuan')).toBeInTheDocument()
    expect(screen.getByText('Anda memiliki pertanyaan lain?')).toBeInTheDocument()
    expect(screen.getByRole('contact-number')).toBeVisible()
  })
})
