import React from "react"
import { css } from "twin.macro"

const AdminFeeNotif = props => {
  if (!props.show) {
    return null
  }
  return (
    <>
      <div
        tw="bg-hitam"
        css={css`
          position: fixed;
          opacity: 0.5;
          top: -5%;
          height: 110vh;
          width: 500px;
          margin-left: -32px;
          z-index: 0;
        `}
      ></div>
      <div tw="flex items-center justify-evenly rounded-t-2xl z-50">
        <div
          tw="box-content p-5 rounded-lg w-60 h-28 border-white bg-white"
          css={css`
            position: fixed;
            top: 26%;
          `}
        >
          <div tw="grid justify-center mt-5 relative">
            <div tw="flex justify-end absolute top-[-45%] right-[-3%] w-10 h-10 z-50">
              <button
                onClick={props.onClose}
              >
                <img
                    src="/images/input-bill/close-button.png" tw="px-0 mx-0"
                />
              </button>
            </div>
            <div tw="">
              <p tw="font-bold text-center mb-2">
                {" "}
                Anda akan dikenakan biaya admin sebesar 2% dari tagihan per orang{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminFeeNotif