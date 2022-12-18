import { css } from "twin.macro"
import { useEffect, useState } from "react"
import { getBackendUrl } from "@components/Constanta"
import { useRouter } from "next/router"
import { parseCookies } from "nookies"
import toast from "react-hot-toast"
import Link from "next/link"

const Tagihan = ({ idBill }) => {
  const BE_URL = getBackendUrl()
  const cookies = parseCookies()
  const router = useRouter()

  const [dataGrup, setDataGrup] = useState(null)
  const [tagihan, setTagihan] = useState([])
  const [sendiri, setSendiri] = useState(null)
  const [anggotaLunas, setAnggotaLunas] = useState(null)
  const [lunas, setLunas] = useState(null)
  const [isUserPenalang, setIsUserPenalang] = useState(false)

  const setGrup = data => {
    data = data.data[0]
    const details = JSON.parse(data.details)
    const profil = JSON.parse(localStorage.profile_data)
    const grup = {
      nama_grup: data.name,
      nama_restauran: details.name,
      total_tagihan: data.amount,
    }
    setDataGrup(grup)
    setTagihan(data.bills.filter(bill => bill.user_id != profil.id))
    setSendiri(data.bills.filter(bill => bill.user_id == profil.id)[0])
    setIsUserPenalang(data.user_fund_id == profil.id)
    setAnggotaLunas(data.bills.filter(bill => bill.status == "PAID"))

    let sum = 0
    for (var el in data.bills) {
      if (data.bills[el].status == "PAID") {
        sum += 1
      }
    }
    setLunas(sum == data.bills.length)
  }

  useEffect(() => {
    if (dataGrup == null) {
      try {
        fetch(BE_URL + "/api/split-bills/list/get?split_bill_ids=" + idBill, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authentication: cookies.token,
          },
        }).then(response => {
          return response.json().then(data => {
            setGrup(data)
          })
        })
      } catch (error) {
        toast.error("Terjadi kesalahan. Mohon di reload kembali")
      }
    }
  }, [idBill])

  if (dataGrup == null || sendiri == null) {
    return (
      <>
        <div tw="w-full max-w-[500px] flex items-center justify-start h-[67px] shadow-md fixed top-0 z-50 bg-white">
          <div tw="ml-5">
            <img
              alt="progress"
              onClick={() => router.push("/")}
              src="/images/group/arrow.png"
            />
          </div>
          <div tw="row-span-3">
            <img
              src="/images/home/group_pic.png"
              alt=""
              tw="rounded-full mt-[7px] ml-[7px]"
            />
          </div>
          <h1 tw="text-xl font-bold"></h1>
        </div>
        <div tw="h-full w-full max-w-[500px] bg-[#1CB273] overflow-x-hidden relative flex-col">
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
          <div tw="mt-[75px] py-8 px-[39px] w-full z-10 relative">
            <div tw="rounded-xl px-3 py-3 bg-kuning min-h-[104px]">
              <div tw="font-bold text-lg text-black"> </div>
              <div tw="flex-col items-center justify-between mt-1 text-black">
                <div tw="mt-[30px] pl-2 flex items-center justify-center overflow-y-hidden overflow-x-hidden">
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
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  const createPayment = () => {
    let id = {
      split_bill_id: idBill,
    }
    try {
      toast.loading("Mohon Menunggu", {duration: 10000})
      fetch(BE_URL + "/api/payments/payout/get-or-create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authentication: cookies.token,
        },
        body: JSON.stringify(id),
      }).then(response => {
        return response.json().then(data => {
          if (data.data.status != "COMPLETED") {
            toast.dismiss()
            toast.success("Password Payout Telah Dikirimkan Ke Emailmu")
          }
          setTimeout(function () {
            window.location.href = data.data.payout_url
          }, 2000)
        })
      })
    } catch (error) {
      toast.error("Terjadi kesalahan. Mohon di reload kembali")
    }
  }

  return (
    dataGrup &&
    sendiri && (
      <>
        <div tw="w-full max-w-[500px] flex items-center justify-start h-[67px] shadow-md fixed top-0 z-50 bg-white">
          <div tw="ml-5">
            <img
              alt="progress"
              onClick={() => router.push("/")}
              src="/images/group/arrow.png"
            />
          </div>
          <div tw="row-span-3">
            <img
              src="/images/home/group_pic.png"
              alt=""
              tw="rounded-full mt-[7px] ml-[7px]"
            />
          </div>
          <h1 tw="text-xl font-bold"> {dataGrup?.nama_grup} </h1>
        </div>
        <div tw="h-full w-full max-w-[500px] bg-[#1CB273] overflow-x-hidden relative flex-col">
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
          <div tw="mt-[75px] py-8 px-[39px] w-full z-10 relative">
            <div tw="rounded-xl px-3 py-3 bg-kuning">
              <div tw="flex justify-between items-center">
                <div tw="font-bold text-lg text-black"> Tagihan </div>
                {lunas && isUserPenalang ? (
                  <button
                    role="button-create-payment"
                    onClick={createPayment}
                    tw="rounded-lg py-1 px-4 justify-self-center font-bold bg-abusatu h-full"
                  >
                    Payout
                  </button>
                ) : isUserPenalang ? (
                  <button
                    role="button-create-payment"
                    tw="rounded-lg py-1 px-4 justify-self-center text-abudua font-bold bg-abusatu h-full"
                    disabled
                  >
                    Payout
                  </button>
                ) : (
                  <div> </div>
                )}
              </div>
              <div tw="flex-col items-center justify-between mt-1 text-black">
                <p> {dataGrup?.nama_restauran} </p>
                <p> Total Pengeluaran: {dataGrup?.total_tagihan}</p>
              </div>
            </div>
          </div>
          <div tw="px-[39px] flex-col w-full z-10 relative mb-[40px]">
            {tagihan &&
              tagihan.map(bill => (
                <div key={bill?.id}>
                  <div tw="flex">
                    <img
                      src={
                        bill?.user?.profil_image
                          ? bill?.user?.profil_image
                          : "/images/SearchContact/profpic_placeholder.png"
                      }
                      alt=""
                      tw="w-[8vh] h-[8vh] rounded-full mt-2 object-cover"
                    />
                    <div tw="p-4 flex flex-col">
                      <p tw="text-putih mb-4 font-bold"> {bill?.user?.name} </p>
                      <div
                        tw="rounded-xl py-3 bg-white"
                        css={css`
                          width: fit-content;
                        `}
                      >
                        <div tw="text-lg text-black px-4">
                          {" "}
                          Rp {bill?.amount}{" "}
                        </div>
                        <div tw="flex-col items-center justify-between mt-1 text-black text-center">
                          <div tw="relative flex py-2 items-center">
                            <div tw="border-t w-full border-gray-400"></div>
                          </div>
                          <Link
                            href={{
                              pathname: "/detailbill",
                              query: {
                                idBill: bill?.id,
                              },
                            }}
                          >
                            <a tw="font-bold text-kuning px-4 cursor-pointer">
                              {" "}
                              Detail{" "}
                            </a>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            <div tw="flex flex-col justify-end">
              <div tw="flex justify-end mt-4">
                <div tw="rounded-xl bg-abusatu py-3">
                  <div tw="text-lg text-black text-center px-4">
                    {" "}
                    Rp {sendiri?.amount}{" "}
                  </div>
                  <div tw="flex-col items-center justify-between mt-1 text-black text-center">
                    <div tw="relative flex py-2 items-center">
                      <div tw="flex-grow border-t w-full border-gray-400"></div>
                    </div>
                    {isUserPenalang ? (
                      <Link
                        href={{
                          pathname: "/detailbill",
                          query: {
                            idBill: sendiri?.id,
                            isPenalang: "true",
                          },
                        }}
                      >
                        <a tw="font-bold px-4 text-hijautua w-full cursor-pointer">
                          {" "}
                          Detail{" "}
                        </a>
                      </Link>
                    ) : sendiri?.status != "PAID" ? (
                      <Link
                        href={{
                          pathname: "/detailbill",
                          query: { idBill: sendiri?.id },
                        }}
                      >
                        <a tw="font-bold text-hijaumuda px-4 cursor-pointer">
                          {" "}
                          Bayar{" "}
                        </a>
                      </Link>
                    ) : (
                      <Link
                        href={{
                          pathname: "/detailbill",
                          query: {
                            idBill: sendiri?.id,
                          },
                        }}
                      >
                        <a tw="font-bold px-4 text-hijautua w-full cursor-pointer">
                          {" "}
                          Detail{" "}
                        </a>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {anggotaLunas &&
              anggotaLunas.map(bill => (
                <div key={bill?.id}>
                  {bill.user_id == sendiri.user_id ? (
                    <div tw="flex flex-col justify-end">
                      <div tw="flex justify-end mt-4">
                        <div tw="rounded-xl bg-abusatu py-3">
                          <div tw="text-lg text-black px-4 text-center">
                            {" "}
                            <span tw=""> Telah </span> Membayar{" "}
                          </div>
                          <div tw="flex-col items-center justify-between mt-1 text-black text-center">
                            <div tw="relative flex py-2 items-center">
                              <div tw="flex-grow border-t w-full border-gray-400"></div>
                            </div>
                            <Link
                              href={{
                                pathname: "/detailpayment",
                                query: {
                                  idBill: bill?.id,
                                  idSplitBill: idBill,
                                },
                              }}
                            >
                              <a tw="font-bold px-4 text-hijautua w-full cursor-pointer">
                                {" "}
                                Receipt{" "}
                              </a>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div tw="flex">
                      <img
                        src={
                          bill?.user?.profil_image
                            ? bill?.user?.profil_image
                            : "/images/SearchContact/profpic_placeholder.png"
                        }
                        alt=""
                        tw="w-[8vh] h-[8vh] rounded-full mt-2 object-cover"
                      />
                      <div tw="p-4 flex flex-col">
                        <p tw="text-putih mb-4 font-bold">
                          {" "}
                          {bill?.user?.name}{" "}
                        </p>
                        <div
                          tw="rounded-xl py-3 bg-white"
                          css={css`
                            width: fit-content;
                          `}
                        >
                          <div tw="text-lg text-black px-4 text-center">
                            {" "}
                            <span tw=""> Telah </span> Membayar{" "}
                          </div>
                          <div tw="flex-col items-center justify-between mt-1 text-black text-center">
                            <div tw="relative flex py-2 items-center">
                              <div tw="border-t w-full border-gray-400"></div>
                            </div>
                            <Link
                              href={{
                                pathname: "/detailpayment",
                                query: {
                                  idBill: bill?.id,
                                  idSplitBill: idBill,
                                },
                              }}
                            >
                              <a tw="font-bold text-kuning px-4 cursor-pointer">
                                {" "}
                                Receipt{" "}
                              </a>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            {lunas && (
              <div>
                <div tw="flex">
                  <img
                    src={"/images/SearchContact/profpic_placeholder.png"}
                    alt=""
                    tw="w-[8vh] h-[8vh] rounded-full mt-2"
                  />
                  <div tw="p-4 flex flex-col">
                    <p tw="text-putih mb-4 font-bold">Sistem</p>
                    <div
                      tw="rounded-lg py-3 bg-white"
                      css={css`
                        width: fit-content;
                      `}
                    >
                      <div tw="text-lg text-black font-bold px-5 py-3 text-center">
                        {" "}
                        Tagihan Lunas{" "}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    )
  )
}

export { Tagihan }
