import Head from "next/head"
import { LoginPage } from "@components/Login"
import { useAuth } from "../firebase/AuthProvider"
import { useRouter } from "next/router"

export default function Login() {
  const { user } = useAuth()
  const router = useRouter()

  if (user !== null) {
    router.push("/")
  }

  return (
    <>
      <Head>
        <title>Paytungan - Login Page</title>
        <meta name="description" content="Paytungan Split Bill App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {user === null && <LoginPage />}
    </>
  )
}
