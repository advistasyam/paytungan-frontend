import { motion } from "framer-motion"
import { css } from "twin.macro"
import { headerAnimation } from "@components/Animation/headerAnimation"
import Head from "next/head"
import { useEffect, useState } from "react"
import { Topnavbar } from "@components/Topnavbar"
import { PushLogin, PushOnboarding } from "@components/Helper/pushLogin"
import { useRouter } from "next/router"
import { parseCookies } from "nookies"
import { getBackendUrl } from "@components/Constanta"
import toast from "react-hot-toast"
import Link from "next/link"
import ContentLoader from "react-content-loader"

function Home() {
  const router = useRouter()
  const cookies = parseCookies()
  const [dataUser, setDataUser] = useState({ data: ["null"] })
  const [dataTagihanBelumLunas, setDataTagihanBelumLunas] = useState([])
  const [dataTagihanSudahLunas, setDataTagihanSudahLunas] = useState([])
  const [dataUserPenalang, setDataUserPenalang] = useState({ data: ["null"] })
  const [dataPenalangBelumLunas, setDataPenalangBelumLunas] = useState([])
  const [dataPenalangSudahLunas, setDataPenalangSudahLunas] = useState([])
  const [isPenalangPage, setIsPenalangPage] = useState(false)

  const BE_URL = getBackendUrl()

  const accessToken = cookies.token

  const getData = async () => {
    try {
      const response = await fetch(
        BE_URL + "/api/split-bills/list/get-current-user?is_user_fund=false",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authentication: accessToken,
          },
        }
      )

      if (!response.ok) {
        setDataUser([])
        return
      }
      const responseData = await response.json()
      setDataUser(responseData)

      const dataProfile = JSON.parse(localStorage.getItem("profile_data"))
      const userId = dataProfile?.id

      let tagihanBelumLunas = []
      responseData.data.map(value => {
        if (
          value.bill.status == "PENDING" &&
          value.split_bill.user_fund_id != userId
        ) {
          tagihanBelumLunas.push(value)
        }
      })
      setDataTagihanBelumLunas(tagihanBelumLunas)

      let tagihanSudahLunas = []
      responseData.data.map(value => {
        if (
          value.bill.status == "PAID" &&
          value.split_bill.user_fund_id != userId
        ) {
          tagihanSudahLunas.push(value)
        }
      })
      setDataTagihanSudahLunas(tagihanSudahLunas)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const getDataPenalang = async () => {
    try {
      const dataProfile = JSON.parse(localStorage.getItem("profile_data"))

      const response = await fetch(
        BE_URL + `/api/split-bills/list/get?user_fund_id=${dataProfile?.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authentication: accessToken,
          },
        }
      )

      if (!response.ok) {
        setDataUserPenalang([])
        return
      }
      const responseData = await response.json()
      let arr = []

      responseData.data.map(val => {
        let grupLunas = true
        for (let i = 0; i < val.bills.length; i++) {
          if (val.bills[i].status == "PENDING") {
            grupLunas = false
            break
          }
        }
        val["group_status"] = grupLunas
        arr.push(val)
      })

      setDataUserPenalang({ data: arr })

      let penalangBelumLunas = []
      arr.map(value => {
        if (value.group_status === false) {
          penalangBelumLunas.push(value)
        }
      })
      setDataPenalangBelumLunas(penalangBelumLunas)

      let penalangSudahLunas = []
      arr.map(value => {
        if (value.group_status === true) {
          penalangSudahLunas.push(value)
        }
      })
      setDataPenalangSudahLunas(penalangSudahLunas)
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    const profileCookieData = localStorage.profile_data
    const user = cookies.token
    PushLogin(user, router)
    PushOnboarding(router, profileCookieData)
  }, [])

  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {
    getDataPenalang()
  }, [])

  return (
    <div tw="overflow-x-hidden relative w-full">
      <Head>
        <title>Paytungan - Easiest Split Bill App</title>
        <meta name="description" content="Paytungan Split Bill App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Topnavbar />
      <motion.h1
        tw="mt-[100px] ml-[39px] text-xl font-bold"
        initial={"initial"}
        animate={"animate"}
        variants={headerAnimation}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
      >
        Group Split Bill
      </motion.h1>
      <div tw="ml-[39px] flex flex-row space-x-3 my-[20px]">
        <p
          tw="font-bold text-abuempat cursor-pointer"
          css={[
            isPenalangPage == false &&
              css`
                text-underline-offset: 8px;
                text-decoration: underline;
                color: #1cb273;
              `,
          ]}
          onClick={() => {
            setIsPenalangPage(false)
          }}
        >
          Tagihan
        </p>
        <p
          tw="font-bold text-abuempat cursor-pointer"
          css={[
            isPenalangPage == true &&
              css`
                text-underline-offset: 8px;
                text-decoration: underline;
                color: #1cb273;
              `,
          ]}
          onClick={() => {
            setIsPenalangPage(true)
          }}
        >
          Penalang
        </p>
      </div>

      <div tw="mt-[7px] flex items-center justify-center mb-[200px]">
        {isPenalangPage == false ? (
          <>
            {dataUser?.data?.length == 0 ? (
              <>
                <img
                  src="/images/group/no_group.png"
                  alt=""
                  tw="w-[212px] mt-[104px]"
                />
              </>
            ) : dataUser?.data[0] == "null" ? (
              <div tw="flex items-center justify-center overflow-y-hidden overflow-x-hidden">
                <ContentLoader viewBox="0 0 270 475" height={475} width={270}>
                  <circle cx="30.2" cy="73.2" r="30" />
                  <rect x="100" y="39.5" width="70" height="10" />
                  <rect x="100" y="55" width="140" height="10" />
                  <rect x="100" y="71" width="170" height="10" />
                  <rect x="100" y="92" width="110" height="10" />

                  <circle cx="30.2" cy="173.2" r="30" />
                  <rect x="100" y="139.5" width="70" height="10" />
                  <rect x="100" y="155" width="140" height="10" />
                  <rect x="100" y="171" width="170" height="10" />
                  <rect x="100" y="192" width="110" height="10" />

                  <circle cx="30.2" cy="273.2" r="30" />
                  <rect x="100" y="239.5" width="70" height="10" />
                  <rect x="100" y="255" width="140" height="10" />
                  <rect x="100" y="271" width="170" height="10" />
                  <rect x="100" y="292" width="110" height="10" />
                </ContentLoader>
              </div>
            ) : (
              <div tw="container mx-auto px-[39px]">
                {dataTagihanBelumLunas.length > 0 && (
                  <h3 tw="font-extrabold text-oren">
                    Tagihan kamu yang belum lunas
                  </h3>
                )}
                {dataTagihanBelumLunas?.map((value, index) => {
                  return (
                    <Link
                      href="/tagihan/[value.split_bill.id]"
                      as={`/tagihan/${value.split_bill.id}`}
                      passHref
                    >
                      <div
                        tw="w-full rounded-xl border h-[69px] px-[2px] mt-[7px] grid grid-rows-2 grid-flow-col"
                        css={css`
                          grid-template-columns: 65px auto auto;
                        `}
                        key={index}
                      >
                        <div tw="row-span-3">
                          <div>
                            <img
                              src="/images/home/group_pic.png"
                              alt=""
                              tw="rounded-full mt-[7px] ml-[7px]"
                            />
                          </div>
                        </div>
                        <div tw="ml-[10px] row-span-1 col-span-2 mt-[20px] cursor-pointer">
                          <h3 tw="font-bold text-left text-lg">
                            {" "}
                            {value.split_bill.name}{" "}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  )
                })}
                {dataTagihanSudahLunas?.length > 0 && (
                  <h3 tw="font-extrabold mt-[20px] text-abuempat">
                    Tagihan kamu yang sudah lunas{" "}
                  </h3>
                )}
                {dataTagihanSudahLunas?.map((value, index) => {
                  return (
                    <Link
                      href="/tagihan/[value.split_bill.id]"
                      as={`/tagihan/${value.split_bill.id}`}
                      passHref
                    >
                      <div
                        tw="w-full rounded-xl border h-[69px] px-[2px] mt-[7px] grid grid-rows-2 grid-flow-col"
                        css={css`
                          grid-template-columns: 65px auto auto;
                        `}
                        key={index}
                      >
                        <div tw="row-span-3">
                          <div>
                            <img
                              src="/images/home/group_pic.png"
                              alt=""
                              tw="rounded-full ml-[7px] mt-[7px]"
                            />
                          </div>
                        </div>
                        <div tw="ml-[10px] row-span-1 col-span-2 mt-[20px] cursor-pointer">
                          <h3 tw="font-bold text-left text-lg text-abutiga">
                            {" "}
                            {value.split_bill.name}{" "}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </>
        ) : (
          <>
            {dataUserPenalang?.data?.length == 0 ? (
              <>
                <img
                  src="/images/group/no_group.png"
                  alt=""
                  tw="w-[212px] mt-[104px]"
                />
              </>
            ) : dataUserPenalang?.data[0] == "null" ? (
              <div tw="mt-20 pl-2 flex items-center justify-center overflow-y-hidden overflow-x-hidden">
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
            ) : (
              <div tw="container mx-auto px-[39px]">
                {dataPenalangBelumLunas?.length > 0 && (
                  <h3 tw="font-extrabold text-oren">Grup yang belum lunas</h3>
                )}
                {dataPenalangBelumLunas?.map((value, index) => {
                  return (
                    <Link
                      href="/tagihan/[value.id]"
                      as={`/tagihan/${value.id}`}
                    >
                      <div
                        tw="w-full rounded-xl border h-[69px] px-[2px] mt-[7px] grid grid-rows-2 grid-flow-col"
                        css={css`
                          grid-template-columns: 65px auto auto;
                        `}
                        key={index}
                      >
                        <div tw="row-span-3">
                          <div>
                            <img
                              src="/images/home/group_pic.png"
                              alt=""
                              tw="rounded-full mt-[7px] ml-[7px]"
                            />
                          </div>
                        </div>
                        <div tw="ml-[10px] row-span-1 col-span-2 mt-[20px] cursor-pointer">
                          <h3 tw="font-bold text-left text-lg">
                            {" "}
                            {value.name}{" "}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  )
                })}
                {dataPenalangSudahLunas?.length > 0 && (
                  <h3 tw="font-extrabold mt-[20px] text-abuempat">
                    Grup yang sudah lunas{" "}
                  </h3>
                )}
                {dataPenalangSudahLunas?.map((value, index) => {
                  return (
                    <Link
                      href="/tagihan/[value.id]"
                      as={`/tagihan/${value.id}`}
                    >
                      <div
                        tw="w-full rounded-xl border h-[69px] px-[2px] mt-[7px] grid grid-rows-2 grid-flow-col"
                        css={css`
                          grid-template-columns: 65px auto auto;
                        `}
                        key={index}
                      >
                        <div tw="row-span-3">
                          <div>
                            <img
                              src="/images/home/group_pic.png"
                              alt=""
                              tw="rounded-full ml-[7px] mt-[7px]"
                            />
                          </div>
                        </div>
                        <div tw="ml-[10px] row-span-1 col-span-2 mt-[20px] cursor-pointer">
                          <h3 tw="font-bold text-left text-lg text-abutiga">
                            {" "}
                            {value.name}{" "}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
      <div tw="w-full fixed flex max-w-[500px] justify-end bottom-[114px] items-center z-50">
        <Link href="/search-contact" passHref>
          <a tw="pr-10">
            <img src="/images/home/floating_button.png" alt="" />
          </a>
        </Link>
      </div>
    </div>
  )
}

export { Home }
