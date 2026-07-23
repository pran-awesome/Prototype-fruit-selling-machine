// Large, faint Fresh Lab emblem watermark shown behind the app content.
export default function BackgroundLogo() {
  return (
    <div className="bg-logo" aria-hidden="true">
      <svg
        viewBox="0 0 44 56"
        fill="none"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <g stroke="#cbd0d9">
          <rect x="3" y="3" width="38" height="50" rx="8" />
          <path d="M8 24H16M28 24H36" />
          <path d="M14 24H30" />
          <path d="M16 24V40a6 6 0 0 0 12 0V24" />
          <path d="M22 27V39M22 31 19 34M22 33 25 36M22 36 20 39" />
          <path d="M22 24V14" />
        </g>
        <g stroke="#a7ddba">
          <path d="M22 16C18 16 15 14 15 10c4 0 7 2 7 6Z" />
          <path d="M22 15c4 0 7-2 7-6-4 0-7 2-7 6Z" />
          <path d="M22 14c0-3 1-5 3-6" />
        </g>
      </svg>
    </div>
  )
}
