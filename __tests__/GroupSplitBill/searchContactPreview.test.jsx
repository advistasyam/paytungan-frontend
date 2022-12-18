import { render, screen } from '@testing-library/react'
import SearchContactPreview from '../../pages/search-contact/preview'

JSON.parse = jest.fn(() => {
  return [[],[]]
})

describe('Search Contact', () => {
  it('renders correctly', () => {
    render(<SearchContactPreview />)

    expect(screen.getByText('Anggota Grup')).toBeInTheDocument()
    expect(screen.getByRole('anggota-grup')).toBeInTheDocument()
    expect(screen.getByRole('btn-selanjutnya')).toBeVisible()
    expect(screen.getByRole('btn-selanjutnya')).toHaveTextContent('Selanjutnya')
  })
})
