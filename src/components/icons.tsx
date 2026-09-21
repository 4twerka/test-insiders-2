type IconProps = {
  className?: string;
};

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function BooksIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 6.5c-1.6-1.1-4-1.6-6.2-1.2v13c2.2-.4 4.6.1 6.2 1.2" />
      <path d="M12 6.5c1.6-1.1 4-1.6 6.2-1.2v13c-2.2-.4-4.6.1-6.2 1.2" />
      <path d="M12 6.5v13" />
    </svg>
  );
}

export function BookmarkIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M6.5 4.5h11a1 1 0 0 1 1 1V20l-6.5-4-6.5 4V5.5a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

export function UserCircleIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="8.5" r="3.2" />
      <path d="M5.2 19.5c1.4-3.4 4-5.1 6.8-5.1s5.4 1.7 6.8 5.1" />
    </svg>
  );
}

export function ShieldIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3.5 18.5 6v5.4c0 4.4-2.8 7.4-6.5 8.9-3.7-1.5-6.5-4.5-6.5-8.9V6L12 3.5Z" />
    </svg>
  );
}

export function LogoutIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M9 4.5H5.8a1.3 1.3 0 0 0-1.3 1.3v12.4a1.3 1.3 0 0 0 1.3 1.3H9" />
      <path d="M14.5 8l4 4-4 4" />
      <path d="M18.2 12H9.5" />
    </svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-4-4" />
    </svg>
  );
}
