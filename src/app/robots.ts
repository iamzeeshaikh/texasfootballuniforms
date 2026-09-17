import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

/**
 * Answer engines are named explicitly, not because "*: allow" misses them but
 * because an explicit Allow survives a later blanket Disallow and makes the
 * intent readable to whoever edits this next. The site is a quote-first
 * catalog: being quoted by an assistant is a lead, not a loss.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: "Bingbot", allow: "/" },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
