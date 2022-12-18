import Head from "next/head"
import { css } from "twin.macro"
import { useRouter } from "next/router"

const SuccessBill = () => {
  const router = useRouter()

  const confirm = () => {
    const idGrup = router.query.idGrup
    router.push("/tagihan/" + idGrup)
  }

  return (
    <>
      <Head>
        <title>Paytungan - Split Bill Created</title>
        <meta name="description" content="Paytungan Split Bill App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div tw=" z-50 w-full max-w-[500px] flex items-center justify-center h-[67px] shadow-md fixed top-0 z-50 bg-white">
        <h1 tw="font-bold">INPUT BILL</h1>
      </div>
      <div tw="w-full h-full relative justify-center">
        <div
          css={[
            css`
              background-color: #1cb273;
              height: 100vh;
            `,
          ]}
        >
          <div>
            <img
              tw="absolute bottom-0 right-0 z-10"
              src="/images/verifikasi/right_bottom.png"
              alt=""
            />
            <img
              tw="absolute top-0 left-0 z-10"
              src="/images/verifikasi/left_top.png"
              alt=""
            />
          </div>
          <div tw="relative flex flex-col items-center justify-center px-5 pt-32">
            <h1 tw="z-40 font-bold text-putih text-2xl">
              Split bill telah berhasil dibuat!
            </h1>
            <img
              tw="z-20 justify-items-center pt-16"
              src="/images/splitbill/success.png"
              alt=""
              style={{ width: "220px" }}
            />
            <div tw="grid z-40 pt-16 px-7 w-full">
              <a role="open-group-btn">
                <button
                  onClick={confirm}
                  tw="z-40 rounded-lg justify-self-center font-bold bg-[#F6CB45] w-full py-4"
                >
                  Buka Grup Split Bill
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export { SuccessBill }
