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
      fill="#000000"
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
        stroke="#000000"
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
        stroke="#000000"
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
      <rect width="256" height="256" fill="none"></rect>
      <path
        d="M184,184H69.8L41.9,30.6A8,8,0,0,0,34.1,24H16"
        fill="none"
        stroke="#ffffff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      ></path>
      <circle
        cx="80"
        cy="204"
        r="20"
        fill="none"
        stroke="#ffffff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      ></circle>
      <circle
        cx="184"
        cy="204"
        r="20"
        fill="none"
        stroke="#ffffff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      ></circle>
      <path
        d="M62.5,144H188.1a15.9,15.9,0,0,0,15.7-13.1L216,64H48"
        fill="none"
        stroke="#ffffff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      ></path>
    </svg>
  )
}
