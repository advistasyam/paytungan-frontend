import "@testing-library/jest-dom/extend-expect"
import { render, screen } from '@testing-library/react'
import * as React from "react"
import SignUp from '../../pages/signup'

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

describe('SignUp', () => {
    it('renders default form', () => {
        render(<SignUp />);

        expect(screen.getByText('Sign Up')).toBeInTheDocument()
        expect(screen.getByText('Nomor Telepon')).toBeInTheDocument()
        expect(screen.getByRole('btn-daftar')).toBeVisible()
        expect(screen.getByRole('sign-in-button')).toBeVisible()
    })
})