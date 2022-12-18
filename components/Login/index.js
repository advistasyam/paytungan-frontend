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
import OnboardingApp from "@components/OnboardingApp"

const LoginPage = () => {
  useEffect(() => {
    setShow(true)
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
      },
      auth
    )
  }, [])

  const auth = getAuth(app)
  const [notelp, setNotelp] = useState()
  const router = useRouter()
  const { setConfirmationObject, setNomorTelpon } = useOtp()
  const [show, setShow] = useState(null)

  const onLoginClickButton = async e => {
    e.preventDefault()
    toast.loading("Memproses Login Anda")
    const applicationVerifier = window.recaptchaVerifier

    if (isValidPhoneNumber(notelp) == false) {
      toast.dismiss()
      toast.error(`No Telp Terlalu Panjang / Tidak Valid`)
      return
    }

    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        notelp,
        applicationVerifier
      )
      setConfirmationObject(confirmationResult)
      setNomorTelpon(notelp)
      toast.dismiss()
      toast.success(`OTP Telah Dikirimkan ke ${notelp}`)
      router.push("/verifikasi")
    } catch {
      toast.dismiss()
      toast.error(
        `Request Dengan Nomor Telpon ${notelp} terlalu banyak, coba sesaat lagi`
      )
    }
  }

  const close = () => {
    setShow(false)
  }

  return (
    <>
      <div tw="w-full h-full relative justify-center">
        <img src="/images/login/login.png" tw="w-full" alt="" />
        <div
          css={[
            css`
              background-color: #fcfcfc;
              height: 65vh;
            `,
          ]}
        >
          <h1 tw="text-hijautua text-4xl font-bold ml-[39px]">Sign In</h1>
          <form
            tw="mx-[39px] mt-[40px] font-bold"
            onSubmit={onLoginClickButton}
          >
            <h4>Nomor Telepon</h4>
            <PhoneInput
              placeholder="Masukkan Nomor Anda"
              required={true}
              limitMaxLength={true}
              defaultCountry="ID"
              value={notelp}
              onChange={setNotelp}
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
              value="Masuk"
              role="btn-masuk"
            />
          </form>
          <p tw="text-center text-sm mt-[20px] text-abutiga">
            Belum memiliki akun?
            <span>
              <Link href="/signup" passHref>
                <a tw="text-hijautua cursor-pointer" role="btn-sign-up">
                  {" "}
                  Sign Up
                </a>
              </Link>
            </span>
          </p>
        </div>
        <OnboardingApp onClose={close} show={show}></OnboardingApp>
      </div>
      
      <div id="recaptcha-container"></div>
    </>
  )
}

export { LoginPage }
