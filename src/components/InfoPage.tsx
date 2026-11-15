import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function infoHead(title: string, description: string) {
  return { meta: [{ title: `${title} — MIWeather` }, { name: "description", content: description }, { property: "og:title", content: `${title} — MIWeather` }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] };
}
export function InfoPage({ title, eyebrow, children }: { title: string; eyebrow: string; children: ReactNode }) {
  return <main className="max-w-4xl mx-auto px-5 py-8 sm:py-12 min-h-screen">
    <Button asChild variant="ghost" className="mb-8"><Link to="/"><ArrowLeft /> Weather</Link></Button>
    <p className="text-xs font-mono uppercase text-accent mb-3">{eyebrow}</p>
    <h1 className="font-display text-4xl sm:text-5xl leading-tight break-words">{title}</h1>
    <div className="mt-8 space-y-8 text-sm leading-relaxed [&_h2]:font-display [&_h2]:text-xl [&_h2]:mb-3 [&_p]:mb-3 [&_a]:text-accent [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5">{children}</div>
    <footer className="border-t border-border mt-12 pt-6 flex flex-wrap gap-4 text-xs text-muted-foreground">
      <span>MIWeather · Part of Michigan Weather Authority</span>
      <Link to="/mobile">Mobile apps</Link><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><Link to="/delete-account">Delete account</Link><Link to="/changelog">Changelog</Link>
    </footer>
  </main>;
}