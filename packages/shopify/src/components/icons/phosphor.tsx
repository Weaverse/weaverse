import type { HTMLAttributes } from 'react'

export let Circle = (props: HTMLAttributes<SVGElement>) => {
  return (
    <svg
      fill="currentColor"
      height="192"
      viewBox="0 0 256 256"
      width="192"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect fill="none" height="256" width="256" />
      <circle cx="128" cy="128" r="104" />
    </svg>
  )
}

export let CircleNotch = (props: HTMLAttributes<SVGElement>) => {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        style={{ opacity: '.25' }}
      />
      <path
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        fill="currentColor"
        style={{ opacity: '.75' }}
      />
    </svg>
  )
}

export let X = (props: HTMLAttributes<SVGElement>) => {
  return (
    <svg
      fill="currentColor"
      height="20"
      viewBox="0 0 256 256"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect fill="none" height="256" width="256" />
      <line
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="12"
        x1="200"
        x2="56"
        y1="56"
        y2="200"
      />
      <line
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="12"
        x1="200"
        x2="56"
        y1="200"
        y2="56"
      />
    </svg>
  )
}

export let Minus = (props: HTMLAttributes<SVGElement>) => {
  return (
    <svg
      fill="currentColor"
      height="192"
      viewBox="0 0 256 256"
      width="192"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect fill="none" height="256" width="256" />
      <line
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
        x1="40"
        x2="216"
        y1="128"
        y2="128"
      />
    </svg>
  )
}

export let Plus = (props: HTMLAttributes<SVGElement>) => {
  return (
    <svg
      fill="currentColor"
      height="192"
      viewBox="0 0 256 256"
      width="192"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect fill="none" height="256" width="256" />
      <line
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
        x1="40"
        x2="216"
        y1="128"
        y2="128"
      />
      <line
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
        x1="128"
        x2="128"
        y1="40"
        y2="216"
      />
    </svg>
  )
}

export let CaretLeft = (props: HTMLAttributes<SVGElement>) => {
  return (
    <svg
      fill="currentColor"
      height="192"
      viewBox="0 0 256 256"
      width="192"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect fill="none" height="256" width="256" />
      <polyline
        fill="none"
        points="160 208 80 128 160 48"
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
      fill="currentColor"
      height="192"
      viewBox="0 0 256 256"
      width="192"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect fill="none" height="256" width="256" />
      <polyline
        fill="none"
        points="96 48 176 128 96 208"
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
      fill="currentColor"
      height="192"
      viewBox="0 0 256 256"
      width="192"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect fill="none" height="256" width="256" />
      <line
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
        x1="216"
        x2="40"
        y1="128"
        y2="128"
      />
      <polyline
        fill="none"
        points="112 56 40 128 112 200"
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
      fill="currentColor"
      height="192"
      viewBox="0 0 256 256"
      width="192"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect fill="none" height="256" width="256" />
      <line
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
        x1="40"
        x2="216"
        y1="128"
        y2="128"
      />
      <polyline
        fill="none"
        points="144 56 216 128 144 200"
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
      aria-hidden="true"
      fill="currentColor"
      viewBox="0 0 640 512"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
    </svg>
  )
}

export let ShoppingCart = (props: HTMLAttributes<SVGElement>) => {
  return (
    <svg
      fill="currentColor"
      height="192"
      viewBox="0 0 256 256"
      width="192"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect fill="none" height="256" width="256" />
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
        fill="none"
        r="20"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <circle
        cx="184"
        cy="204"
        fill="none"
        r="20"
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
      fill="currentColor"
      height="192"
      viewBox="0 0 256 256"
      width="192"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect fill="none" height="256" width="256" />
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
      fill="currentColor"
      height="192"
      viewBox="0 0 256 256"
      width="192"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect fill="none" height="256" width="256" />
      <path
        d="M224,177.3V78.7a8.1,8.1,0,0,0-4.1-7l-88-49.5a7.8,7.8,0,0,0-7.8,0l-88,49.5a8.1,8.1,0,0,0-4.1,7v98.6a8.1,8.1,0,0,0,4.1,7l88,49.5a7.8,7.8,0,0,0,7.8,0l88-49.5A8.1,8.1,0,0,0,224,177.3Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="8"
      />
      <polyline
        fill="none"
        points="177 152.5 177 100.5 80 47"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="8"
      />
      <polyline
        fill="none"
        points="222.9 74.6 128.9 128 33.1 74.6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="8"
      />
      <line
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="8"
        x1="128.9"
        x2="128"
        y1="128"
        y2="234.8"
      />
    </svg>
  )
}

export let HandBag = (props: HTMLAttributes<SVGElement>) => {
  return (
    <svg
      fill="currentColor"
      height="192"
      viewBox="0 0 256 256"
      width="192"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect fill="none" height="256" width="256" />
      <path
        d="M208.8,72H47.2a8.1,8.1,0,0,0-8,7.1L25,207.1a8,8,0,0,0,7.9,8.9H223.1a8,8,0,0,0,7.9-8.9l-14.2-128A8.1,8.1,0,0,0,208.8,72Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <path
        d="M88,104V72a40,40,0,0,1,80,0v32"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </svg>
  )
}

export let Tag = (props: HTMLAttributes<SVGElement>) => {
  return (
    <svg
      fill="currentColor"
      height="192"
      viewBox="0 0 256 256"
      width="192"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect fill="none" height="256" width="256" />
      <path
        d="M122.7,25.9,42,42,25.9,122.7a8,8,0,0,0,2.2,7.2L132.5,234.3a7.9,7.9,0,0,0,11.3,0l90.5-90.5a7.9,7.9,0,0,0,0-11.3L129.9,28.1A8,8,0,0,0,122.7,25.9Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <circle cx="84" cy="84" r="12" />
    </svg>
  )
}

export let Backpack = (props: HTMLAttributes<SVGElement>) => {
  return (
    <svg
      fill="currentColor"
      height="192"
      viewBox="0 0 256 256"
      width="192"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect fill="none" height="256" width="256" />
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
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="12"
        x1="112"
        x2="144"
        y1="88"
        y2="88"
      />
      <line
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="12"
        x1="80"
        x2="176"
        y1="168"
        y2="168"
      />
      <line
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="12"
        x1="144"
        x2="144"
        y1="168"
        y2="184"
      />
    </svg>
  )
}

export let Newspaper = (props: HTMLAttributes<SVGElement>) => {
  return (
    <svg
      fill="currentColor"
      height="192"
      viewBox="0 0 256 256"
      width="192"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect fill="none" height="256" width="256" />
      <line
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="8"
        x1="96"
        x2="176"
        y1="112"
        y2="112"
      />
      <line
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="8"
        x1="96"
        x2="176"
        y1="144"
        y2="144"
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
      fill="currentColor"
      height="192"
      viewBox="0 0 256 256"
      width="192"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect fill="none" height="256" width="256" />
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
        fill="none"
        r="40"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="12"
      />
    </svg>
  )
}
