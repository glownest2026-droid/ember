import type { MetadataRoute } from "next";

/** Discourage crawlers from hammering private, API, and diagnostic paths. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/app/",
        "/account/",
        "/admin/",
        "/add-children/",
        "/family/",
        "/my-ideas/",
        "/auth/",
        "/cms/diag",
        "/cms/_diag",
        "/whoami",
        "/go/",
        "/signin",
        "/signin/",
        "/verify",
        "/reset-password",
        "/forgot-password",
      ],
    },
  };
}
