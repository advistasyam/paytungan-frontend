import "twin.macro"
import Link from "next/link"

const InputBillTopNavbar = ({ isSelectPage = false }) => {
  return (
    <>
      <div tw="w-full max-w-[500px] flex items-center justify-center h-[67px] shadow-md fixed top-0 z-50 bg-white">
        <Link
          href={
            isSelectPage
              ? "/input-bill"
              : "/group/konfirmasi"
          }
          passHref
        >
          <div tw="absolute left-[30px] top-[23px]">
            <img src="/images/input-bill/back.svg" />
          </div>
        </Link>
        <h1 tw="text-xl font-bold">INPUT BILL</h1>
        <div tw="absolute bottom-[-6px] w-full">
          {isSelectPage ? (
            <img
              src="/images/input-bill/progress-select.png"
              tw="w-full object-cover"
            />
          ) : (
            <img
              src="/images/input-bill/progress.png"
              tw="w-full object-cover"
            />
          )}
        </div>
      </div>
    </>
  )
}

export { InputBillTopNavbar }
