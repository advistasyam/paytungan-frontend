import "twin.macro"
import nookies from "nookies"
import { app } from "../../firebase/firebaseClient"
import { getAuth, signOut } from "firebase/auth"
import { useRouter } from "next/router"
import toast from "react-hot-toast"

const Logout = () => {
  const auth = getAuth(app)
  const router = useRouter()

  const handleLogout = async () => {
    toast.loading("Sedang Mengeluarkan Akun Anda")
    await signOut(auth)
    nookies.destroy(null, "token")
    // nookies.destroy(null, "profile_data")
    localStorage.removeItem("profile_data")
    toast.dismiss()
    toast.success("Berhasil Logout")
    router.push("/login")
  }

  return (
    <a
      role="button-logout"
      onClick={() => {
        handleLogout()
      }}
    >
      <button tw="rounded-lg border-2 border-[#C4C4C4] w-full h-full p-3">
        {" "}
        Logout{" "}
      </button>
    </a>
  )
}

export { Logout }
