import tw from "twin.macro"
import { Disclosure } from "@headlessui/react"
import { Topnavbar } from "@components/Topnavbar"
import data from "../dummy.json"

export default function HelpCenterPage() {
  const faqArray = data.faqArray

  const contactNumber = "+6280987654321"

  return (
    <>
      <Topnavbar />
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
        <div tw="container mx-auto flex flex-col gap-4 items-center justify-center pt-[10vh] px-3 z-10">
          <h1 tw="text-2xl font-bold mt-2 mb-5 text-white text-center">
            Bantuan
          </h1>
          {faqArray.map((val, index) => {
            return (
              <div
                key={index}
                tw="rounded-xl p-5 bg-putih relative w-full"
                role={"faq-box"}
              >
                <Disclosure>
                  {({ open }) => (
                    <>
                      <Disclosure.Button tw="flex w-full items-center justify-between">
                        <p tw="font-bold text-left">{val.question}</p>
                        <img
                          src="/images/input-bill/chevron-up.png"
                          css={[open && tw`transform rotate-180`]}
                          alt=""
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel>
                        <p tw="mt-5 text-left whitespace-pre-line">{val.answer}</p>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              </div>
            )
          })}
          <div tw="mt-5 mb-24 text-putih text-center">
            <p>Anda memiliki pertanyaan lain?</p>
            <p role={"contact-number"}>Hubungi kami di {contactNumber}</p>
          </div>
        </div>
      </div>
    </>
  )
}
