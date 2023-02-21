import type { HTMLAttributes } from 'react'
import React from 'react'

export let CircleNotch = (props: HTMLAttributes<SVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle
        style={{ opacity: '.25' }}
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        style={{ opacity: '.75' }}
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

export let X = (props: HTMLAttributes<SVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="currentColor"
      viewBox="0 0 256 256"
      {...props}
    >
      <rect width="256" height="256" fill="none" />
      <line
        x1="200"
        y1="56"
        x2="56"
        y2="200"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="12"
      />
      <line
        x1="200"
        y1="200"
        x2="56"
        y2="56"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="12"
      />
    </svg>
  )
}

export let Minus = (props: HTMLAttributes<SVGElement>) => {
  return (
    <svg
      width="196"
      height="196"
      fill="currentColor"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 384 512"
      {...props}
    >
      <path d="M376 232H8c-4.42 0-8 3.58-8 8v32c0 4.42 3.58 8 8 8h368c4.42 0 8-3.58 8-8v-32c0-4.42-3.58-8-8-8z" />
    </svg>
  )
}

export let Plus = (props: HTMLAttributes<SVGElement>) => {
  return (
    <svg
      width="196"
      height="196"
      fill="currentColor"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 384 512"
      {...props}
    >
      <path d="M376 232H216V72c0-4.42-3.58-8-8-8h-32c-4.42 0-8 3.58-8 8v160H8c-4.42 0-8 3.58-8 8v32c0 4.42 3.58 8 8 8h160v160c0 4.42 3.58 8 8 8h32c4.42 0 8-3.58 8-8V280h160c4.42 0 8-3.58 8-8v-32c0-4.42-3.58-8-8-8z" />
    </svg>
  )
}

export let CaretLeft = (props: HTMLAttributes<SVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="192"
      height="192"
      fill="currentColor"
      viewBox="0 0 256 256"
      {...props}
    >
      <rect width="256" height="256" fill="none" />
      <polyline
        points="160 208 80 128 160 48"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </svg>
  )
}

export let CaretRight = (props: HTMLAttributes<SVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="192"
      height="192"
      fill="currentColor"
      viewBox="0 0 256 256"
      {...props}
    >
      <rect width="256" height="256" fill="none" />
      <polyline
        points="96 48 176 128 96 208"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </svg>
  )
}

export let ArrowLeft = (props: HTMLAttributes<SVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="192"
      height="192"
      fill="currentColor"
      viewBox="0 0 256 256"
      {...props}
    >
      <rect width="256" height="256" fill="none" />
      <line
        x1="216"
        y1="128"
        x2="40"
        y2="128"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <polyline
        points="112 56 40 128 112 200"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </svg>
  )
}

export let ArrowRight = (props: HTMLAttributes<SVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="192"
      height="192"
      fill="currentColor"
      viewBox="0 0 256 256"
      {...props}
    >
      <rect width="256" height="256" fill="none" />
      <line
        x1="40"
        y1="128"
        x2="216"
        y2="128"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <polyline
        points="144 56 216 128 144 200"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </svg>
  )
}

export let Image = (props: HTMLAttributes<SVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      fill="currentColor"
      viewBox="0 0 640 512"
      {...props}
    >
      <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
    </svg>
  )
}

export let ShoppingCart = (props: HTMLAttributes<SVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="192"
      height="192"
      fill="currentColor"
      viewBox="0 0 256 256"
      {...props}
    >
      <rect width="256" height="256" fill="none" />
      <path
        d="M184,184H69.8L41.9,30.6A8,8,0,0,0,34.1,24H16"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <circle
        cx="80"
        cy="204"
        r="20"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <circle
        cx="184"
        cy="204"
        r="20"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <path
        d="M62.5,144H188.1a15.9,15.9,0,0,0,15.7-13.1L216,64H48"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </svg>
  )
}

