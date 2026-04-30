import { Link } from "react-router-dom";
import { useMeta } from "../data/store";

type Props = {
  variant?: "header-transparent" | "header-solid" | "footer";
  className?: string;
};

export default function SiteLogo({ variant = "header-solid", className = "" }: Props) {
  const meta = useMeta();
  const isTransparent = variant === "header-transparent";
  const isFooter = variant === "footer";

  if (meta.logo) {
    // Custom logo uploaded by admin
    return (
      <Link to="/" className={`flex items-center ${className}`}>
        <img
          src={meta.logo}
          alt={meta.siteName || "ExploraPucón"}
          style={{ width: meta.logoWidth || 140, height: "auto" }}
          className={`object-contain max-h-12 ${isTransparent ? "brightness-0 invert" : ""}`}
        />
      </Link>
    );
  }

  // Default text logo
  return (
    <Link to="/" className={`flex items-center gap-2 group ${className}`}>
      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg flex-shrink-0">
        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-white" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 20l5-9 4 6 3-4 6 7z" />
          <circle cx="17" cy="7" r="2" />
        </svg>
      </div>
      <div className="leading-tight">
        <div className={`font-extrabold text-lg tracking-tight ${isFooter ? "text-white" : isTransparent ? "text-white" : "text-emerald-800"}`}>
          {meta.siteName
            ? <>
                <span>{meta.siteName.replace(/pucon|pucón/i, "")}</span>
                <span className="text-emerald-400">{meta.siteName.match(/pucon|pucón/i)?.[0] || ""}</span>
              </>
            : <>Explora<span className="text-emerald-400">Pucón</span></>
          }
        </div>
        {meta.tagline && (
          <div className={`text-[10px] uppercase tracking-[0.2em] ${isFooter ? "text-slate-400" : isTransparent ? "text-white/80" : "text-slate-500"}`}>
            {meta.tagline}
          </div>
        )}
      </div>
    </Link>
  );
}
