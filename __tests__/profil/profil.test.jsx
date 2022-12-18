import { render, screen } from '@testing-library/react'
import Profil from '../../pages/profil/index'
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

JSON.parse = jest.fn().mockImplementationOnce(() => {
  console.log("parsed")
})

describe('Profil', () => {
    it('renders correctly', () => {
        render(<Profil/>)
    })
})