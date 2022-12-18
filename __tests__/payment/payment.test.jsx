import { render, screen } from '@testing-library/react'
import PaymentPage from '../../pages/payment/index'

jest.mock('next/router', () => {
  const useRouter = jest.fn(() => {
      return {
          isReady: "ready"
      }
  })

  return {
      useRouter: useRouter
  }
})

describe('Payment Page', () => {
  it('renders correctly', () => {
    render(<PaymentPage />)

    expect(screen.getByRole('container-payment')).toBeInTheDocument()
    expect(screen.getByRole('loading-animation')).toBeInTheDocument()
  })
})
