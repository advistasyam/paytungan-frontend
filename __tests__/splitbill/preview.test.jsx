import "@testing-library/jest-dom/extend-expect"
import { render, screen } from '@testing-library/react'
import * as React from "react"
import PreviewSplitBill from '../../pages/previewbill'

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

describe('PreviewSplitBill', () => {
    it('renders default form', () => {
        render(<PreviewSplitBill />);

        expect(screen.getByText('INPUT BILL')).toBeInTheDocument()
        expect(screen.getByText('Total Pengeluaran:')).toBeInTheDocument()
        expect(screen.getByRole('create-group-btn')).toBeVisible()
    })
})