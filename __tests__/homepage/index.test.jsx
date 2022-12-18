import { render, screen} from '@testing-library/react'
import Home from '../../pages'

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

jest.mock('firebase/auth')

describe('Home', () => {
    it('test Homepage Group Split Bill UI', () => {
      render(<Home />)
      expect(screen.getByText('Group Split Bill')).toBeInTheDocument()
    })
  })
