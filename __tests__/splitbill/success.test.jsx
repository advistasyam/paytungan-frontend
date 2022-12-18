import "@testing-library/jest-dom/extend-expect"
import { render, screen } from '@testing-library/react'
import * as React from "react"
import SuccessSplitBill from '../../pages/successbill'

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

describe('SuccessSplitBill', () => {
    it('renders default form', () => {
        render(<SuccessSplitBill />);

        expect(screen.getByText('Split bill telah berhasil dibuat!')).toBeInTheDocument()
        expect(screen.getByRole('open-group-btn')).toBeVisible()
    })
})