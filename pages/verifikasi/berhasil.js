import "twin.macro"
import Link from "next/link"
import { useOtp } from "@components/Context/OtpProvider"
import { useEffect, useState } from "react"
import { getBackendUrl } from "@components/Constanta"
import toast from "react-hot-toast"
import { parseCookies } from "nookies"

export default function Berhasil() {
  const [onboarding, setOnboarding] = useState("not set")
  const { setNomorTelpon, setConfirmationObject } = useOtp()
  const BE_URL = getBackendUrl()

  useEffect(() => {
    setConfirmationObject(null)
    setNomorTelpon(null)

    async function checkIsOnboarding() {
      const cookies = parseCookies()
      const data = {
        token: cookies.token,
      }

      try {
        const response = await fetch(BE_URL + "/api/authentication/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })

        const responseData = await response.json()

        localStorage.setItem("profile_data", JSON.stringify(responseData.data))

        if (!response.ok) {
          const message = `An error has occured: ${response.status}`
          throw new Error(message)
        }

        if (responseData["data"]["is_onboarding"] == false) {
          setOnboarding(false)
        } else {
          setOnboarding(true)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }

    checkIsOnboarding()
  }, [])

  return (
    <div tw="h-[100vh] w-full bg-[#1CB273] overflow-x-hidden relative flex flex-col items-center justify-center">
      <img
        tw="absolute bottom-0 right-0 z-10"
        src="/images/verifikasi/right_bottom.png"
        alt=""
      />
      <img
        tw="absolute top-0 left-0 z-10"
        src="/images/verifikasi/left_top.png"
        alt=""
      />
      <div tw="h-full w-full z-20 flex justify-center items-center flex-col">
        <h1 tw="mb-5 font-bold text-[#FCFCFC] text-2xl">Verifikasi Berhasil</h1>
        <img
          tw="my-5 w-[160px]"
          src="/images/verifikasi/checkCircle.png"
          alt=""
        />
        <p tw="text-center my-5 text-[#FCFCFC] px-6">
          Terima kasih, nomor telepon Anda sudah berhasil kami verifikasi!
        </p>
        <div tw="container flex mx-auto items-center justify-center my-4 px-5">
          {onboarding == "not set" ? (
            <button
              type="button"
              tw="w-full py-3 bg-[#F6CB45] text-[#2C2C2C] font-bold rounded-lg transition ease-in-out duration-150 cursor-not-allowed"
              disabled=""
            >
              <div tw="flex items-center justify-center w-full h-full">
                <svg
                  tw="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    tw="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    tw="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p>Menyiapkan Akun Anda...</p>
              </div>
            </button>
          ) : (
            <Link href={onboarding == true ? "/onboarding" : "/"} passHref>
              <button
                role={"btn-isi-data-diri"}
                tw="w-full py-3 bg-[#F6CB45] text-[#2C2C2C] font-bold rounded-lg cursor-pointer"
              >
                {onboarding == true ? "Isi Data Diri" : "Ke Beranda"}
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
