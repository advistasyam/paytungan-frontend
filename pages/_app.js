import { AuthProvider } from "../firebase/AuthProvider"
import { Toaster } from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"
import "@styles/globals.css"
import GlobalStyles from "@styles/GlobalStyles"
import { Navbar } from "@components/Navbar"
import { Splashscreen } from "@components/Splashscreen"
import { useRouter } from "next/router"
import { OtpProvider } from "@components/Context/OtpProvider"
import { PushLogin, PushOnboarding } from "@components/Helper/pushLogin"
import { parseCookies } from "nookies"
import { useEffect } from "react"

function _app({ Component, pageProps }) {
  const variants = {
    hidden: { opacity: 0 },
    enter: { opacity: 1 },
    exit: { opacity: 0 },
  }

  const { asPath } = useRouter()
  const router = useRouter()
  const cookies = parseCookies()

  useEffect(() => {
    if (
      asPath != "/login" &&
      asPath != "/signup" &&
      asPath != "/verifikasi" &&
      asPath != "/verifikasi/berhasil"
    ) {
      const profileCookieData = cookies.profile_data
      const user = cookies.token
      PushLogin(user, router)
      PushOnboarding(router, profileCookieData)
    }
  }, [asPath])

  return (
    <AuthProvider>
      <OtpProvider>
        <GlobalStyles />
        <AnimatePresence exitBeforeEnter={true}>
          <div id="content">
            <Splashscreen />
            <Navbar />
            <motion.main
              variants={variants} // Pass the variant object into Framer Motion
              initial="hidden" // Set the initial state to variants.hidden
              animate="enter" // Animated state to variants.enter
              exit="exit" // Exit state (used later) to variants.exit
              transition={{ type: "linear" }} // Set the transition to linear
              key={asPath}
              style={{ width: "100%" }}
            >
              <Component {...pageProps} />
            </motion.main>
          </div>
        </AnimatePresence>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              marginTop: "30px",
              fontWeight: "bold",
              color: "white",
            },
            success: {
              iconTheme: {
                primary: "white",
                secondary: "#008800",
              },
              style: {
                backgroundColor: "#008800",
              },
            },
            error: {
              iconTheme: {
                primary: "white",
                secondary: "#EB4D3D",
              },
              style: {
                backgroundColor: "#EB4D3D",
              },
            },
            loading: {
              style: {
                backgroundColor: "#999999",
                color: "#F2F4F4",
              },
            },
          }}
        />
      </OtpProvider>
    </AuthProvider>
  )
}

export default _app
