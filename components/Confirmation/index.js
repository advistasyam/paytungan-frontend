import React from "react"
import { css } from "twin.macro"

const Confirmation = props => {
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
        `}
      ></div>
      <div tw="flex items-center justify-evenly rounded-t-2xl">
        <div
          tw="box-content p-5 rounded-lg w-60 h-28 border-white bg-white"
          css={css`
            position: fixed;
            top: 26%;
          `}
        >
          <div tw="grid justify-center mt-5">
            <div tw="">
              <p tw="font-bold text-center mb-2">
                {" "}
                Apakah data diri sudah dipastikan benar?{" "}
              </p>
            </div>
            <div tw="flex justify-center ml-2">
              <button
                tw="mr-4 rounded-lg font-bold bg-[#E5E7E9] text-[#1CB273] w-24 h-10"
                onClick={props.onClose}
              >
                {" "}
                Batal
              </button>
              <button
                type="submit"
                tw="mr-4  rounded-lg font-bold text-[#E5E7E9] bg-[#1CB273] w-24 h-10"
              >
                {" "}
                Masuk
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Confirmation
