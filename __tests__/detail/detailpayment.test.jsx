import "@testing-library/jest-dom/extend-expect"
import { render, screen } from '@testing-library/react'
import * as React from "react"
import DetailPaymentPage from '../../pages/detailpayment'

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

describe('DetailPaymentPage', () => {
    it('renders default form', () => {
        render(<DetailPaymentPage />);

        expect(screen.getByText('DETAIL PEMBAYARAN')).toBeInTheDocument()
        expect(screen.getByText('Pemilik tagihan:')).toBeInTheDocument()
        expect(screen.getByText('Keterangan')).toBeInTheDocument()
        expect(screen.getByText('Pembayaran')).toBeInTheDocument()
        expect(screen.getByText('Nama Pembayaran')).toBeInTheDocument()
        expect(screen.getByText('Jumlah Pembayaran')).toBeInTheDocument()
        expect(screen.getByText('Waktu Bayar')).toBeInTheDocument()
    })
})