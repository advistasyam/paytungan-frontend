import { useEffect, useState } from "react"
import { css } from "twin.macro"
import Link from "next/link"
import { useRouter } from "next/router"

const Navbar = () => {
  const [menuNavbar, setMenuNavbar] = useState(0)
  const { pathname } = useRouter()

  function navbarCircleCss() {
    if (menuNavbar == 0) return "20%"
    else if (menuNavbar == 1) return "40%"
    else if (menuNavbar == 2) return "60%"
    return "80%"
  }

  function imageNavbarDynamicCss() {
    if (menuNavbar == 0) return "calc(20% - 52px)"
    else if (menuNavbar == 1) return "calc(40% - 45px)"
    else if (menuNavbar == 2) return "calc(60% - 45px)"
    return "calc(80% - 37px)"
  }

  function profileImageUrl() {
    if (menuNavbar == 3) {
      return "/images/navbar/profile_green.svg"
    }
    return "/images/navbar/profile.svg"
  }

  const styleButtonNavbar = `
    animation: changePosition 0.3s;
    animation-delay: 0.3s;
    animation-fill-mode: forwards;

    @keyframes changePosition {
      to {
        // width: 60px;
        padding-bottom: 60px;
      }
    }
  `

  const excludeNavbarOnRoute = [
    "login",
    "signup",
    "verifikasi",
    "onboarding",
    "input-bill",
    "select-person",
    "previewbill",
    "successbill",
    "group",
    "group/konfirmasi",
    "search-contact",
    "search-contact/preview",
    "tagihan",
    "detailbill",
    "detailpayment",
    "payment-success",
    "payment",
  ]

  function checkRoutes() {
    for (let i = 0; i < excludeNavbarOnRoute.length; i++) {
      if (pathname.includes(excludeNavbarOnRoute[i])) {
        return true
      }
    }
    return false
  }

  useEffect(() => {
    if (pathname == "/profil") {
      setMenuNavbar(3)
    } else if (pathname == "/riwayat") {
      setMenuNavbar(2)
    } else if (pathname == "/help-center") {
      setMenuNavbar(1)
    } else if (pathname == "/") {
      setMenuNavbar(0)
    }
  }, [pathname])

  return (
    <div
      tw="flex items-center justify-evenly rounded-t-2xl"
      css={[
        css`
          position: fixed;
          overflow-y: visible;
          z-index: 50;
          bottom: 0;
          width: 100%;
          max-width: 500px;
          height: 60px;
          transition: 0.3s ease-in-out;

          background: radial-gradient(
              circle at ${navbarCircleCss()} 0,
              #e5e7e9 50px,
              #e5e7e9 0
            )
            0 0;

          background-size: 100% 100%;
          background-repeat: no-repeat;
          box-shadow: 0 -5px 8px -3px rgb(0 0 0 / 25%);
        `,
        checkRoutes() &&
          css`
            bottom: -120px;
          `,
      ]}
    >
      <div
        css={css`
          position: absolute;
          top: -45px;

          left: ${imageNavbarDynamicCss()};

          transition: 0.6s ease-in-out;

          height: 45px;
          width: 90px;
          background: #e5e7e9;

          border-top-left-radius: 180px;
          border-top-right-radius: 180px;

          line-height: 90px;
          text-align: center;
          font-size: 40px;
          color: white;
          z-index: -1;
        `}
      />
      <Link href="/" passHref>
        <div
          tw="cursor-pointer"
          css={[
            menuNavbar == 0 &&
              css`
                ${styleButtonNavbar}
              `,
            css`
              -webkit-tap-highlight-color: transparent;
            `,
          ]}
          onClick={() => {
            setMenuNavbar(0)
          }}
        >
          <svg
            width="32"
            height="20"
            viewBox="0 0 32 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21.4286 8.57143C23.8 8.57143 25.7 6.65714 25.7 4.28571C25.7 1.91429 23.8 0 21.4286 0C19.0571 0 17.1429 1.91429 17.1429 4.28571C17.1429 6.65714 19.0571 8.57143 21.4286 8.57143ZM10 8.57143C12.3714 8.57143 14.2714 6.65714 14.2714 4.28571C14.2714 1.91429 12.3714 0 10 0C7.62857 0 5.71429 1.91429 5.71429 4.28571C5.71429 6.65714 7.62857 8.57143 10 8.57143ZM10 11.4286C6.67143 11.4286 0 13.1 0 16.4286V20H20V16.4286C20 13.1 13.3286 11.4286 10 11.4286ZM21.4286 11.4286C21.0143 11.4286 20.5429 11.4571 20.0429 11.5C21.7 12.7 22.8571 14.3143 22.8571 16.4286V20H31.4286V16.4286C31.4286 13.1 24.7571 11.4286 21.4286 11.4286Z"
              fill={menuNavbar == 0 ? "#1CB273" : "#A0A6AF"}
              css={css`
                transition: 0.3s ease-in-out;
              `}
            />
          </svg>
        </div>
      </Link>
      <Link href="/help-center" passHref>
        <div
          tw="cursor-pointer"
          css={[
            menuNavbar == 1 &&
              css`
                ${styleButtonNavbar}
              `,
            css`
              -webkit-tap-highlight-color: transparent;
            `,
          ]}
          onClick={() => {
            setMenuNavbar(1)
          }}
        >
          <svg
            width="26"
            height="31"
            viewBox="0 0 26 31"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 0C5.82706 0 0 5.82706 0 13C0 20.1729 5.82706 26 13 26H13.7647V30.5882C21.1976 27.0094 26 19.8824 26 13C26 5.82706 20.1729 0 13 0ZM14.5294 22.1765H11.4706V19.1176H14.5294V22.1765ZM14.5294 16.8235H11.4706C11.4706 11.8529 16.0588 12.2353 16.0588 9.17647C16.0588 7.49412 14.6824 6.11765 13 6.11765C11.3176 6.11765 9.94118 7.49412 9.94118 9.17647H6.88235C6.88235 5.79647 9.62 3.05882 13 3.05882C16.38 3.05882 19.1176 5.79647 19.1176 9.17647C19.1176 13 14.5294 13.3824 14.5294 16.8235Z"
              fill={menuNavbar == 1 ? "#1CB273" : "#A0A6AF"}
            />
          </svg>
        </div>
      </Link>
      <Link href="/riwayat" passHref>
        <div
          tw="cursor-pointer"
          css={[
            menuNavbar == 2 &&
              css`
                ${styleButtonNavbar}
              `,
            css`
              -webkit-tap-highlight-color: transparent;
            `,
          ]}
          onClick={() => {
            setMenuNavbar(2)
          }}
        >
          <svg
            width="27"
            height="27"
            viewBox="0 0 27 27"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 3C0 1.34315 1.34315 0 3 0H22C23.6569 0 25 1.34315 25 3V15.1035C25 15.8992 24.6839 16.6622 24.1213 17.2248L17.2248 24.1213C16.6622 24.6839 15.8992 25 15.1035 25H3C1.34314 25 0 23.6569 0 22V3Z"
              fill={menuNavbar == 2 ? "#1CB273" : "#A0A6AF"}
              css={css`
                transition: 0.3s ease-in-out;
              `}
            />
            <path
              d="M7.95459 7.95483H17.0455"
              stroke="#E5E7E9"
              strokeWidth="2.36364"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7.95459 12.5H17.0455"
              stroke="#E5E7E9"
              strokeWidth="2.36364"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7.95459 17.0452H12.5"
              stroke="#E5E7E9"
              strokeWidth="2.36364"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M24.8971 17.0442H17.0454V24.8965" fill="#A0A6AF" />
            <path
              d="M24.8971 17.0442H17.0454V24.8965"
              stroke="#E5E7E9"
              strokeWidth="2.36364"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </Link>
      <Link href="/profil" passHref>
        <div
          tw="cursor-pointer"
          css={[
            menuNavbar == 3 &&
              css`
                ${styleButtonNavbar}
              `,
            css`
              -webkit-tap-highlight-color: transparent;
            `,
          ]}
          onClick={() => {
            setMenuNavbar(3)
          }}
        >
          <img src={profileImageUrl()} alt="" />
        </div>
      </Link>
    </div>
  )
}

export { Navbar }
