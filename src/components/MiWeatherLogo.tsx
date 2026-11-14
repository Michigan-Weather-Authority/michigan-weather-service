import { Zap, CloudLightning } from "lucide-react";

export function MiWeatherLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const isLg = size === "lg";
  const isSm = size === "sm";

  return (
    <div className="inline-flex items-center gap-2.5 select-none">
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 text-white shadow-lg shadow-violet-600/30 ${
        isLg ? "h-11 w-11" : isSm ? "h-7 w-7" : "h-9 w-9"
      }`}>
        <Zap className={`${isLg ? "h-6 w-6" : isSm ? "h-3.5 w-3.5" : "h-5 w-5"} fill-white`} />
      </div>
      <div>
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-black tracking-tight text-foreground ${
            isLg ? "text-xl" : isSm ? "text-sm" : "text-base"
          }`}>
            MI<span className="text-violet-400">Weather</span>
          </span>
          <span className="rounded-full bg-violet-500/20 px-1.5 py-0.5 text-[9px] font-mono font-bold text-violet-300">
            PRO
          </span>
        </div>
        <p className="text-[9px] font-bold tracking-wider text-muted-foreground uppercase mt-0.5">
          By Michigan Weather Authority
        </p>
      </div>
    </div>
  );
}
