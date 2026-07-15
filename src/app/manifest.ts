import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Flow — Your Feed. Your Rules.",
    short_name: "Flow",
    description:
      "One clean feed containing only the creators and topics you actually care about.",
    start_url: "/",
    display: "standalone",
    background_color: "#08080d",
    theme_color: "#08080d",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
