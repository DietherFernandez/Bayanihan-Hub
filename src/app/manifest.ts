import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GabayPH — Your Everyday Guide to a Better Life",
    short_name: "GabayPH",
    description:
      "Accessible, trustworthy, and free digital platform connecting Filipinos with verified government services, employment, financial assistance, education, community support, and emergency resources.",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F9FC",
    theme_color: "#17365D",
    icons: [
      {
        src: "/icon",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
