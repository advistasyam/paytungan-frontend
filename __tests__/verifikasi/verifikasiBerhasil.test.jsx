import { render, screen } from '@testing-library/react'
import VerifikasiBerhasil from '../../pages/verifikasi/berhasil'

jest.mock("@components/Context/OtpProvider", () => {
  // const setNomorTelpon = jest.fn()
  // const setConfirmationObject = jest.fn()
  const useOtp = jest.fn(() => {
    const setNomorTelpon = jest.fn()
    const setConfirmationObject = jest.fn()

    return {
      setConfirmationObject,
      setNomorTelpon
    }
  })

  return {
    useOtp: useOtp
  }
})

describe('Verifikasi Berhasil', () => {
  it('renders correctly', () => {
    render(<VerifikasiBerhasil />)

    expect(screen.getByText('Verifikasi Berhasil')).toBeInTheDocument()
    expect(screen.getByText('Terima kasih, nomor telepon Anda sudah berhasil kami verifikasi!')).toBeInTheDocument()
  })
})