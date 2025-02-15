import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SINFO - Web App",
    short_name: "SINFO",
    description: "SINFO Web Application",
    start_url: "/",
    display: "standalone",
    background_color: "#323363", // SINFO Primary
    theme_color: "#323363", // SINFO Primary
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
