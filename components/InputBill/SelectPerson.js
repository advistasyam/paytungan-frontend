import { useState, useEffect } from "react"
import tw, { css } from "twin.macro"
import { InputBillTopNavbar } from "./InputBillTopNavbar"
import { Disclosure } from "@headlessui/react"
import toast from "react-hot-toast"
import { useRouter } from "next/router"

const SelectPerson = () => {
  const [billArray, setBillArray] = useState([
    { amount: "", name: "", price: "" },
  ])
  const [anotherBill, setAnotherBill] = useState([{ name: "", price: "" }])
  const [allMenu, setAllMenu] = useState([])
  const [arrayBuyer, setArrayBuyer] = useState([])
  const [buyerBillIndex, setBuyerBillIndex] = useState([])
  const [secondDataIndex, setSecondDataIndex] = useState(0)
  const [totalHarga, setTotalHarga] = useState(0)
  const [countPeople, setCountPeople] = useState([])
  const router = useRouter()

  useEffect(() => {
    const billData = JSON.parse(sessionStorage.getItem("bill_array"))
    let anotherData = JSON.parse(sessionStorage.getItem("another_bill"))
    if (anotherData[0].name == "") {
      anotherData = []
    }
    if (sessionStorage.getItem("bill_array") != null) {
      console.log("fetch previous split bill data")
      setBillArray(billData)
      setAnotherBill(anotherData)
    }

    let arrayTemp = []
    const dataCreator = JSON.parse(localStorage.getItem("profile_data"))
    const arrayAnggotaGroup = JSON.parse(sessionStorage.getItem("anggota_grup"))

    arrayTemp.push(dataCreator)
    arrayAnggotaGroup.map(val => {
      arrayTemp.push(val)
    })

    setArrayBuyer(arrayTemp)
    sessionStorage.setItem("buyer_array", JSON.stringify(arrayBuyer))

    const nestedArray = Array.from(
      { length: billData.length + anotherData.length },
      () => Array.from({ length: arrayTemp.length }, () => false)
    )

    setBuyerBillIndex(nestedArray)
    setSecondDataIndex(billData.length)
    setTotalHarga(sessionStorage.getItem("total_harga"))
    setCountPeople(Array(billData.length + anotherData.length).fill(0))
    setAllMenu(billData.concat(anotherData))
  }, [])

  const handleSubmitForm = e => {
    try {
      e.preventDefault()
      let notAllChecked = false
      countPeople.map(val => {
        if (val == 0) {
          notAllChecked = true
        }
      })

      if (notAllChecked) {
        toast.error("Mohon Isi Minimal 1 Orang Pada Bill")
        return
      }

      const objBuilder = {
        name: sessionStorage.getItem("restaurant_name"),
        total_expanse: totalHarga,
      }

      const splitArray = []

      for (let i = 0; i < arrayBuyer.length; i++) {
        let objSplit = {
          nickname: arrayBuyer[i].name,
          username: arrayBuyer[i].username,
        }
        let thisTotalPerson = 0
        let splitDetails = []
        buyerBillIndex.map((val, index) => {
          if (val[i] == true) {
            const harga = parseInt(allMenu[index].price)
            const splittedHarga = Math.ceil(harga / countPeople[index])
            const detail = {
              title: allMenu[index].name,
              expanse: splittedHarga,
            }
            thisTotalPerson += splittedHarga
            splitDetails.push(detail)
          }
        })
        if (thisTotalPerson <= 0) {
          throw new Error(
            `${arrayBuyer[i].username} Memiliki Jumlah Bayaran Negatif / 0`
          )
        }

        // Validation check 10000
        if (thisTotalPerson < 10000) {
          throw new Error(
            `${arrayBuyer[i].username} Memiliki Jumlah Bayaran Kurang dari 10000`
          )
        }

        //Round Up Number
        thisTotalPerson = Math.ceil(thisTotalPerson)
        let admin_fee

        if (thisTotalPerson < 50000) {
          admin_fee = 1000
        } else {
          admin_fee = Math.ceil(0.02 * thisTotalPerson)
        }
        
        objSplit["admin_fee"] = admin_fee
        objSplit["total"] = thisTotalPerson + admin_fee
        objSplit["total_without_admin"] = thisTotalPerson
        objSplit["details"] = splitDetails

        splitArray.push(objSplit)
      }

      objBuilder["split"] = splitArray

      sessionStorage.setItem("detail_split_bill", JSON.stringify(objBuilder))
      toast.success("Billmu telah kami hitung")
      router.push("/previewbill")
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <>
      <InputBillTopNavbar isSelectPage={true} />
      <div
        tw="h-[100vh] w-full bg-[#1CB273] overflow-x-hidden relative flex"
        css={css`
          input:focus {
            outline: 2px solid #f6cb45;
          }
          input {
            background-color: #e5e7e9;
          }
        `}
      >
        <img
          tw="absolute bottom-0 right-0 z-[5]"
          src="/images/verifikasi/right_bottom.png"
          alt=""
        />
        <img
          tw="absolute top-0 left-0 z-[5]"
          src="/images/verifikasi/left_top.png"
          alt=""
        />
        <form tw="container mx-auto px-[32px] z-10" onSubmit={handleSubmitForm}>
          <div tw="mt-[105px]">
            <div tw="rounded-xl px-3 py-3 bg-abusatu shadow-xl font-bold text-lg">
              <p>{typeof(sessionStorage) !== 'undefined' && sessionStorage?.restaurant_name}</p>
              <div tw="flex items-center justify-between mt-1 text-hijautua">
                <p>Total Pengeluaran :</p>
                <p>{totalHarga}</p>
              </div>
            </div>
          </div>
          <div tw="mt-8">
            <h1 tw="text-white font-bold">Bill*</h1>
          </div>
          {billArray.map((val, index) => {
            return (
              <div tw="flex flex-row space-x-2 mt-2 relative" key={index}>
                <div tw="rounded-md py-2 px-3 bg-white w-[60%] max-h-[40px] truncate">
                  {val.amount} {val.name}
                </div>
                <div tw="rounded-md py-2 px-3 bg-white w-[40%] relative">
                  <Disclosure>
                    {({ open }) => (
                      <>
                        <Disclosure.Button tw="flex w-full items-center justify-between">
                          <span>{countPeople[index]} Orang</span>
                          <img
                            src="/images/input-bill/chevron-up.png"
                            css={[open && tw`transform rotate-180`]}
                          />
                        </Disclosure.Button>
                        <Disclosure.Panel>
                          {arrayBuyer.map((value, idx) => {
                            return (
                              <div
                                tw="flex flex-row items-center justify-start space-x-2"
                                key={idx}
                              >
                                <input
                                  type="checkbox"
                                  value={value.username}
                                  checked={buyerBillIndex[index][idx]}
                                  css={css`
                                    accent-color: #F6CB45;
                                    color: white;
                                  `}
                                  onChange={() => {
                                    let tempData = [...buyerBillIndex]
                                    const isChecked = buyerBillIndex[index][idx]
                                    let tempCount = [...countPeople]
                                    if (isChecked) {
                                      tempCount[index] = tempCount[index] - 1
                                    } else {
                                      tempCount[index] = tempCount[index] + 1
                                    }
                                    tempData[index][idx] = !isChecked
                                    setBuyerBillIndex(tempData)
                                    setCountPeople(tempCount)
                                  }}
                                />
                                <p tw="truncate">{value.username}</p>
                              </div>
                            )
                          })}
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                </div>
              </div>
            )
          })}
          {anotherBill.length != 0 &&
            anotherBill.map((val, index) => {
              return (
                <div tw="flex flex-row space-x-2 mt-2 relative" key={index}>
                  <div tw="rounded-md py-2 px-3 bg-white w-[60%] max-h-[40px]">
                    {val.name}
                  </div>
                  <div tw="rounded-md py-2 px-3 bg-white w-[40%] relative">
                    <Disclosure>
                      {({ open }) => (
                        <>
                          <Disclosure.Button tw="flex w-full items-center justify-between">
                            <span>
                              {countPeople[index + secondDataIndex]} Orang
                            </span>
                            <img
                              src="/images/input-bill/chevron-up.png"
                              css={[open && tw`transform rotate-180`]}
                            />
                          </Disclosure.Button>
                          <Disclosure.Panel>
                            {arrayBuyer.map((value, idx) => {
                              return (
                                <div
                                  tw="flex flex-row items-center justify-start space-x-2"
                                  key={idx + secondDataIndex}
                                >
                                  <input
                                    type="checkbox"
                                    css={css`
                                      accent-color: #f6cb45;
                                    `}
                                    value={value.username}
                                    checked={
                                      buyerBillIndex[index + secondDataIndex][
                                        idx
                                      ]
                                    }
                                    onChange={() => {
                                      let tempData = [...buyerBillIndex]
                                      const isChecked =
                                        buyerBillIndex[index + secondDataIndex][
                                          idx
                                        ]
                                      let tempCount = [...countPeople]
                                      if (isChecked) {
                                        tempCount[index + secondDataIndex] =
                                          tempCount[index + secondDataIndex] - 1
                                      } else {
                                        tempCount[index + secondDataIndex] =
                                          tempCount[index + secondDataIndex] + 1
                                      }
                                      tempData[index + secondDataIndex][idx] =
                                        !isChecked
                                      setBuyerBillIndex(tempData)
                                      setCountPeople(tempCount)
                                    }}
                                  />
                                  <p tw="truncate">{value.username}</p>
                                </div>
                              )
                            })}
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  </div>
                </div>
              )
            })}
          <div tw="mt-12">
            <button
              type="submit"
              tw="bg-kuning text-center py-4 rounded-xl w-full"
            >
              Selanjutnya
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export { SelectPerson }
