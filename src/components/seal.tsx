export function Seal({ className = "size-12" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="0.6" />
      <path
        d="M32 8.5v5.5M32 50v5.5M8.5 32h5.5M50 32h5.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <text
        x="32"
        y="38"
        textAnchor="middle"
        fill="currentColor"
        fontSize="18"
        fontFamily="var(--font-seal), serif"
      >
        少林
      </text>
    </svg>
  );
}
