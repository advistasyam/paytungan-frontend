import { render, screen } from '@testing-library/react'
import Verifikasi from '../../pages/verifikasi/index'

jest.mock('firebase/app', () => {
  const initializeApp = jest.fn()
  const getApp = jest.fn()
  const getApps = jest.fn(() => {
      return {
          length: 1
      }
  })

  return {
      getApp: getApp,
      getApps: getApps,
      initializeApp: initializeApp
  }
})

jest.mock('firebase/auth')

jest.mock('next/router', () => ({
  useRouter() {
    return ({
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
      push: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn()
      },
      beforePopState: jest.fn(() => null),
      prefetch: jest.fn(() => null)
    })
  },
}))

describe('Verifikasi', () => {
  it('renders correctly', () => {
    render(<Verifikasi />)

    expect(screen.getByText('Kode verifikasi')).toBeInTheDocument()
    expect(screen.getByRole('timer')).toBeVisible()
    expect(screen.getByRole('btn-verifikasi')).toBeVisible()
    expect(screen.getByRole('btn-verifikasi')).toHaveTextContent('Verifikasi')
    expect(screen.getByRole('btn-perbaiki-nomor')).toBeVisible()
    expect(screen.getByRole('btn-perbaiki-nomor')).toHaveTextContent('Perbaiki Nomor')
    expect(screen.getByRole('btn-kirim-ulang')).toBeVisible()
    expect(screen.getByRole('btn-kirim-ulang')).toHaveTextContent('Kirim ulang')
  })
})