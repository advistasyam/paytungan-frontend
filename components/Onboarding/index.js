import { css } from "twin.macro"
import Head from "next/head"
import { useState } from "react"
import { useAuth } from "../../firebase/AuthProvider"
import Confirmation from "@components/Confirmation"
import { v4 as uuidv4 } from "uuid"
import { useRouter } from "next/router"
import {
  getBackendUrl,
  getImageStorageUrl,
  getUploadImageUrl,
} from "@components/Constanta"
import toast from "react-hot-toast"

const Onboarding = () => {
  const { user } = useAuth()
  const router = useRouter()
  const [show, setShow] = useState(null)
  const [foto, setFoto] = useState("")
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")

  const BE_URL = getBackendUrl()

  const confirm = () => {
    let inputData = document.querySelectorAll("input")
    let nama = document.getElementById("nama-lengkap").value
    let usernameUser = document.getElementById("username").value
    let email = document.getElementById("email").value

    setName(nama)
    setEmail(email)
    setUsername(usernameUser)

    if (nama != "" && usernameUser != "" && email != "") {
      for (let i = 0; i < inputData.length; +i++) {
        inputData[i].disabled = true
      }
      setShow(true)
    } else {
      toast.error("Semua field harus diisi")
    }
  }

  const submitForm = async e => {
    e.preventDefault()
    const data = {
      username: username,
      name: name,
      email:email,
      profil_image: foto,
    }
    const accessToken = user.accessToken
    try {
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

      toast.success(`Akun ${username} telah berhasil dibuat`)

      router.push("/")
    } catch (error) {
      toast.error(error.message)
    }
  }

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

  const batal = () => {
    let input_data = document.querySelectorAll("input")
    for (let i = 0; i < input_data.length; +i++) {
      if (i != 1) {
        input_data[i].disabled = false
      }
    }
    setShow(false)
  }

  return (
    <div tw="relative justify-center w-full pb-[120px]" className="onboarding">
      <Head>
        <title> Paytungan - Onboarding </title>
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
                <h1> Registrasi Data Diri </h1>
              </div>
              <div tw="text-sm grid space-y-3 ">
                <form
                  tw="grid space-y-3"
                  id="form-onboarding"
                  onSubmit={submitForm}
                >
                  <div tw="justify-self-center mb-10">
                    <div tw="relative">
                      <img
                        role="user-foto"
                        src={
                          foto == "" ? "images/profil/default_photo.png" : foto
                        }
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
                          id="nomor-telepon"
                          defaultValue={user?.phoneNumber}
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
                          id="username"
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
                            id="email"
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
                          id="nama-lengkap"
                          required={true}
                        />
                      </div>
                    </div>
                  </div>
                  <Confirmation onClose={batal} show={show}></Confirmation>
                </form>
                <div tw="grid space-y-4 pl-7 pr-7">
                  <div role="button-masuk">
                    <button
                      id="btn-masuk"
                      onClick={confirm}
                      tw={
                        "rounded-lg justify-self-center font-bold bg-[#F6CB45] w-full h-full p-4"
                      }
                    >
                      {" "}
                      Masuk ke Aplikasi
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { Onboarding }
