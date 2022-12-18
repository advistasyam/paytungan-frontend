import { render, screen } from "@testing-library/react"
import Onboarding from "../../pages/onboarding"

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

test('Onboarding', async () => {
    render(<Onboarding />)
    expect(screen.getByRole('heading', {level:1})).toHaveTextContent('Registrasi Data Diri')

    // Testing components that should be on the screen
    expect(screen.getByRole('user-foto')).toBeInTheDocument()
    expect(screen.getByText('Nomor Telepon')).toBeInTheDocument()
    expect(screen.getByText('Username')).toBeInTheDocument()
    expect(screen.getByText('Nama Lengkap')).toBeInTheDocument()

    expect(screen.getByRole('button-masuk')).toBeVisible()
    expect(screen.getByRole('button-masuk')).toHaveTextContent('Masuk ke Aplikasi')
})