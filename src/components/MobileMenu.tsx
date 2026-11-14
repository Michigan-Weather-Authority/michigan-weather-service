import { Link } from "@tanstack/react-router";
import { Menu, Sun, AlertTriangle, FileText, Eye, Radio, Smartphone, Settings2, Camera, ScrollText } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const LINKS = [
  { to: "/", label: "Overview", Icon: Sun },
  { to: "/alerts-map", label: "Active alerts", Icon: AlertTriangle },
  { to: "/forecasts", label: "Forecasts", Icon: FileText },
  { to: "/satellite", label: "Satellite", Icon: Eye },
  { to: "/tools", label: "Weather tools", Icon: Radio },
  { to: "/reports", label: "Spotter reports", Icon: Camera },
  { to: "/mobile", label: "iOS + Android", Icon: Smartphone },
  { to: "/settings", label: "Settings", Icon: Settings2 },
  { to: "/changelog", label: "Changelog", Icon: ScrollText },
] as const;

export function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger className="mobile-menu-btn inline-flex items-center justify-center min-h-11 min-w-11 text-muted-foreground hover:text-accent" aria-label="Open menu">
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="right" className="w-72 pt-[calc(env(safe-area-inset-top,0px)+1rem)]">
        <SheetHeader><SheetTitle>Menu</SheetTitle></SheetHeader>
        <nav className="mt-4 flex flex-col gap-1">
          {LINKS.map(({ to, label, Icon }) => (
            <Link key={to} to={to} className="flex items-center gap-3 rounded-md px-3 min-h-12 text-sm hover:bg-secondary">
              <Icon className="h-4 w-4 shrink-0 text-accent" /> {label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
