interface IconProps {
  className?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
}

export function ArchiveIcon({ className = 'size-4', 'aria-hidden': ariaHidden }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden={ariaHidden}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
      />
    </svg>
  );
}
