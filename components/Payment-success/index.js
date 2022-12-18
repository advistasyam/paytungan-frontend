import "twin.macro"
import { Topnavbar } from "@components/Topnavbar"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { parseCookies } from "nookies"
import { getBackendUrl } from "@components/Constanta"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const PaymentSuccess = () => {
  const router = useRouter()
  const cookies = parseCookies()
  const [dataPayment, setDataPayment] = useState({})
  const [dataBill, setDataBill] = useState({})
  const [dataSplitBill, setDataSplitBill] = useState({ name: "" })
  const BE_URL = getBackendUrl()
  const accessToken = cookies.token

  const setData = (
    responseDataBill,
    responseDataSplitBill,
    responseDataPayment
  ) => {
    responseDataBill = responseDataBill.data
    responseDataSplitBill = responseDataSplitBill.data
    responseDataPayment = responseDataPayment.data

    const dateJs = new Date(responseDataPayment.invoice.paid_at)
    responseDataPayment["strDate"] =
      dateJs.toDateString() + " " + dateJs.toLocaleTimeString()

    responseDataSplitBill["restaurant_name"] = JSON.parse(
      responseDataSplitBill.details
    ).name

    setDataPayment(responseDataPayment)
    setDataSplitBill(responseDataSplitBill)
    setDataBill(responseDataBill)
  }

  const getData = async () => {
    try {
      const idBill = router.query.idBill

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

      const responseBill = await fetch(BE_URL + "/api/bills/get?id=" + idBill, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const dataResponseBill = await responseBill.json()

      if (!responseBill.ok) {
        const message = `${dataResponseBill.errors.error_message}`
        throw new Error(message)
      }

      const responseSplitBill = await fetch(
        BE_URL +
          "/api/split-bills/get?id=" +
          dataResponseBill?.data?.split_bill_id,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      const dataResponseSplitBill = await responseSplitBill.json()

      if (!responseSplitBill.ok) {
        const message = `${dataResponseSplitBill.errors.error_message}`
        throw new Error(message)
      }

      const dataPost = {
        bill_id: parseInt(idBill),
      }

      const responseUpdatePaid = await fetch(
        BE_URL + "/api/payments/update/paid",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authentication: accessToken,
          },
          body: JSON.stringify(dataPost),
        }
      )
      const dataResponseUpdatePaid = await responseUpdatePaid.json()

      if (!responseSplitBill.ok) {
        const message = `${dataResponseUpdatePaid.errors.error_message}`
        throw new Error(message)
      }

      setData(dataResponseBill, dataResponseSplitBill, dataResponsePaymentById)
    } catch (error) {
      console.log(error)
      toast.error("Terjadi kesalahan. Mohon dicoba kembali")
    }
  }

  useEffect(() => {
    if (router.isReady) {
      getData()
    }
  }, [router.isReady])

  return (
    <div tw="overflow-x-hidden overflow-y-hidden w-full">
      <Head>
        <title>Paytungan - Payment Success</title>
        <meta name="description" content="Paytungan Split Bill App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Topnavbar />
      <div tw="bg-[#1CB273] overflow-x-hidden min-h-screen relative items-center justify-center">
        <h4 tw="text-putih text-center text-2xl font-bold mt-[106px]">
          Pembayaran Berhasil
        </h4>
        <div tw="flex items-center justify-center">
          <img
            src="/images/payment_success/icon.png"
            tw="w-[250px] h-[184px] mt-[33px]"
            alt=""
          />
        </div>

        <div tw="container h-full">
          {dataSplitBill?.name == "" ? (
            <>
              <img
                src="/images/payment_success/rounded rectangle.png"
                tw="w-full absolute"
                alt=""
              />
              <div tw="pt-12 pl-2 flex items-center justify-center overflow-y-hidden overflow-x-hidden">
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
            </>
          ) : (
            <>
              <img
                src="/images/payment_success/rounded rectangle.png"
                tw="w-full absolute"
                alt=""
              />
              <div tw="flex flex-col items-center justify-center absolute w-full z-40">
                <p tw="text-hijautua text-center text-xl font-bold mt-[38px]">
                  Informasi Pembayaran
                </p>
                <div tw="flex flex-row justify-between items-center w-full px-[39px] pt-[31px]">
                  <p tw="font-bold">Nomor pembayaran</p>
                  <p tw="text-right">{dataPayment?.number}</p>
                </div>
                <div tw="flex flex-row justify-between items-center w-full px-[39px] pt-[20px]">
                  <p tw="font-bold">Nama Pembayaran</p>
                  <p tw="text-right">{dataSplitBill?.restaurant_name}</p>
                </div>
                <div tw="flex flex-row justify-between items-center w-full px-[39px] pt-[20px]">
                  <p tw="font-bold">Jumlah Pembayaran</p>
                  <p tw="text-right">{dataPayment?.amount}</p>
                </div>
                <div tw="flex flex-row justify-between items-center w-full px-[39px] pt-[20px]">
                  <p tw="font-bold">Pemilik Pembayaran</p>
                  <p tw="text-right">{dataBill?.user?.name}</p>
                </div>
                <div tw="flex flex-row justify-between items-center w-full px-[39px] pt-[20px]">
                  <p tw="font-bold">Waktu Bayar</p>
                  <p tw="text-right">{dataPayment?.strDate}</p>
                </div>
                <Link
                  href="/tagihan/[dataSplitBill.id]"
                  as={`/tagihan/${dataSplitBill.id}`}
                  passHref
                >
                  <div tw="px-[39px] w-full flex justify-center bg-[#FCFCFC] pb-[30px]">
                    <input
                      tw="mt-[45px] py-3 w-full rounded-xl bg-hijautua text-putih font-bold cursor-pointer"
                      type="submit"
                      value="Buka grup"
                    />
                  </div>
                </Link>
              </div>
            </>
          )}
        </div>
        <div tw="bg-[#FCFCFC] relative bottom-[-250px] h-[350px] z-[39]" />
      </div>
    </div>
  )
}

export { PaymentSuccess }
