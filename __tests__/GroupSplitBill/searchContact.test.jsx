import { render, screen } from '@testing-library/react'
import SearchContact from '../../pages/search-contact/index'

JSON.parse = jest.fn(() => {
  return [[],[]]
})

describe('Search Contact', () => {
  it('renders correctly', () => {
    render(<SearchContact />)

    expect(screen.getByText('Pilih Kontak')).toBeInTheDocument()
    expect(screen.getByRole('search-bar')).toBeVisible()
    expect(screen.getByRole('btn-selanjutnya')).toBeVisible()
    expect(screen.getByRole('btn-selanjutnya')).toHaveTextContent('Selanjutnya')
  })
})
