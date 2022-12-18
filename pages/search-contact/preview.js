import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import "twin.macro"

export default function Preview() {
  const router = useRouter()
  const [dataProfile, setDataProfile] = useState([])
  const [anggotaGrup, setAnggotaGrup] = useState([])

  useEffect(() => {
    const data_profile = JSON.parse(localStorage.profile_data)
    setDataProfile(data_profile)
    const anggotaGrupSess = sessionStorage.getItem("anggota_grup")
    const anggotaGrupSessParsed = JSON.parse(anggotaGrupSess)
    if (anggotaGrupSessParsed) {
      const user = anggotaGrupSessParsed.filter(item => {
        if (item.username === data_profile.username) return item
      })
      if (user.length > 0 || !data_profile.username) {
        setAnggotaGrup(anggotaGrupSessParsed)
      } else {
        const arr = [data_profile, ...anggotaGrupSessParsed]
        setAnggotaGrup(arr)
      }
    } else {
      setAnggotaGrup([])
    }
  }, [])

  const handleSelanjutnya = () => {
    const newAnggotaGrup = anggotaGrup.filter(user => {
      if (user.username != dataProfile.username) return user
    })
    setAnggotaGrupSess(newAnggotaGrup)
    router.push("/group")
  }

  const handleBackArrow = () => {
    const newAnggotaGrup = anggotaGrup.filter(user => {
      if (user.username != dataProfile.username) return user
    })
    setAnggotaGrupSess(newAnggotaGrup)
    router.push("/search-contact")
  }

  const setAnggotaGrupSess = arr => {
    const anggotaGrupJSON = JSON.stringify(arr)
    sessionStorage.setItem("anggota_grup", anggotaGrupJSON)
  }

  return (
    <>
      <div tw="sticky top-0 bg-putih h-[75px] z-30 w-full flex text-xl font-bold items-center justify-center">
        <img
          onClick={handleBackArrow}
          tw="absolute left-5 cursor-pointer"
          src="/images/SearchContact/arrow.png"
          alt="back arrow"
        />
        <h1>CREATE GROUP</h1>
      </div>
      <img
        alt="progress"
        src="/images/SearchContact/progress_bar.png"
        tw="sticky top-[75px] w-full z-30"
      />
      <div tw="h-screen overflow-y-auto w-full bg-hijautua overflow-x-hidden relative flex flex-col gap-5 p-5">
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
        <h1 tw="text-putih text-xl font-bold z-20 mt-2 mx-3">Anggota Grup</h1>
        <div tw="flex flex-col gap-5 mx-3" role={"anggota-grup"}>
          {anggotaGrup.map(item => (
            <div
              key={item.id}
              tw="flex flex-row gap-5 items-center text-white relative z-20"
            >
              <img
                src={
                  item.profil_image
                    ? item.profil_image
                    : "/images/SearchContact/profpic_placeholder.png"
                }
                alt=""
                tw="w-[55px] h-[55px] rounded-full object-cover"
              />
              <p tw="text-lg font-bold">{item.username}</p>
            </div>
          ))}
        </div>
        <div tw="container mx-auto flex items-center justify-center pt-[10vh] px-3">
          <button
            onClick={handleSelanjutnya}
            role={"btn-selanjutnya"}
            tw="bg-kuning mx-auto text-hitam font-bold rounded-lg cursor-pointer z-20 w-full py-3"
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </>
  )
}
