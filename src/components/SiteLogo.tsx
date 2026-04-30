import { useMeta } from "../data/store";

type Props = {
  size?: "sm" | "md" | "lg";
  className?: string;
  light?: boolean; // white text for dark backgrounds
};

export default function SiteLogo({ size = "md", className = "", light = false }: Props) {
  const { logo } = useMeta();

  const sizes = { sm: "h-8", md: "h-10", lg: "h-16" };

  // If a logo image is configured, use it
  if (logo) {
    return (
      <img
        src={logo}
        alt="ExploraPucón"
        className={`${sizes[size]} w-auto object-contain ${className}`}
      />
    );
  }

  // Default: icon + text
  const iconSize = size === "lg" ? "h-14 w-14 rounded-2xl" : size === "sm" ? "h-8 w-8 rounded-lg" : "h-10 w-10 rounded-xl";
  const iconSvg = size === "lg" ? "h-8 w-8" : size === "sm" ? "h-4 w-4" : "h-6 w-6";
  const titleSize = size === "lg" ? "text-2xl" : size === "sm" ? "text-sm" : "text-lg";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${iconSize} bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg flex-shrink-0`}>
        <svg viewBox="0 0 24 24" fill="none" className={`${iconSvg} text-white`} stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 20l5-9 4 6 3-4 6 7z" />
          <circle cx="17" cy="7" r="2" />
        </svg>
      </div>
      {size !== "sm" && (
        <div className="leading-tight">
          <div className={`font-extrabold tracking-tight ${titleSize} ${light ? "text-white" : "text-emerald-800"}`}>
            Explora<span className="text-emerald-400">Pucón</span>
          </div>
          <div className={`text-[10px] uppercase tracking-[0.2em] ${light ? "text-white/80" : "text-slate-500"}`}>
            Aventura · Naturaleza
          </div>
        </div>
      )}
    </div>
  );
}
