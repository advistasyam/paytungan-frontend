import "twin.macro"
import { useEffect, useState } from "react"
import Head from "next/head"
import { Topnavbar } from "@components/Topnavbar"
import { parseCookies } from "nookies"
import { getBackendUrl } from "@components/Constanta"
import toast from "react-hot-toast"
import ContentLoader from "react-content-loader"

const Riwayat = () => {
  const [riwayat, setRiwayat] = useState("loading")
  const [profilName, setProfilName] = useState("")

  const cookies = parseCookies()
  const BE_URL = getBackendUrl()
  const accessToken = cookies.token

  const getData = async id => {
    try {
      const response = await fetch(
        BE_URL + "/api/payments/list/get?user_id=" + id + "&status=PAID",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authentication: accessToken,
          },
        }
      )

      if (!response.ok) {
        setRiwayat([])
        const responseError = await response.json()
        const message = `${responseError.errors.error_message}`
        throw new Error(message)
      }
      const responseData = await response.json()
      const riwayatTemp = responseData.data.map(data => convertDate(data))
      setRiwayat(riwayatTemp)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const convertDate = data => {
    const dateJs = new Date(data.updated_at)
    const date = dateJs.getDate()
    const month = dateJs.toLocaleString("default", { month: "long" })
    const year = dateJs.getFullYear()
    data.updated_at =
      date + " " + month + " " + year + ", " + dateJs.toLocaleTimeString()
    return data
  }

  useEffect(() => {
    const profil = JSON.parse(localStorage.profile_data)
    getData(profil.id)
    setProfilName(profil.name)
  }, [])

  return (
    <>
      <Head>
        <title>Paytungan - Riwayat </title>
        <meta name="description" content="Paytungan Split Bill App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Topnavbar />
      <div tw="h-full w-full max-w-[500px] overflow-x-hidden relative flex-col">
        <div tw="mt-[75px] py-8 px-[39px] w-full z-10 relative">
          <div tw="font-bold text-lg text-hijautua"> Riwayat Pembayaran </div>
          {riwayat === "loading" ? (
            <div tw="flex items-center justify-center">
              <ContentLoader
                speed={3}
                width={270}
                height={160}
                viewBox="0 0 270 160"
                tw="mt-12"
              >
                <rect x="50" y="6" rx="4" ry="4" width="343" height="38" />
                <rect x="8" y="6" rx="4" ry="4" width="35" height="38" />
                <rect x="50" y="55" rx="4" ry="4" width="343" height="38" />
                <rect x="8" y="55" rx="4" ry="4" width="35" height="38" />
                <rect x="50" y="104" rx="4" ry="4" width="343" height="38" />
                <rect x="8" y="104" rx="4" ry="4" width="35" height="38" />
              </ContentLoader>
            </div>
          ) : riwayat.length === 0 ? (
            <>
              <div tw="mt-[7px] flex items-center justify-center mb-[200px]">
                <img src="/images/riwayat/noGrup.png" alt="" tw="mt-[100px]" />
              </div>
            </>
          ) : (
            riwayat.map(pembayaran => (
              <div key={pembayaran?.id}>
                <div tw="mt-3 w-full z-10 relative border">
                  <div tw="rounded-lg px-3 py-3">
                    <div tw="flex justify-between items-center w-full">
                      <div>
                        <h1 tw="font-bold text-lg">{profilName}</h1>
                        <div tw="text-black">{pembayaran?.updated_at}</div>
                      </div>
                      <div tw="text-lg">Rp{pembayaran?.amount}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}

export { Riwayat }
