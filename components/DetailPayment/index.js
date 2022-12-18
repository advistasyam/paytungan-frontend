import "twin.macro"
import Head from "next/head"
import toast from "react-hot-toast"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { parseCookies } from "nookies"
import { getBackendUrl } from "@components/Constanta"

const DetailPayment = () => {
  const router = useRouter()
  const cookies = parseCookies()
  const BE_URL = getBackendUrl()
  const accessToken = cookies.token

  const [bill, setBill] = useState({})
  const [split_bill, setSplitBill] = useState({})
  const [details_split_bill, setDetailsBill] = useState({})
  const [dateString, setDateString] = useState("")

  const setData = (data_bill, data_split_bill) => {
    data_bill = data_bill.data
    data_split_bill = data_split_bill.data
    const detailsSplitBill = JSON.parse(data_split_bill.details)
    const dateJs = new Date(data_bill.updated_at)
    setDateString(dateJs.toDateString() + " " + dateJs.toLocaleTimeString())
    setBill(data_bill)
    setSplitBill(data_split_bill)
    setDetailsBill(detailsSplitBill)
  }

  const getData = async () => {
    try {
      const idBill = router.query.idBill
      const idSplitBill = router.query.idSplitBill
      const responseBill = await fetch(BE_URL + "/api/bills/get?id=" + idBill, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authentication: accessToken,
        },
      })

      const responseSplitBill = await fetch(
        BE_URL + "/api/split-bills/get?id=" + idSplitBill,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authentication: accessToken,
          },
        }
      )

      if (!responseBill.ok) {
        const responseError = await responseBill.json()
        const message = `${responseError.errors.error_message}`
        throw new Error(message)
      }

      if (!responseSplitBill.ok) {
        const responseError = await responseSplitBill.json()
        const message = `${responseError.errors.error_message}`
        throw new Error(message)
      }

      const response_bill = await responseBill.json()
      const response_split_bill = await responseSplitBill.json()

      setData(response_bill, response_split_bill)
    } catch (error) {
      toast.error("Terjadi kesalahan. Mohon dicoba kembali")
    }
  }

  useEffect(() => {
    if (router.isReady) {
      getData()
    }
  }, [router.isReady])

  return (
    <>
      <Head>
        <title>Paytungan - Detail Payment</title>
        <meta name="description" content="Paytungan Split Bill App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div tw="z-50 w-full max-w-[500px] flex items-center justify-center h-[67px] shadow-md fixed top-0 bg-white">
        {/* <Link href="/" passHref> */}
        <div
          tw="absolute left-[30px] top-[23px] cursor-pointer"
          onClick={() => {
            router.back()
          }}
        >
          <img src="/images/input-bill/back.svg" />
        </div>
        {/* </Link> */}
        <h1 tw="font-bold">DETAIL PEMBAYARAN</h1>
      </div>
      <div tw="z-10 w-full h-full relative justify-center container mx-auto bg-[#FCFCFC] mt-[67px]">
        <img
          tw="absolute h-full w-full -mt-16"
          src="/images/detail/detailBG.png"
          alt=""
        />
        <div tw="z-30 relative flex flex-col pt-6">
          <div tw="flex flex-col items-center justify-center mx-[39px]">
            <div tw="flex flex-col text-lg text-white font-bold justify-start mx-4 w-full">
              <h1>Pemilik tagihan: {bill?.user?.name}</h1>
              <h1 tw="pt-4">Keterangan </h1>
            </div>
          </div>
          <div tw="flex flex-col items-center justify-center mx-[39px] pt-2">
            <div tw="flex flex-col text-sm bg-abusatu rounded-xl w-full px-4 py-4">
              <div tw="flex justify-between items-center w-full max-w-[379px]">
                <h1 tw="pt-2 font-bold">Pembayaran</h1>
                <h1 tw="pt-2 text-right">{split_bill?.name}</h1>
              </div>
              <div tw="flex justify-between items-center w-full max-w-[379px]">
                <h1 tw="pt-2 font-bold">Nama Pembayaran</h1>
                <h1 tw="pt-2 text-right">{details_split_bill?.name}</h1>
              </div>
              <div tw="flex justify-between items-center w-full max-w-[379px]">
                <h1 tw="pt-2 font-bold">Jumlah Pembayaran</h1>
                <h1 tw="pt-2 text-right">Rp{bill?.amount}</h1>
              </div>
              <div tw="flex justify-between items-center w-full max-w-[379px]">
                <h1 tw="pt-2 font-bold">Waktu Bayar</h1>
                <h1 tw="pt-2 text-right">{dateString}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export { DetailPayment }
