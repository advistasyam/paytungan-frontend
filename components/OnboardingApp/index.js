import React from "react"
import { css } from "twin.macro"
import { useState } from "react"
import { Dialog } from "@headlessui/react"
import SwiperCore, { Navigation, Pagination, A11y } from "swiper"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/pagination"

SwiperCore.use([Navigation, Pagination, A11y])

const OnboardingApp = () => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        tw="justify-center items-center flex inset-0 fixed"
      >
        <Dialog.Overlay
          tw="bg-hitam"
          css={css`
            position: fixed;
            opacity: 0.5;
            top: -5%;
            height: 110vh;
            width: 500px;
          `}
        />
        <div tw="bg-white p-2 z-10 box-content rounded-[30px] w-[70%] max-w-[430px] border-white py-4">
          <Swiper
            css={css`
              width: 100%;
              height: 100%;
            `}
            spaceBetween={30}
            pagination={{
              clickable: true,
            }}
            modules={[Pagination]}
            className="mySwiper"
          >
            <SwiperSlide>
              <div tw="flex flex-col justify-center mb-12">
                {" "}
                <img
                  src="/images/onboarding-app/first-step.png"
                  tw="h-[250px]"
                  alt=""
                />{" "}
                <Dialog.Title tw="font-bold text-center text-2xl mt-6 mx-16">
                  {" "}
                  Semua Tagihan Dalam Satu Waktu
                </Dialog.Title>
                <Dialog.Description tw="text-center text-[17px] font-medium mt-4 mx-16">
                  Seluruhnya akan tergabung menjadi dalam satu waktu untuk
                  penagihan!
                </Dialog.Description>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div tw="flex flex-col justify-center items-center mb-12">
                {" "}
                <img
                  src="/images/onboarding-app/second-step.png"
                  tw="w-[80%]"
                  alt=""
                />{" "}
                <Dialog.Title tw="font-bold text-center text-2xl mt-8 mx-16">
                  {" "}
                  Tidak perlu menghitung !
                </Dialog.Title>
                <Dialog.Description tw="text-center text-[17px] font-medium mt-6 mx-16">
                  Pusing dengan angka? Tidak perlu khawatir, kami yang hitung!
                </Dialog.Description>
              </div>
            </SwiperSlide>
            <SwiperSlide className="next">
              <div tw="flex flex-col justify-center mb-12">
                {" "}
                <img
                  src="/images/onboarding-app/third-step.png"
                  tw="w-[80%]"
                  alt=""
                />{" "}
                <Dialog.Title tw="font-bold text-center text-2xl mt-8 mx-16">
                  {" "}
                  Status pembayaran
                </Dialog.Title>
                <Dialog.Description tw="text-center text-[17px] font-medium mt-6 mx-16">
                  Cek status pembayaran Anda menjadi lebih mudah bersama
                  Paytungan!
                </Dialog.Description>
                <Dialog.Description
                  tw="text-abutiga underline text-center text-[16px] font-medium mt-3 mx-14 cursor-pointer"
                  onClick={() => setIsOpen(false)}
                >
                  Close
                </Dialog.Description>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </Dialog>
    </>
  )
}

export default OnboardingApp
