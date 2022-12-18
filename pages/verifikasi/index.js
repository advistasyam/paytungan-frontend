import React, { useState, useRef, useEffect } from "react"
import tw, { css } from "twin.macro"
import { useRouter } from "next/router"
import { useOtp } from "@components/Context/OtpProvider"
import toast from "react-hot-toast"
import { app } from "../../firebase/firebaseClient"
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth"

export default function Verifikasi() {
  const router = useRouter()
  const { nomorTelpon, confirmationObject } = useOtp()

  //Check if nomor telpon context is filled
  useEffect(() => {
    if (nomorTelpon == null) {
      router.push("/login")
    }
  }, [])

  const auth = getAuth(app)

  useEffect(() => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
      },
      auth
    )
  }, [])


  const [otp, setOtp] = useState(new Array(6).fill(""))
  const [incorrectOtp, setIncorrectOtp] = useState(false)

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))])

    if (element.value === "") {
      if (element.previousSibling) element.previousSibling.focus()
    } else {
      if (element.nextSibling) element.nextSibling.focus()
    }
  }

  const intervalRef = useRef(null)

  const [timer, setTimer] = useState("00:00:00")
  const [timeIsUp, setTimeIsUp] = useState(false)

  const getTimeRemaining = endtime => {
    const total = Date.parse(endtime) - Date.parse(new Date())
    const seconds = Math.floor((total / 1000) % 60)
    const minutes = Math.floor((total / 1000 / 60) % 60)
    return { total, minutes, seconds }
  }

  const startTimer = deadline => {
    let { total, minutes, seconds } = getTimeRemaining(deadline)
    if (total >= 0) {
      setTimer(
        (minutes > 9 ? minutes : "0" + minutes) +
          ":" +
          (seconds > 9 ? seconds : "0" + seconds)
      )
    } else {
      clearInterval(intervalRef.current)
      setTimeIsUp(true)
    }
  }

  const clearTimer = endtime => {
    setTimer("00:40")
    if (intervalRef.current) clearInterval(intervalRef.current)
    const id = setInterval(() => {
      startTimer(endtime)
    }, 1000)
    intervalRef.current = id
  }

  const getDeadlineTime = () => {
    let deadline = new Date()
    deadline.setSeconds(deadline.getSeconds() + 40)
    return deadline
  }

  useEffect(() => {
    clearTimer(getDeadlineTime())
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const resendOtp = async () => {
    toast.loading("Mengirim Kembali OTP")
    if (intervalRef.current) clearInterval(intervalRef.current)
    clearTimer(getDeadlineTime())
    setTimeIsUp(false)
    try {
      const applicationVerifier = window.recaptchaVerifier
      await signInWithPhoneNumber(auth, nomorTelpon, applicationVerifier)
      toast.dismiss()
      toast.success(`OTP Telah Dikirimkan ke ${nomorTelpon}`)
    } catch {
      toast.dismiss()
      toast.error("Terjadi Kesalahan Pada Jaringan")
    }
  }

  const onVerifySmsCode = async () => {
    toast.loading("Sedang Verifikasi SMS")
    try {
      const code = otp.join("")
      await confirmationObject.confirm(code)
      toast.dismiss()
      toast.success("Kode OTP Terverifikasi")
      router.push("/verifikasi/berhasil")
    } catch {
      toast.dismiss()
      setIncorrectOtp(true)
    }
  }

  return (
    <>
      <div tw="min-h-screen bg-[#1CB273] overflow-x-hidden relative flex flex-col items-center justify-center px-5">
        <img
          src="/images/verifikasi/vektor.png"
          alt=""
          style={{ width: "222px" }}
        />
        <div tw="flex flex-col items-center justify-center gap-y-3 my-4">
          <h1 tw="text-center font-bold text-[#FCFCFC] text-base">
            Kode verifikasi
          </h1>
          <p tw="text-center text-[#FCFCFC]">
            Kami telah mengirimkan kode verifikasi melalui SMS ke nomor{" "}
            {nomorTelpon}
          </p>
        </div>
        <div tw="flex flex-row justify-center gap-2 my-5">
          {otp.map((data, index) => {
            return (
              <input
                role={"input-otp"}
                tw="w-1/6 p-3 rounded text-center text-2xl font-bold focus:outline-none"
                type="text"
                name="otp"
                maxLength="1"
                key={index}
                value={data}
                onChange={e => handleChange(e.target, index)}
                onFocus={e => e.target.select()}
              />
            )
          })}
        </div>
        <div tw="flex flex-col items-center justify-center gap-y-3 mb-4">
          <a
            tw="w-[214px] h-[24px] bg-[#EB4D3D] py-[3px] rounded-2xl text-xs text-center text-[#FCFCFC]"
            css={
              incorrectOtp
                ? css`
                    display: block;
                  `
                : css`
                    display: none;
                  `
            }
          >
            Kode yang kamu masukkan salah.
          </a>
          <div tw="flex gap-x-1">
            <p tw="text-center text-[#FCFCFC]">Kirim ulang kode verifikasi</p>
            <span
              role={"timer"}
              tw="flex flex-row gap-x-1 text-[#FCFCFC]"
              css={
                timeIsUp
                  ? css`
                      display: none;
                    `
                  : css`
                      display: block;
                    `
              }
            >
              dalam {timer}
            </span>
          </div>
          <a
            role={"btn-kirim-ulang"}
            onClick={resendOtp}
            tw="text-center cursor-pointer text-[#F6CB45] text-sm"
            css={!timeIsUp && tw`hidden`}
          >
            Kirim ulang
          </a>
        </div>
        <div tw="container flex flex-col items-center justify-center gap-y-3 my-4">
          <button
            role={"btn-verifikasi"}
            onClick={onVerifySmsCode}
            tw="w-full py-3 bg-[#F6CB45] text-[#2C2C2C] font-bold rounded-lg cursor-pointer"
          >
            Verifikasi
          </button>
          <button
            role={"btn-perbaiki-nomor"}
            tw="w-full py-3 bg-[#FCFCFC] border-[#C4C4C4] font-bold rounded-lg cursor-pointer"
            onClick={() => router.back()}
          >
            Perbaiki Nomor
          </button>
        </div>
      </div>
      <div id="recaptcha-container"></div>
    </>
  )
}
