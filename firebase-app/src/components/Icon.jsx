// Minimal line icons (no emoji) for a clean dark UI.
const PATHS = {
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  qr: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3v3M20 14v.01M14 20v.01M20 20v.01M17.5 17.5v3.5" />
    </>
  ),
  leaf: <path d="M4 20C4 12 10 4 20 4c0 10-8 16-16 16Zm0 0c2-6 6-8 10-9" />,
  shield: (
    <>
      <path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6l7-3Z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  unlock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 7.5-2" />
    </>
  ),
  scan: (
    <>
      <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" />
      <path d="M4 12h16" />
    </>
  ),
  bolt: <path d="M13 3 4 14h6l-1 7 9-11h-6l1-7Z" />,
  recycle: (
    <>
      <path d="M7 7l2-3 3 5M17 8l1 3-5 1M9 18l-3-1 1-5" />
      <path d="M5 12l-1 4 4 1M12 4l3 2-1 4M18 15l1-4-4-1" />
    </>
  ),
  check: <path d="M4 12l5 5L20 6" />,
}

export default function Icon({ name, size = 24, className = '' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name] || null}
    </svg>
  )
}
