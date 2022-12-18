import "twin.macro"
import { Topnavbar } from "@components/Topnavbar"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import toast from "react-hot-toast"
import { getBackendUrl } from "@components/Constanta"

export default function PaymentPage() {
  const router = useRouter()
  const BE_URL = getBackendUrl()
  const [dataPayment, setDataPayment] = useState({})

  const getPaymentData = async () => {
    try {
      const idPayment = router.query.idPayment
      const responsePayment = await fetch(
        BE_URL + "/api/payments/get?id=" + idPayment,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      if (!responsePayment.ok) {
        const responseError = await responsePayment.json()
        const message = `${responseError.errors.error_message}`
        throw new Error(message)
      }

      const responseDataPayment = await responsePayment.json()
      const dateJs = new Date(responseDataPayment.data.expiry_date)
      responseDataPayment["data"]["strDate"] = dateJs.toDateString() + " " + dateJs.toLocaleTimeString()
      setDataPayment(responseDataPayment.data)
    } catch (error) {
      console.log(error)
      toast.error("Terjadi kesalahan. Mohon dicoba kembali")
    }
  }

  useEffect(() => {
    if (router.isReady) {
      getPaymentData()
    }
  }, [router.isReady])

  return (
    <>
      <Topnavbar />
      <div tw="min-h-screen w-full bg-hijautua relative flex flex-col gap-5 p-5">
        <img
          tw="absolute bottom-0 right-0 z-0"
          src="/images/SearchContact/right_bottom.png"
          alt=""
        />
        <img
          tw="absolute top-0 left-0 z-0"
          src="/images/SearchContact/left_top.png"
          alt=""
        />
        <div tw="container mx-auto flex flex-col gap-11 items-center justify-center pt-[10vh] px-3 text-putih text-center z-10" role="container-payment">
          {dataPayment?.id ? (
            <>
              <h1 tw="text-2xl font-bold">Menunggu Pembayaran</h1>
              <img
                src="/images/payment/time.png"
                alt="time"
                role={"time-vector"}
              />
              <p role={"description"}>
                Mohon bayar sebesar Rp{dataPayment?.amount} sebelum {dataPayment?.strDate}
              </p>
              <a
                role={"btn-action"}
                tw="bg-kuning mx-auto text-hitam font-bold rounded-lg cursor-pointer z-20 w-full py-3"
                href={dataPayment?.payment_url}
              >
                Bayar
              </a>
            </>
          ) : (
            <div tw="pl-2 flex items-center justify-center overflow-y-hidden overflow-x-hidden" role="loading-animation">
              <svg
                tw="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
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
            </div>
          )}
        </div>
      </div>
    </>
  )
}
