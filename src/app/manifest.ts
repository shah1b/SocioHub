import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Flow — Your Feed. Your Rules.",
    short_name: "Flow",
    description:
      "One clean feed containing only the creators and topics you actually care about.",
    start_url: "/",
    display: "standalone",
    background_color: "#060606",
    theme_color: "#060606",
    icons: [
      {
        src: "/icon.webp",
        sizes: "180x180",
        type: "image/webp",
      },
      {
        src: "/apple-icon.png",
        sizes: "152x152",
        type: "image/png",
      },
    ],
  };
}
