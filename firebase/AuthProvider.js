import { createContext, useContext, useEffect, useState } from "react"
import { getAuth } from "firebase/auth"
import { app } from "../firebase/firebaseClient"
import nookies from "nookies"

const auth = getAuth(app)

const AuthContext = createContext({
  user: null,
  uid: null,
})

const setToken = token => {
  const isDevelopment = window.location.hostname == "localhost"

  let options = {
    path: "/",
  }

  if (!isDevelopment) {
    options = {
      secure: true,
      sameSite: "None",
      domain: "." + window.location.hostname.replace("www.", ""),
      ...options,
    }
  }

  nookies.set(null, "token", token, options)
}

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [uid, setUid] = useState(null)

  useEffect(() => {
    if (typeof window != undefined) {
      window.nookies = nookies
    }
    return auth.onIdTokenChanged(async userChange => {
      if (!userChange) {
        setUser(null)
        setUid(null)
        nookies.destroy(null, "token")
        setToken("")
        return
      }

      console.info(`Updating JWT Token`)
      const token = await userChange.getIdTokenResult()

      setUser(userChange)
      setUid(userChange.uid)
      nookies.destroy(null, "token")
      setToken(token.token)

      return
    })
  }, [])

  // force refresh the token every 30 minutes
  useEffect(() => {
    const handle = setInterval(async () => {
      console.info(`Refreshing JWT Token`)
      const userRefresh = auth.currentUser
      if (userRefresh) await userRefresh.getIdTokenResult(true)
    }, 30 * 60 * 1000)
    return () => clearInterval(handle)
  }, [])

  return (
    <AuthContext.Provider value={{ user, uid }}>
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => {
  return useContext(AuthContext)
}

export { useAuth, AuthProvider }
