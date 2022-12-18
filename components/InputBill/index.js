import { css } from "twin.macro"
import { InputBillTopNavbar } from "@components/InputBill/InputBillTopNavbar"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/router"
import AdminFeeNotif from "@components/InputBill/AdminFeeNotif"

const InputBill = () => {
  const [restaurantName, setRestaurantName] = useState("")
  const [billArray, setBillArray] = useState([
    { amount: "", name: "", price: "" },
  ])
  const [anotherBill, setAnotherBill] = useState([{ name: "", price: "" }])
  const router = useRouter()
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(sessionStorage.getItem("admin_fee_notified") != null ? false : true)
  }, [])

  useEffect(() => {
    if (sessionStorage.getItem("bill_array") != null) {
      console.log("fetch previous split bill data")
      setRestaurantName(sessionStorage.getItem("restaurant_name"))
      setBillArray(JSON.parse(sessionStorage.getItem("bill_array")))
      setAnotherBill(JSON.parse(sessionStorage.getItem("another_bill")))
    }
  }, [])

  const checkRequired = () => {
    if (anotherBill[0].name == "" && anotherBill[0].price == "") {
      return false
    }
    return true
  }

  const clickTambahBill = () => {
    const lastIndex = billArray.length - 1
    if (
      billArray[lastIndex].amount != "" &&
      billArray[lastIndex].name != "" &&
      billArray[lastIndex].price != ""
    ) {
      return setBillArray([...billArray, { amount: "", name: "", price: "" }])
    } else {
      toast.error("Mohon lengkapi data sebelumnya terlebih dahulu")
    }
  }

  const clickTambahBillAnother = () => {
    const lastIndex = anotherBill.length - 1
    if (
      anotherBill[lastIndex].name != "" &&
      anotherBill[lastIndex].price != ""
    ) {
      return setAnotherBill([...anotherBill, { name: "", price: "" }])
    } else {
      toast.error("Mohon lengkapi data sebelumnya terlebih dahulu")
    }
  }

  const onSubmitHandler = e => {
    e.preventDefault()
    let totalHarga = 0

    billArray.map(val => {
      totalHarga = totalHarga + parseInt(val.price)
    })

    if (anotherBill[0].name != "") {
      anotherBill.map(val => {
        totalHarga = totalHarga + parseInt(val.price)
      })
    }

    if (totalHarga <= 0) {
      return toast.error(
        "Total Harga tidak boleh minus / 0, periksa kembali input anda"
      )
    }

    sessionStorage.setItem("total_harga", totalHarga.toString())
    sessionStorage.setItem("restaurant_name", restaurantName)
    sessionStorage.setItem("bill_array", JSON.stringify(billArray))
    sessionStorage.setItem("another_bill", JSON.stringify(anotherBill))

    router.push("/select-person")
  }

  const close = () => {
    sessionStorage.setItem("admin_fee_notified", true)
    setShow(false)
  }

  return (
    <>
      <InputBillTopNavbar />
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
        <form tw="container mx-auto px-[32px] z-10" onSubmit={onSubmitHandler}>
          <div tw="mt-[105px]">
            <h1 tw="text-white font-bold">Nama Restaurant/Toko</h1>
            <input
              tw=" mt-2 w-full rounded-lg py-2 px-3 bg-white"
              placeholder="Nama Restaurant/Toko"
              required={true}
              value={restaurantName}
              onChange={e => {
                setRestaurantName(e.target.value)
              }}
            />
          </div>
          <div tw="mt-8">
            <h1 tw="text-white font-bold">Bill</h1>
            {billArray.map((val, index) => {
              return (
                <div tw="flex flex-row space-x-2 mt-2 relative" key={index}>
                  <input
                    tw="rounded-md py-2 px-[3px] text-center bg-white w-[13%]"
                    placeholder="jml"
                    type="number"
                    min={1}
                    max={99}
                    required
                    value={val.amount}
                    onChange={e => {
                      let newArray = [...billArray]
                      newArray[index].amount = e.target.value
                      setBillArray(newArray)
                    }}
                  />
                  <input
                    tw="rounded-md py-2 px-3 bg-white w-[57%]"
                    placeholder="Nama menu/barang"
                    required
                    value={val.name}
                    onChange={e => {
                      let newArray = [...billArray]
                      newArray[index].name = e.target.value
                      setBillArray(newArray)
                    }}
                  />
                  <input
                    tw="rounded-md py-2 px-3 bg-white w-[30%]"
                    placeholder="Harga"
                    type="number"
                    required
                    value={val.price}
                    onChange={e => {
                      let newArray = [...billArray]
                      newArray[index].price = e.target.value
                      setBillArray(newArray)
                    }}
                  />
                  {index != 0 && (
                    <p
                      tw="absolute right-[-17px] top-[5px] text-kuning font-bold cursor-pointer"
                      onClick={() => {
                        let newArray = [...billArray]
                        newArray.splice(index, 1)
                        setBillArray(newArray)
                      }}
                    >
                      x
                    </p>
                  )}
                </div>
              )
            })}
            <div
              tw="mt-3 w-min bg-kuning px-2 py-0.5 rounded-md cursor-pointer"
              onClick={clickTambahBill}
            >
              <p tw="whitespace-nowrap">+ Tambah Bill</p>
            </div>
          </div>
          <div tw="mt-12">
            <h1 tw="text-white font-bold">Biaya lain-lain</h1>
            <p tw="text-white">
              *tuliskan tanda (-) pada kolom harga apabila biaya tersebut
              merupakan potongan, e.g -2000
            </p>
            {anotherBill.map((val, index) => {
              return (
                <div tw="flex flex-row space-x-2 mt-2 relative" key={index}>
                  <input
                    tw="rounded-md py-2 px-3 bg-white w-[70%]"
                    placeholder="Biaya lain (Contoh: Pajak)"
                    value={val.name}
                    required={checkRequired()}
                    onChange={e => {
                      let newArray = [...anotherBill]
                      newArray[index].name = e.target.value
                      setAnotherBill(newArray)
                    }}
                  />
                  <input
                    tw="rounded-md py-2 px-3 bg-white w-[30%]"
                    placeholder="Harga"
                    type="number"
                    value={val.price}
                    required={checkRequired()}
                    onChange={e => {
                      let newArray = [...anotherBill]
                      newArray[index].price = e.target.value
                      setAnotherBill(newArray)
                    }}
                  />
                  {index != 0 && (
                    <p
                      tw="absolute right-[-17px] top-[5px] text-kuning font-bold cursor-pointer"
                      onClick={() => {
                        let newArray = [...anotherBill]
                        newArray.splice(index, 1)
                        setAnotherBill(newArray)
                      }}
                    >
                      x
                    </p>
                  )}
                </div>
              )
            })}
            <div
              tw="mt-3 w-min bg-kuning px-2 py-0.5 rounded-md cursor-pointer"
              onClick={clickTambahBillAnother}
            >
              <p tw="whitespace-nowrap">+ Tambah Bill</p>
            </div>
          </div>
          <div tw="mt-12">
            <div tw="text-sm text-putih font-bold text-center">
                  {" "}
                  *Biaya per orang minimum 10.000
                  {" "}
                </div>
            <button
              type="submit"
              tw="bg-kuning text-center py-4 rounded-xl w-full mt-4"
            >
              Selanjutnya
            </button>
          </div>
          <AdminFeeNotif onClose={close} show={show}></AdminFeeNotif>
        </form>
      </div>
    </>
  )
}

export { InputBill }
