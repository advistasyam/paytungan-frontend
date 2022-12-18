import { css } from "twin.macro"
import { app } from "../../firebase/firebaseClient"
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/router"
import Link from "next/link"
import { useOtp } from "@components/Context/OtpProvider"
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input"

const auth = getAuth(app)

const RegistrationButton = () => {
  const [value, setValue] = useState()
  const router = useRouter()
  const { setConfirmationObject, setNomorTelpon } = useOtp()

  useEffect(() => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
      },
      auth
    )
  }, [])

  const onSubmitRegistration = async e => {
    e.preventDefault()
    toast.loading("Sedang Memproses Pendaftaran Akun Anda")

    if (isValidPhoneNumber(value) == false) {
      toast.dismiss()
      toast.error(`No Telp Terlalu Panjang / Tidak Valid`)
      return
    }

    try {
      const applicationVerifier = window.recaptchaVerifier
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        value,
        applicationVerifier
      )
      setConfirmationObject(confirmationResult)
      setNomorTelpon(value)
      toast.dismiss()
      toast.success(`OTP Telah Dikirimkan ke ${value}`)
      router.push("/verifikasi")
    } catch {
      toast.dismiss()
      toast.error(
        `Anda telah mengirim request 5 kali ke ${value}, coba sesaat lagi`
      )
    }
  }

  return (
    <>
      <div tw="w-full h-full relative justify-center">
        <img src="/images/signup/signup.png" tw="w-full" alt="" />
        <div
          css={[
            css`
              background-color: #fcfcfc;
              height: 65vh;
            `,
          ]}
        >
          <h1 tw="text-hijautua text-4xl font-bold ml-[39px]">Sign Up</h1>
          <form
            tw="mx-[39px] mt-[40px] font-bold"
            onSubmit={onSubmitRegistration}
          >
            <h4>Nomor Telepon</h4>
            <PhoneInput
              placeholder="Contoh : 08123456789"
              required={true}
              defaultCountry="ID"
              value={value}
              onChange={setValue}
              css={css`
                margin-top: 7px;

                input {
                  padding-top: 8px;
                  padding-bottom: 8px;
                  background-color: #e5e7e9;
                  border-radius: 8px;
                  padding-left: 8px;
                }

                input:focus {
                  outline: 2px solid #1cb273;
                }
              `}
            />
            <input
              tw="block mt-[45px] py-3 w-full rounded-xl bg-hijautua text-putih font-bold cursor-pointer"
              type="submit"
              value="Daftar"
              role="btn-daftar"
            />
          </form>
          <p
            tw="text-center text-sm mt-[20px] text-abutiga"
            role="sign-in-button"
          >
            Sudah memiliki akun?
            <span>
              <Link href="/login" passHref>
                <a tw="text-hijautua cursor-pointer"> Sign In</a>
              </Link>
            </span>
          </p>
        </div>
      </div>
      <div id="recaptcha-container"></div>
    </>
  )
}

export { RegistrationButton }
