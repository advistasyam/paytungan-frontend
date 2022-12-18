import { createContext, useContext, useState } from "react"

const OtpContext = createContext({
  confirmationObject: null,
  setConfirmationObject: null,
  nomorTelpon: null,
  setNomorTelpon: null,
})

const OtpProvider = ({ children }) => {
  const [confirmationObject, setConfirmationObject] = useState(null)
  const [nomorTelpon, setNomorTelpon] = useState(null)

  return (
    <OtpContext.Provider
      value={{
        confirmationObject,
        setConfirmationObject,
        nomorTelpon,
        setNomorTelpon,
      }}
    >
      {children}
    </OtpContext.Provider>
  )
}

const useOtp = () => {
  return useContext(OtpContext)
}

export { useOtp, OtpProvider }
