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
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
