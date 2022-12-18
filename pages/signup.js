import Head from "next/head"
import { RegistrationButton } from "@components/Registration"
import { useAuth } from "../firebase/AuthProvider"
import { useRouter } from "next/router"

export default function SignUp() {
  const { user } = useAuth()
  const router = useRouter()

  if (user !== null) {
    router.push("/")
  }

  return (
    <>
      <Head>
        <title>Paytungan - Signup Page</title>
        <meta name="description" content="Paytungan Split Bill App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {user === null && <RegistrationButton />}
    </>
  )
}
