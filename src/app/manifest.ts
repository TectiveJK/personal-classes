import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Shaolin Temple Greece Personal Training",
    short_name: "Shaolin PT",
    description: "Reserve a place in Personal Training at Shaolin Temple Greece.",
    start_url: "/",
    display: "standalone",
    background_color: "#170d09",
    theme_color: "#170d09",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
