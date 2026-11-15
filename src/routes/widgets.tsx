import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/widgets")({
  beforeLoad: () => { throw redirect({ to: "/mobile", statusCode: 301 }); },
  head: () => ({ meta: [
    { title: "iPhone Widget — MIWeather" },
    { name: "description", content: "Download a real MIWeather home-screen widget for iPhone using Scriptable." },
    { property: "og:title", content: "iPhone Widget — MIWeather" },
    { property: "og:description", content: "Your local temperature and forecast on your iPhone home screen with Scriptable." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => null,
});