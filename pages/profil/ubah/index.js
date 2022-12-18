import { css } from "twin.macro"
import Head from "next/head"
import Link from "next/link"
import { v4 as uuidv4 } from "uuid"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { parseCookies } from "nookies"
import {
  getBackendUrl,
  getImageStorageUrl,
  getUploadImageUrl,
} from "@components/Constanta"
import toast from "react-hot-toast"
import nookies from "nookies"

const Ubah = () => {
  const cookies = parseCookies()
  const [profile_data, setProfileData] = useState({})
  const [foto, setFoto] = useState(null)

  useEffect(() => {
    const dataProfile = JSON.parse(localStorage.getItem("profile_data"))
    setProfileData(dataProfile)
    setFoto(dataProfile.profil_image)
  }, [])

  const accessToken = cookies.token

  const BE_URL = getBackendUrl()

  const router = useRouter()

  const handleFile = async e => {
    const photoFile = e.target.files[0]
    const contentType = e.target.files[0].type
    const uid = uuidv4()
    const imageType = contentType.split("/")[1]
    const UPLOAD_IMAGE_URL = getUploadImageUrl(uid, imageType)
    const SUCCESS_UPLOAD_IMAGE_URL = getImageStorageUrl(uid, imageType)
    try {
      toast.loading("Sedang Mengupload Fotomu")
      await fetch(UPLOAD_IMAGE_URL, {
        method: "POST",
        headers: {
          "Content-Type": contentType,
        },
        body: photoFile,
      })
      toast.dismiss()
      toast.success("Upload Sukses")
      setFoto(SUCCESS_UPLOAD_IMAGE_URL)
    } catch (error) {
      toast.error(
        "Terdapat kesalahan saat upload fotomu, periksa jaringanmu ya"
      )
    }
  }

  const submitForm = async e => {
    e.preventDefault()
    const username = e.target.username.value
    const nama = e.target.nama.value
    const email = e.target.email.value

    const data = {
      username: username,
      name: nama,
      email: email,
      profil_image: foto,
    }

    try {
      toast.loading("Update Profile...")
      const response = await fetch(BE_URL + "/api/users/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authentication: accessToken,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const responseDataErr = await response.json()
        const message = `${responseDataErr.errors.error_message}`
        throw new Error(message)
      }

      const responseData = await response.json()
      localStorage.setItem("profile_data", JSON.stringify(responseData.data))

      toast.dismiss()
      toast.success("Update Berhasil")
      router.push("/profil")
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div tw="relative justify-center w-full pb-[120px]" className="ubah-profil">
      <Head>
        <title> Paytungan - Ubah Profil </title>
        <meta name="description" content="Paytungan Split Bill App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div tw="flex items-center justify-evenly w-full">
        <div tw="grid w-full">
          <div tw="space-y-4 w-full h-full relative">
            <img
              src="/images/profil/background.png"
              alt=""
              tw="absolute top-0 z-10 w-full"
              css={css`
                @media screen and (min-width: 500px) {
                  top: -50px;
                }
              `}
            />
            <div tw="relative grid z-20">
              <div tw="mt-16 pb-6 text-2xl justify-self-center font-bold text-white">
                <h1> Ubah Data Diri </h1>
              </div>
              <div tw="text-sm grid space-y-3">
                <form tw="grid space-y-3" onSubmit={submitForm}>
                  <div tw="justify-self-center mb-10">
                    <div tw="relative">
                      <img
                        src={
                          foto == ""
                            ? "/images/profil/default_photo.png/"
                            : foto
                        }
                        role="user-foto"
                        tw="rounded-full"
                        css={css`
                          height: 22vh;
                          width: 22vh;
                          object-fit: cover;
                          @media screen and (min-width: 500px) {
                            top: -50px;
                          }
                        `}
                      />
                      <div tw="absolute top-0">
                        <div tw="relative">
                          <button
                            tw="justify-items-end"
                            css={[
                              css`
                                background-image: url("/images/profil/kamera.png/");
                                width: 7vh;
                                height: 7vh;
                                background-size: 100% 100%;
                              `,
                            ]}
                            disabled
                          ></button>
                          <input
                            type="file"
                            id="foto"
                            name="foto"
                            onInput={handleFile}
                            accept="image/png, image/jpeg"
                            css={[
                              css`
                                left: -1px;
                                height: 7vh;
                                opacity: 0;
                              `,
                            ]}
                            tw="w-[50px] absolute top-0 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div tw="text-sm grid space-y-3 pb-3 pt-2 pl-7 pr-7">
                    <div tw="space-y-3 mt-10">
                      <div tw="flex font-bold">
                        <div> Nomor Telepon </div>
                        <div tw="text-red-500"> * </div>
                      </div>
                      <div>
                        <input
                          tw="rounded-lg w-full p-3 h-full bg-[#E5E7E9]"
                          type="text"
                          name="nomor-telepon"
                          defaultValue={profile_data?.phone_number}
                          disabled
                        />
                      </div>
                    </div>
                    <div tw="space-y-3">
                      <div tw="flex font-bold">
                        <div> Username </div>
                        <div tw="text-red-500"> * </div>
                      </div>
                      <div>
                        <input
                          tw="rounded-lg w-full p-3 h-full border-2 border-[#C4C4C4]"
                          type="text"
                          name="username"
                          defaultValue={profile_data?.username}
                          required={true}
                        />
                      </div>
                    </div>
                    <div tw="space-y-3">
                      <div tw="flex font-bold">
                        <div> Email </div>
                        <div tw="text-red-500"> * </div>
                      </div>
                      <div>
                        <input
                            tw="rounded-lg w-full p-3 h-full border-2 border-[#C4C4C4]"
                            type="text"
                            name="email"
                            defaultValue={profile_data?.email}
                            required={true}
                        />
                      </div>
                    </div>
                    <div tw="space-y-3">
                      <div tw="flex font-bold">
                        <div> Nama Lengkap </div>
                        <div tw="text-red-500"> * </div>
                      </div>
                      <div>
                        <input
                          tw="rounded-lg w-full p-3 h-full border-2 border-[#C4C4C4]"
                          type="text"
                          name="nama"
                          defaultValue={profile_data?.name}
                          required={true}
                        />
                      </div>
                    </div>
                  </div>
                  <div tw="grid space-y-4 pl-7 pr-7">
                    <button
                      role="button-simpan"
                      tw="rounded-lg font-bold bg-[#F6CB45] w-full h-full p-4"
                      type="submit"
                    >
                      {" "}
                      Simpan
                    </button>
                    <Link href="/profil">
                      <a role="button-batal">
                        <button tw="rounded-lg border-2 border-[#C4C4C4] w-full h-full p-3">
                          {" "}
                          Batal{" "}
                        </button>
                      </a>
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Ubah
