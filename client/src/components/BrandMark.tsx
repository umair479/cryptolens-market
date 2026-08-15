type BrandMarkProps = {
  className?: string;
  title?: string;
};

export function BrandMark({ className, title }: BrandMarkProps) {
  return <svg className={className} viewBox="0 0 64 64" role={title ? "img" : "presentation"} aria-label={title} aria-hidden={title ? undefined : true} focusable="false">
    <defs>
      <linearGradient id="cryptolens-brand-gradient" x1="10" y1="8" x2="54" y2="56" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3861fb" />
        <stop offset="1" stopColor="#16a673" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="27" fill="#f5f8ff" stroke="#d7e2f2" strokeWidth="3" />
    <path d="M19 20.5h23.5v7H26v10.2h13.4v6.8H26v-2.2h-7V20.5Z" fill="url(#cryptolens-brand-gradient)" />
    <circle cx="43.5" cy="43.5" r="5.5" fill="#16a673" stroke="#ffffff" strokeWidth="2.5" />
  </svg>;
}
