import { css } from "twin.macro"
import { useAuth } from "../../firebase/AuthProvider"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/router"
import { getBackendUrl } from "@components/Constanta"
import Confirmationsb from "@components/Confirmationsb"
import Head from "next/head"
import Link from "next/link"
import { parseCookies } from "nookies"

const PreviewBill = () => {
  const { user } = useAuth()
  const router = useRouter()
  const cookies = parseCookies()
  const [splitbill_data, setBillData] = useState({})
  const [show, setShow] = useState(null)

  const BE_URL = getBackendUrl()

  useEffect(() => {
    const splitBillData = JSON.parse(
      sessionStorage.getItem("detail_split_bill")
    )
    setBillData(splitBillData)
  }, [])

  const confirm = () => {
    setShow(true)
  }

  const batal = () => {
    setShow(false)
  }

  const submitBill = async e => {
    e.preventDefault()
    toast.loading("Sedang Membuat Grup Anda")
    let arr = []
    const groupName = JSON.parse(cookies.data_penalang)
    const dataCreator = JSON.parse(localStorage.getItem("profile_data"))
    const dataPenalang = JSON.parse(cookies.data_penalang)
    const arrayAnggotaGroup = JSON.parse(sessionStorage.getItem("anggota_grup"))

    splitbill_data?.split?.map(val => {
      let idUser = dataCreator.id

      for (let i = 0; i < arrayAnggotaGroup.length; i++) {
        if (arrayAnggotaGroup[i].username == val.username) {
          idUser = arrayAnggotaGroup[i].id
          break
        }
      }

      arr.push({
        user_id: idUser,
        amount: val.total,
        admin_fee: val.admin_fee,
        details: JSON.stringify(val.details),
      })
    })

    const data = {
      name: groupName?.namaGrup,
      user_fund_id: dataPenalang?.penalang?.id,
      withdrawal_method: dataPenalang?.metode?.name,
      withdrawal_number: dataPenalang?.nomorTujuan,
      details: JSON.stringify(splitbill_data),
      amount: parseInt(splitbill_data?.total_expanse),
      bills: arr,
    }

    const accessToken = user.accessToken

    try {
      const response = await fetch(BE_URL + "/api/split-bills/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authentication: accessToken,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const responseDataError = await response.json()
        const message = `${responseDataError.errors.error_message}`
        throw new Error(message)
      }

      const responseData = await response.json()

      toast.dismiss()
      toast.success("Grup Terbuat")

      router.push("/successbill?idGrup=" + responseData.data.id)
    } catch (error) {
      toast.dismiss()
      toast.error(error.message)
    }
  }

  return (
    <>
      <Head>
        <title>Paytungan - Preview Split Bill</title>
        <meta name="description" content="Paytungan Split Bill App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div tw="z-50 w-full max-w-[500px] flex items-center justify-center h-[67px] shadow-md fixed top-0 bg-white relative">
        <Link href="/select-person" passHref>
          <div tw="absolute left-[30px] top-[23px]">
            <img src="/images/input-bill/back.svg" />
          </div>
        </Link>
        <h1 tw="font-bold">INPUT BILL</h1>
      </div>
      <div tw="w-full h-full relative justify-center container mx-auto">
        <div
          css={[
            css`
              background-color: #1cb273;
              height: 100%;
            `,
          ]}
        >
          <div>
            <img
              tw="absolute bottom-0 right-0"
              src="/images/verifikasi/right_bottom.png"
              alt=""
            />
            <img
              tw="absolute top-0 left-0"
              src="/images/verifikasi/left_top.png"
              alt=""
            />
          </div>
          <div tw="z-30 relative flex flex-col pt-14">
            <form onSubmit={submitBill}>
              <div tw="flex flex-col items-center justify-center mx-6">
                <div tw="flex flex-col bg-abusatu rounded-xl font-bold px-4 py-4 justify-start mx-6 max-w-[379px] w-full">
                  <h1>{splitbill_data?.name}</h1>
                  <div tw="flex flex-row items-center justify-between">
                    <h1 tw="pt-2 text-hijautua">Total Pengeluaran: </h1>
                    <h1 tw="text-hijautua">{splitbill_data?.total_expanse}</h1>
                  </div>
                </div>
                <div tw="flex flex-col justify-start max-w-[379px] w-full mx-6">
                  {splitbill_data?.split?.map((value, index) => {
                    return (
                      <div key={index} tw="w-full">
                        <p tw="pt-6 pb-2 text-putih text-lg font-bold">
                          {value.nickname}
                        </p>
                        <div tw="bg-abusatu rounded-xl px-4 py-4 justify-start w-full">
                          {value?.details.map((val, idx) => {
                            return (
                              <div
                                key={idx}
                                tw="flex items-center justify-between w-full"
                              >
                                <div tw="pt-2 flex">{val.title}</div>
                                <div tw="flex">{val.expanse}</div>
                              </div>
                            )
                          })}
                          <div tw="w-full h-[1px] bg-abuempat mt-4 rounded-xl"/>
                          <h1 tw="pt-2">
                            Total
                            <span tw="float-right">{value.total_without_admin}</span>
                          </h1>
                          <div tw="flex items-center justify-between w-full pt-2">
                            <div tw="flex">Biaya Admin</div>
                            <div tw="flex">{value.admin_fee}</div>
                          </div>
                          <div tw="pt-4 flex items-center justify-between w-full font-bold">
                            <div tw="pt-2 flex">Total + Admin</div>
                            <div tw="flex">{value.total}</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <Confirmationsb onClose={batal} show={show}></Confirmationsb>
            </form>
            <div tw="flex items-center justify-center pt-10 px-6 text-white font-semibold">
              <h1 tw="text-center">*Biaya admin merupakan 2% dari total tagihan atau Rp. 1000 jika total tagihan kurang dari Rp. 50.000</h1>
            </div>
            <div tw="flex items-center justify-center pt-14 pb-12">
              <div
                role="create-group-btn absolute"
                tw="w-full mx-6 max-w-[379px]"
              >
                <button
                  tw="z-40 rounded-xl justify-self-center font-bold bg-[#F6CB45] w-full py-4"
                  onClick={confirm}
                >
                  Buat Grup Split Bill
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export { PreviewBill }
