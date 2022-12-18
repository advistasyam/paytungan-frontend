import "@testing-library/jest-dom/extend-expect"
import { render, screen } from '@testing-library/react'
import * as React from "react"
import DetailBillPage from '../../pages/detailbill'

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

describe('DetailBillPage', () => {
    it('renders default form', () => {
        render(<DetailBillPage />);

        expect(screen.getByText('DETAIL TAGIHAN')).toBeInTheDocument()
        expect(screen.getByText('Pemilik tagihan:')).toBeInTheDocument()
        expect(screen.getByText('Keterangan')).toBeInTheDocument()
    })
})