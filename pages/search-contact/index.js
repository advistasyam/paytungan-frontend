import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import toast from "react-hot-toast"
import "twin.macro"
import { getBackendUrl } from "@components/Constanta"

export default function SearchContact() {
  const BE_URL = getBackendUrl()
  const router = useRouter()

  const [searchInput, setSearchInput] = useState("")
  const [selectedContacts, setSelectedContacts] = useState([])
  const [searchedContact, setSearchedContact] = useState(null)
  const [dataProfile, setDataProfile] = useState([])

  useEffect(() => {
    setDataProfile(JSON.parse(localStorage.profile_data))
    const anggotaGrupSess = sessionStorage.getItem("anggota_grup")
    const anggotaGrupSessParsed = JSON.parse(anggotaGrupSess)
    if (anggotaGrupSessParsed) {
      const newSelectedContacts = anggotaGrupSessParsed.filter(user => {
        if (user.username !== dataProfile.username) return user
      })
      setSelectedContacts(newSelectedContacts)
    } else {
      setSelectedContacts([])
    }
  }, [])

  const handleSearchContact = async () => {
    if (searchInput !== "") {
      toast.loading("Sedang mencari...")
      await fetch(BE_URL + "/api/users/get_contact?username=" + searchInput)
        .then(function (response) {
          return response.json()
        })
        .then(
          function (data) {
            const user = data.data
            if (user) {
              const selectedUser = selectedContacts.filter(item => {
                if (item.username === user.username) return user
              })

              if (
                selectedUser.length === 0 &&
                searchInput !== dataProfile.username
              ) {
                setSearchedContact(user)
                toast.dismiss()
              } else if (searchInput === dataProfile.username) {
                toast.dismiss()
                toast.error("Anda tidak dapat memilih kontak Anda sendiri")
              } else {
                toast.dismiss()
                toast.error("Kontak sudah dipilih")
              }
            } else {
              toast.dismiss()
              toast.error("Kontak tidak ditemukan")
            }
          },
          error => {
            if (error) {
              toast.dismiss()
              toast.error("Terdapat kesalahan, silakan coba lagi")
            }
          }
        )
    } else {
      setSearchedContact(null)
    }
  }

  const handleSearchedCheckContact = e => {
    if (e.target.checked) {
      const newSelectedContacts = [...selectedContacts, searchedContact]
      setSelectedContacts(newSelectedContacts)
      setSearchedContact(null)
    }
  }

  const handleSelectedCheckContact = (e, user) => {
    if (!e.target.checked) {
      const newSelectedContacts = selectedContacts.filter(item => {
        if (item.username !== user.username) return user
      })
      setSelectedContacts(newSelectedContacts)
    }
  }

  useEffect(() => {}, [selectedContacts])
  useEffect(() => {}, [searchedContact])

  const handleSelanjutnya = () => {
    if (selectedContacts.length === 0) {
      toast.error("Kontak belum dipilih!")
    } else {
      const anggotaGrupJSON = JSON.stringify(selectedContacts)
      sessionStorage.setItem("anggota_grup", anggotaGrupJSON)
      router.push("/search-contact/preview")
    }
  }

  const handleBackArrow = () => {
    sessionStorage.removeItem("anggota_grup")
    router.push("/")
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
      <div tw="min-h-screen w-full bg-hijautua relative flex flex-col gap-5 p-5">
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
        <h1 tw="text-putih text-xl font-bold z-20 mx-3 mt-2">Pilih Kontak</h1>
        <input
          role={"search-bar"}
          tw="p-3 bg-abusatu rounded-lg focus:outline-none z-20 mx-3"
          placeholder="Cari kontak"
          onChange={event => {
            setSearchInput(event.target.value)
          }}
          onKeyPress={event => {
            if (event.key === "Enter") handleSearchContact()
          }}
        ></input>
        <div tw="flex flex-col gap-5 h-[60px] mx-3 mt-2">
          {searchedContact ? (
            <div
              key={searchedContact.id}
              tw="flex flex-row gap-5 items-center text-white relative z-20"
            >
              <img
                src={
                  searchedContact.profil_image
                    ? searchedContact.profil_image
                    : "/images/SearchContact/profpic_placeholder.png"
                }
                alt=""
                tw="w-[55px] h-[55px] rounded-full object-cover"
              />
              <p tw="text-lg font-bold">{searchedContact.username}</p>
              <input
                onChange={event => handleSearchedCheckContact(event)}
                type="checkbox"
                tw="absolute right-0 rounded-full appearance-none h-4 w-4 bg-putih checked:bg-kuning border-white border-[0.5px] focus:outline-none cursor-pointer"
              />
            </div>
          ) : null}
        </div>
        {selectedContacts.length > 0 ? (
          <>
            <hr tw="border-[0.5px] text-abusatu z-20 mx-3"></hr>
            <p tw="text-putih text-lg font-bold z-20 mx-3">
              Kontak yang dipilih
            </p>
            <div tw="flex flex-col gap-5 overflow-y-auto overflow-x-hidden pb-[60px] z-20 mx-3">
              {selectedContacts.map(item => (
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
                  <input
                    checked
                    onChange={event => handleSelectedCheckContact(event, item)}
                    type="checkbox"
                    tw="absolute right-0 rounded-full appearance-none h-4 w-4 bg-putih checked:bg-kuning border-white border-[0.5px] focus:outline-none cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </>
        ) : null}
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