export let Storefront = (props: HTMLAttributes<SVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="192"
      height="192"
      fill="currentColor"
      viewBox="0 0 256 256"
      {...props}
    >
      <rect width="256" height="256" fill="none" />
      <path
        d="M48,139.6V208a8,8,0,0,0,8,8H200a8,8,0,0,0,8-8V139.6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="12"
      />
      <path
        d="M54,40H202a8.1,8.1,0,0,1,7.7,5.8L224,96H32L46.3,45.8A8.1,8.1,0,0,1,54,40Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="12"
      />
      <path
        d="M96,96v16a32,32,0,0,1-64,0V96"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="12"
      />
      <path
        d="M160,96v16a32,32,0,0,1-64,0V96"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="12"
      />
      <path
        d="M224,96v16a32,32,0,0,1-64,0V96"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="12"
      />
    </svg>
  )
}

export let Package = (props: HTMLAttributes<SVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="192"
      height="192"
      fill="currentColor"
      viewBox="0 0 256 256"
      {...props}
    >
      <rect width="256" height="256" fill="none" />
      <path
        d="M224,177.3V78.7a8.1,8.1,0,0,0-4.1-7l-88-49.5a7.8,7.8,0,0,0-7.8,0l-88,49.5a8.1,8.1,0,0,0-4.1,7v98.6a8.1,8.1,0,0,0,4.1,7l88,49.5a7.8,7.8,0,0,0,7.8,0l88-49.5A8.1,8.1,0,0,0,224,177.3Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="8"
      />
      <polyline
        points="177 152.5 177 100.5 80 47"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="8"
      />
      <polyline
        points="222.9 74.6 128.9 128 33.1 74.6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="8"
      />
      <line
        x1="128.9"
        y1="128"
        x2="128"
        y2="234.8"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="8"
      />
    </svg>
  )
}

export let Backpack = (props: HTMLAttributes<SVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="192"
      height="192"
      fill="currentColor"
      viewBox="0 0 256 256"
      {...props}
    >
      <rect width="256" height="256" fill="none" />
      <path
        d="M96,48h64a48,48,0,0,1,48,48V216a8,8,0,0,1-8,8H56a8,8,0,0,1-8-8V96A48,48,0,0,1,96,48Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="12"
      />
      <path
        d="M80,224V152a16,16,0,0,1,16-16h64a16,16,0,0,1,16,16v72"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="12"
      />
      <path
        d="M96,48V32a16,16,0,0,1,16-16h32a16,16,0,0,1,16,16V48"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="12"
      />
      <line
        x1="112"
        y1="88"
        x2="144"
        y2="88"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="12"
      />
      <line
        x1="80"
        y1="168"
        x2="176"
        y2="168"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="12"
      />
      <line
        x1="144"
        y1="168"
        x2="144"
        y2="184"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="12"
      />
    </svg>
  )
}

export let Newspaper = (props: HTMLAttributes<SVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="192"
      height="192"
      fill="currentColor"
      viewBox="0 0 256 256"
      {...props}
    >
      <rect width="256" height="256" fill="none" />
      <line
        x1="96"
        y1="112"
        x2="176"
        y2="112"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="8"
      />
      <line
        x1="96"
        y1="144"
        x2="176"
        y2="144"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="8"
      />
      <path
        d="M32,200a16,16,0,0,0,16-16V64a8,8,0,0,1,8-8H216a8,8,0,0,1,8,8V184a16,16,0,0,1-16,16Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="8"
      />
      <path
        d="M32,200a16,16,0,0,1-16-16h0V88"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="8"
      />
    </svg>
  )
}

export let Eye = (props: HTMLAttributes<SVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="192"
      height="192"
      fill="currentColor"
      viewBox="0 0 256 256"
      {...props}
    >
      <rect width="256" height="256" fill="none" />
      <path
        d="M128,56C48,56,16,128,16,128s32,72,112,72,112-72,112-72S208,56,128,56Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="12"
      />
      <circle
        cx="128"
        cy="128"
        r="40"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="12"
      />
    </svg>
  )
}
