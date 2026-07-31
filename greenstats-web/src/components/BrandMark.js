export function BrandMark({
  className,
  ...props
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M48 40C45 38 40 38 35 43C32 46 32 50 35 55C38 60 45 65 52 65C60 65 65 60 68 55C70 52 70 48 68 45"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M48 40 40 25M68 45l7-15"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M20 50C20 30 35 15 50 15s30 15 30 35-15 35-30 35-30-15-30-35Z"
        stroke="currentColor"
        strokeWidth="4"
        strokeDasharray="15 5"
      />
      <path
        d="M50 15c10 0 25 10 30 25m0 20C75 75 60 85 50 85M20 50c0 15 15 35 30 35m0-70C35 15 20 35 20 50"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
      />
    </svg>
  );
}
