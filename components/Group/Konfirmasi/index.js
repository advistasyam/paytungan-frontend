import { css } from "twin.macro"
import Head from "next/head"
import { useEffect, useState } from "react"
import nookies, { parseCookies } from "nookies"
import { useRouter } from "next/router"

const Konfirmasi = () => {
  const cookies = parseCookies()
  const router = useRouter()

  const [penalang, setPenalang] = useState({})
  const [anggota, setAnggota] = useState({})

  useEffect(() => {
    const dataPenalang = JSON.parse(cookies.data_penalang)
    const anggotaGrup = JSON.parse(sessionStorage.getItem("anggota_grup"))
    anggotaGrup.push(JSON.parse(localStorage.getItem("profile_data")))
    setPenalang(dataPenalang)
    setAnggota(anggotaGrup)
  }, [])

  const submitForm = () => {
    router.push("/input-bill/")
  }

  const cancel = () => {
    nookies.destroy(null, "data_penalang")
    router.push("/group/")
  }

  return (
    <>
      <div tw="relative justify-center">
        <Head>
          <title> Paytungan - Create Group </title>
          <meta name="description" content="Paytungan Create Group" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div tw="sticky top-0 bg-putih h-[75px] z-30 w-full flex text-xl font-bold items-center justify-center">
          <img
            onClick={cancel}
            tw="absolute left-5 cursor-pointer"
            src="/images/SearchContact/arrow.png"
            alt="back arrow"
          />
          <h1>CREATE GROUP</h1>
        </div>
        <img
          alt="progress-bar"
          src="/images/group/progress1.png"
          tw="sticky top-[75px] w-full z-30"
        />
        <div tw="space-y-3 grid relative w-full bg-hijautua p-6 pb-60 min-h-screen">
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
          <div tw="z-20">
            <div tw="flex ml-2 mt-3">
              <img alt="logo-grup" src="/images/group/logoGrup.png" tw="w-[60px]" />
              <div tw="text-white font-bold text-xl ml-5 mt-3">
                {" "}
                Grup {penalang?.namaGrup}{" "}
              </div>
            </div>
            <div tw="mx-2">
              <div tw="mt-12 mb-4 font-bold text-kuning"> Anggota </div>
              <div tw="flex space-x-2">
                {anggota &&
                  anggota.length <= 4 &&
                  anggota.map(orang => (
                    <img
                      tw="rounded-full"
                      src={
                        orang?.profil_image == "" || orang?.profil_image == null
                          ? "/images/group/logoGrup.png"
                          : orang?.profil_image
                      }
                      alt="anggota"
                      key={orang.id}
                      css={css`
                        height: 47px;
                        width: 47px;
                        object-fit: cover;
                      `}
                    />
                  ))}
                {anggota && anggota.length > 4 && (
                  <>
                    <img
                      tw="rounded-full"
                      css={css`
                        height: 47px;
                        width: 47px;
                        object-fit: cover;
                      `}
                      src={
                        anggota[0].profil_image == "" ||
                        anggota[0].profil_image == null
                          ? "/images/group/logoGrup.png"
                          : anggota[0].profil_image
                      }
                      alt="anggota-1"
                    />
                    <img
                      tw="rounded-full"
                      css={css`
                        height: 47px;
                        width: 47px;
                        object-fit: cover;
                      `}
                      src={
                        anggota[1].profil_image == "" ||
                        anggota[1].profil_image == null
                          ? "/images/group/logoGrup.png"
                          : anggota[1].profil_image
                      }
                      alt="anggota-2"
                    />
                    <img
                      tw="rounded-full"
                      css={css`
                        height: 47px;
                        width: 47px;
                        object-fit: cover;
                      `}
                      src={
                        anggota[2].profil_image == "" ||
                        anggota[2].profil_image == null
                          ? "/images/group/logoGrup.png"
                          : anggota[2].profil_image
                      }
                      alt="anggota-3"
                    />
                    <img
                      tw="rounded-full"
                      css={css`
                        height: 47px;
                        width: 47px;
                        object-fit: cover;
                      `}
                      src={
                        anggota[3].profil_image == "" ||
                        anggota[3].profil_image == null
                          ? "/images/group/logoGrup.png"
                          : anggota[3].profil_image
                      }
                      alt="anggota-4"
                    />
                    <div tw="box-content h-7 w-7 p-3 bg-kuning rounded-full text-white font-bold">
                      {" "}
                      + {anggota.length - 4}{" "}
                    </div>
                  </>
                )}
              </div>
              <div tw="mt-8 mb-2 font-bold text-kuning"> Penalang </div>
              <div tw="flex relative">
                <img
                  tw="rounded-full"
                  css={css`
                    height: 47px;
                    width: 47px;
                    object-fit: cover;
                  `}
                  src={
                    penalang?.penalang?.profil_image == "" ||
                    penalang?.penalang?.profil_image == null
                      ? "/images/group/logoGrup.png"
                      : penalang?.penalang?.profil_image
                  }
                  alt="penalang"
                />
                <div tw="text-white ml-3 mt-2">
                  {" "}
                  {penalang?.penalang?.name}{" "}
                </div>
              </div>
              {/* <div tw="pb-8 mt-8">
                <div tw="font-bold text-kuning"> Metode Pembayaran </div>
                <div tw="text-white font-bold mt-1">
                  {" "}
                  {penalang?.metode?.name}{" "}
                </div>
                <div tw="text-white text-sm"> {penalang?.nomorTujuan} </div>
              </div> */}

              <div tw="grid space-y-2 relative mt-16">
                <div tw="text-sm text-white text-center">
                  {" "}
                  Grup tidak dapat diedit setelah grup terbuat{" "}
                </div>
                <button
                  role="button-buat-split-bill"
                  onClick={submitForm}
                  tw={
                    "rounded-lg py-2 px-3 justify-self-center font-bold bg-kuning w-full h-full mt-8"
                  }
                >
                  Buat Split Bill
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export { Konfirmasi }
