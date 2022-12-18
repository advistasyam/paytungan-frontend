import { css } from "twin.macro"
import Head from "next/head"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import data from "metodepembayaran.data.json"
import { useRouter } from "next/router"
import nookies from "nookies"

const Group = () => {
  const [metodePembayaran] = useState(data.metodePembayaran)
  const [anggota, setAnggota] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const anggotaGrup = JSON.parse(sessionStorage.getItem("anggota_grup"))
    anggotaGrup.push(JSON.parse(localStorage.getItem("profile_data")))
    setAnggota(anggotaGrup)
  }, [])

  const findPenalang = id => {
    for (let i = 0; i < anggota.length; i++) {
      if (anggota[i].id == id) {
        return anggota[i]
      }
    }
  }

  const submitForm = () => {
    let namaGrup = document.getElementById("nama-grup").value
    let penalang = findPenalang(document.getElementById("penalang").value)
    // let metode =
    //   metodePembayaran[parseInt(document.getElementById("metode").value) - 1]
    // let nomorTujuan = document.getElementById("nomor").value

    if (namaGrup == "") {
      toast.error("Nama Grup wajib diisi!")
    } else if (penalang == undefined) {
      toast.error("Penalang wajib diisi!")
    // } else if (metode == undefined) {
    //   toast.error("Metode Pembayaran wajib diisi!")
    // } else if (nomorTujuan == "") {
    //   toast.error("Nomor Rekening/Telepon wajib diisi!")
    // } else if (nomorTujuan != Number(nomorTujuan)) {
    //   toast.error("Nomor Rekening/Tujuan harus berupa angka")
    } else {
      const dataPenalang = {
        namaGrup: namaGrup,
        penalang: penalang,
        metode: "BNI",
        nomorTujuan: Math.floor(Math.random() * 10000) + 1,
      }
      const dataPenalangJSON = JSON.stringify(dataPenalang)
      nookies.set(null, "data_penalang", dataPenalangJSON, {
        path: "/",
      })
      router.push("group/konfirmasi")
    }
  }

  return (
    anggota &&
    metodePembayaran && (
      <>
        <div
          tw="relative justify-center"
          css={css`
            input:focus {
              outline: 2px solid #f6cb45;
            }
            input {
              background-color: #e5e7e9;
            }

            select:focus {
              outline: 2px solid #f6cb45;
            }
            select {
              background-color: #e5e7e9;
            }
          `}
        >
          <Head>
            <title> Paytungan - Create Group </title>
            <meta name="description" content="Paytungan Create Group" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <div tw="sticky top-0 bg-putih h-[75px] z-30 w-full flex text-xl font-bold items-center justify-center">
            <img
              onClick={() => router.push("/search-contact/")}
              tw="absolute left-5 cursor-pointer"
              src="/images/SearchContact/arrow.png"
              alt="back arrow"
            />
            <h1>CREATE GROUP</h1>
          </div>
          <img
            alt="progress-bar"
            src="images/group/progress1.png"
            tw="sticky top-[75px] w-full z-30"
          />
          <div tw="relative w-full bg-hijautua p-6 pb-80 min-h-screen">
            <div tw="z-20 relative">
              <div tw="flex text-white font-bold">
                <div role="nama-grup"> Nama grup </div>
                <div tw="text-red-500"> * </div>
              </div>
              <div tw="mt-2">
                <input
                  tw="rounded-lg w-full p-3 bg-abusatu h-full"
                  type="text"
                  role="input-nama-grup"
                  id="nama-grup"
                  placeholder="Nama Grup"
                />
              </div>
              <div tw="flex text-white font-bold mt-12">
                <div role="penalang"> Penalang </div>
                <div tw="text-red-500"> * </div>
              </div>
              <div tw="mt-2">
                <select
                  tw="rounded-lg text-black w-full p-3 h-full"
                  type="text"
                  role="input-penalang"
                  id="penalang"
                  defaultValue={""}
                  required={true}
                >
                  <option disabled value="">
                    {" "}
                    Nama{" "}
                  </option>
                  {anggota &&
                    anggota.map(orang => (
                      <option key={orang.id} value={orang.id}>
                        {" "}
                        {orang.username}{" "}
                      </option>
                    ))}
                </select>
              </div>
              {/* <div tw="flex text-white font-bold">
                <div role="metode"> Metode pembayaran </div>
                <div tw="text-red-500"> * </div>
              </div>
              <div>
                <select
                  tw="rounded-lg text-black w-full p-3 h-full"
                  type="text"
                  role="input-metode"
                  id="metode"
                  defaultValue={""}
                  required={true}
                >
                  <option disabled value="">
                    {" "}
                    Bank/E-wallet{" "}
                  </option>
                  {metodePembayaran &&
                    metodePembayaran.map(metode => (
                      <option key={metode.id} value={metode.id}>
                        {" "}
                        {metode.name}{" "}
                      </option>
                    ))}
                </select>
              </div>
              <div tw="flex text-white font-bold">
                <div role="nomor"> Nomor rekening/telepon </div>
                <div tw="text-red-500"> * </div>
              </div>
              <div>
                <input
                  tw="rounded-lg w-full p-3 h-full border-2 bg-abusatu "
                  type="number"
                  role="input-nomor"
                  maxLength="20"
                  id="nomor"
                  required={true}
                />
              </div> */}
              <button
                role="button-selanjutnya"
                onClick={submitForm}
                tw={
                  "mt-16 rounded-lg justify-self-center font-bold bg-kuning w-full h-full px-3 py-3"
                }
              >
                Selanjutnya
              </button>
            </div>
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
          </div>
        </div>
      </>
    )
  )
}
export { Group }
