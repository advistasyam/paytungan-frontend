import "twin.macro"
import Head from "next/head"
import toast from "react-hot-toast"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { parseCookies } from "nookies"
import { getBackendUrl } from "@components/Constanta"

const DetailBill = () => {
  const router = useRouter()
  const cookies = parseCookies()
  const BE_URL = getBackendUrl()
  const accessToken = cookies.token

  const [bill_details, setBillDetails] = useState([])
  const [bill_data, setBillData] = useState({})
  const [profile_data, setUserData] = useState({})
  const [originName, setOriginName] = useState("")
  const [isBayarEligible, setIsBayarEligible] = useState(false)
  const [urlPayment, setUrlPayment] = useState("")
  const [isCreateNewPayment, setIsCreateNewPayment] = useState(false)

  const setBill = async (dataBill, idBill) => {
    dataBill = dataBill.data
    const detailsBill = JSON.parse(dataBill.details)
    const dataUser = JSON.parse(localStorage.getItem("profile_data"))
    setUserData(dataUser)
    setBillDetails(detailsBill)
    setBillData(dataBill)

    if (
      dataBill.status == "PENDING" &&
      dataBill.user.username === dataUser.username
    ) {
      await getPaymentStatus(idBill)
    }
  }

  const getDataBill = async () => {
    try {
      const idBill = router.query.idBill
      const responseBill = await fetch(BE_URL + "/api/bills/get?id=" + idBill, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authentication: accessToken,
        },
      })

      if (!responseBill.ok) {
        const responseError = await responseBill.json()
        const message = `${responseError.errors.error_message}`
        throw new Error(message)
      }

      const responseDataBill = await responseBill.json()

      await setBill(responseDataBill, idBill)
    } catch (error) {
      console.log(error)
      toast.error("Terjadi kesalahan. Mohon dicoba kembali")
    }
  }

  const getPaymentStatus = async idBill => {
    try {
      const responsePaymentByBill = await fetch(
        BE_URL + "/api/payments/get/bill_id?bill_id=" + idBill,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authentication: accessToken,
          },
        }
      )
      const dataResponsePaymentByBill = await responsePaymentByBill.json()

      if (!responsePaymentByBill.ok) {
        const message = `${dataResponsePaymentByBill.errors.error_message}`
        throw new Error(message)
      }

      if (dataResponsePaymentByBill?.data != null) {
        // Set Url Xendit
        const responsePaymentById = await fetch(
          BE_URL + "/api/payments/get?id=" + dataResponsePaymentByBill.data.id,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        const dataResponsePaymentById = await responsePaymentById.json()

        if (!responsePaymentById.ok) {
          const message = `${dataResponsePaymentById.errors.error_message}`
          throw new Error(message)
        }

        setUrlPayment(dataResponsePaymentById.data.payment_url)
        setIsBayarEligible(true)
      } else {
        // Create new payment
        setIsCreateNewPayment(true)
      }
    } catch (error) {
      console.log(error)
      toast.error("Terjadi kesalahan. Mohon dicoba kembali")
    }
  }

  const createNewPaymentAPI = async () => {
    toast.loading("Sedang membuat link pembayaran")
    const idBill = router.query.idBill
    const data = {
      bill_id: parseInt(router.query.idBill),
      success_redirect_url: originName + "/payment-success/?idBill=" + idBill,
      failure_redirect_url: originName,
    }

    try {
      const createPayment = await fetch(BE_URL + "/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authentication: accessToken,
        },
        body: JSON.stringify(data),
      })

      if (!createPayment.ok) {
        const errorCreatePayment = await createPayment.json()
        const message = `${errorCreatePayment.errors.error_message}`
        throw new Error(message)
      }

      const responseCreatePayment = await createPayment.json()

      toast.dismiss()
      toast.success("Berhasil Membuat Link Pembayaran")
      router.push(`/payment?idPayment=${responseCreatePayment.data.id}`)
    } catch (error) {
      toast.dismiss()
      toast.error("Terjadi kesalahan. Mohon dicoba kembali")
    }
  }

  useEffect(() => {
    if (router.isReady) {
      getDataBill()
      setOriginName(window.location.origin)
    }
  }, [router.isReady])

  return (
    <>
      <Head>
        <title>Paytungan - Detail Bill</title>
        <meta name="description" content="Paytungan Split Bill App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div tw="z-50 w-full max-w-[500px] flex items-center justify-center h-[67px] shadow-md fixed top-0 bg-white">
        <div
          tw="absolute left-[30px] top-[23px] cursor-pointer"
          onClick={() => {
            router.back()
          }}
        >
          <img src="/images/input-bill/back.svg" />
        </div>
        <h1 tw="font-bold">DETAIL TAGIHAN</h1>
      </div>
      <div tw="z-10 relative justify-center container mx-auto w-full h-full mt-[67px] bg-[#FCFCFC]">
        <img
          tw="absolute w-full h-auto"
          src="/images/detail/detailBG.png"
          alt=""
        />
        <div tw="z-30 relative flex flex-col pt-6">
          <div tw="flex flex-col items-center justify-center mx-[39px]">
            <div tw="flex flex-col text-lg text-white font-bold justify-start mx-4 w-full">
              <h1>
                Pemilik tagihan: <span>{bill_data?.user?.name}</span>
              </h1>
              <h1 tw="pt-4">Keterangan </h1>
            </div>
          </div>
          <div tw="flex flex-col items-center justify-center mx-[39px] pt-2">
            <div tw="flex flex-col text-sm bg-abusatu rounded-xl w-full px-4 py-4 min-h-[50px]">
              <>
                {bill_details?.map((value, index) => {
                  return (
                    <div
                      key={index}
                      tw="flex items-center justify-between w-full"
                    >
                      <div tw="pt-2 flex">{value.title}</div>
                      <div tw="flex text-right">{value.expanse}</div>
                    </div>
                  )
                })}
              </>
              {bill_data?.amount ? (
                <h1 tw="pt-4 font-bold">
                  Total (+ Biaya Admin)
                  <span tw="float-right">{bill_data?.amount}</span>
                </h1>
              ) : (
                <div tw="pl-2 flex items-center justify-center overflow-y-hidden overflow-x-hidden">
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
          <div tw="grid z-40 pt-10 px-[39px]">
            {bill_data?.user?.username &&
              bill_data?.user?.username === profile_data?.username &&
              isBayarEligible && (
                <>
                  <div role="pay-btn"></div>
                  <a
                    tw="z-40 text-center rounded-lg justify-self-center font-bold bg-[#F6CB45] w-full py-4"
                    href={urlPayment}
                  >
                    Bayar
                  </a>
                </>
              )}
            {bill_data?.user?.username &&
              bill_data?.user?.username === profile_data?.username &&
              isCreateNewPayment && (
                <>
                  <div role="pay-btn"></div>
                  <button
                    tw="z-40 rounded-lg justify-self-center font-bold bg-[#F6CB45] w-full py-4"
                    onClick={() => {
                      createNewPaymentAPI()
                    }}
                  >
                    Bayar
                  </button>
                </>
              )}
          </div>
        </div>
      </div>
    </>
  )
}

export { DetailBill }
