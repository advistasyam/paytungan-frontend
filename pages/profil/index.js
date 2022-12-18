import { css } from "twin.macro"
import Head from "next/head"
import Link from "next/link"
import { Logout } from "@components/Logout"
import { useState, useEffect } from "react"

const Profil = () => {
  const [profile_data, setProfileData] = useState({})

  useEffect(() => {
    try {
      const dataProfile = JSON.parse(localStorage.getItem("profile_data"))
      setProfileData(dataProfile)
    } catch {}
  }, [])

  return (
    <>
      <div tw="relative justify-center pb-[120px]">
        <Head>
          <title> Paytungan - Profil </title>
          <meta name="description" content="Paytungan Profil" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div tw="flex items-center justify-evenly w-full">
          <div tw="w-full">
            <div tw="grid space-y-4 w-full h-full relative">
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
              <div tw="z-20">
                <div tw="relative grid justify-items-start">
                  <h1
                    tw="mt-16 pb-6 text-2xl justify-self-center font-bold text-white"
                    css={css`
                      @media screen and (max-width: 500px) {
                        margin-top: 40px;
                      }
                    `}
                  >
                    {" "}
                    Profil{" "}
                  </h1>
                </div>
                <div tw="text-sm relative grid justify-items-center space-y-3">
                  <img
                    src={
                      profile_data?.profil_image == ""
                        ? "images/profil/default_photo.png"
                        : profile_data?.profil_image
                    }
                    role="user-foto"
                    tw="mb-10 rounded-full"
                    css={css`
                      height: 22vh;
                      width: 22vh;
                      object-fit: cover;
                      @media screen and (min-width: 500px) {
                        top: -50px;
                      }
                    `}
                  />
                  <p tw="pt-10 font-bold"> Nomor Telepon </p>
                  <p role="user-nomor-telepon">
                    {" "}
                    {profile_data?.phone_number}{" "}
                  </p>
                  <p tw="font-bold"> Username </p>
                  <p role="user-username"> {profile_data?.username} </p>
                  <p tw="font-bold"> Email </p>
                  <p role="user-nama-lengkap"> {profile_data?.email} </p>
                  <p tw="font-bold"> Nama Lengkap </p>
                  <p role="user-nama-lengkap"> {profile_data?.name} </p>
                </div>
              </div>
              <div tw="text-sm p-5 grid space-y-3">
                <Link href="/profil/ubah">
                  <a role="button-ubah-profil">
                    <button
                      tw={
                        "rounded-lg justify-self-center font-bold bg-[#F6CB45] w-full h-full p-4"
                      }
                    >
                      Ubah Profil
                    </button>
                  </a>
                </Link>
                <Logout />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profil
