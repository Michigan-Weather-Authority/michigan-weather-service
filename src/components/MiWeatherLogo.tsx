import { CloudLightning } from "lucide-react";

export function MiWeatherLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const isLg = size === "lg";
  const isSm = size === "sm";

  return (
    <div className="inline-flex items-center gap-2.5 select-none">
      <div className={`miweather-mark relative flex shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground ${
        isLg ? "h-11 w-11" : isSm ? "h-7 w-7" : "h-9 w-9"
      }`}>
        <CloudLightning aria-hidden="true" className={isLg ? "h-7 w-7" : isSm ? "h-5 w-5" : "h-6 w-6"} />
      </div>
      <div>
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-display font-bold text-foreground ${
            isLg ? "text-2xl" : isSm ? "text-sm" : "text-xl"
          }`}>
            MI<span className="text-accent">Weather</span>
          </span>
        </div>
        <p className="hidden sm:block text-[9px] font-medium text-muted-foreground uppercase mt-1">
          By Michigan Weather Authority
        </p>
      </div>
    </div>
  );
}
