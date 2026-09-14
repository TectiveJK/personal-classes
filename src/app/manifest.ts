import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Shaolin Temple Greece Personal Training",
    short_name: "Shaolin PT",
    description: "Reserve a place in Personal Training at Shaolin Temple Greece.",
    start_url: "/",
    display: "standalone",
    background_color: "#2a1c16",
    theme_color: "#7a2418",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],
  };
}
