/**
 * Analytics guard. Runs after `next build` (npm run check:analytics, and as part
 * of `npm run build`), next to check-payment.mjs, check-turnaround.mjs and
 * check-returns.mjs. A second, browser-driven half runs on demand against a
 * deployed URL: `npm run check:analytics:live -- --url=https://texasfootballuniforms.com`.
 *
 * ## The defect this exists for
 *
 * Until 2026-09-29 Microsoft Clarity recorded nothing on this site and every
 * page threw `Uncaught TypeError: a[c] is not a function` from
 * https://www.clarity.ms/tag/yk7eoybep1. The cause was the element id:
 *
 *   <Script id="clarity" strategy="afterInteractive">{`...c[a]=c[a]||...`}</Script>
 *
 * next/script sets the id on the script element BEFORE it appends it to the
 * document (see loadScript in next/dist/client/script.js), and an element with
 * an id is exposed as a named property of `window`. So by the time the snippet
 * ran, `window.clarity` was already the HTMLScriptElement — truthy, and
 * `Object.keys()` empty, which is why it looked like a bare `{}` in a console.
 * `c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)}` therefore kept
 * the element and never installed the queue stub. The tag script's first
 * statement calls `a[c]("metadata", ...)`, which threw, and it threw BEFORE the
 * line that sets `t.src="https://scripts.clarity.ms/0.8.70/clarity.js"` — so
 * clarity.js never loaded and no /collect ever fired. Deterministic, on every
 * route. The same project id worked on the Astro sites in the portfolio only
 * because their script tag carries no id.
 *
 * Two things were measured in isolation before choosing the fix (three blank
 * pages, one variant each, 2026-09-29):
 *
 *   - `<script async src="https://www.clarity.ms/tag/yk7eoybep1">` with no
 *     inline stub: `TypeError: Cannot read properties of undefined (reading
 *     'v')`, no clarity.js, no /collect. The tag reads `window.clarity.v` on its
 *     first line, so it CANNOT bootstrap itself. Loading the tag URL as `src` is
 *     not an option, and this file asserts nobody tries it.
 *   - the same inline stub under a non-colliding id: `typeof window.clarity ===
 *     "function"`, clarity.js requested, /collect sent, zero errors.
 *
 * ## What is asserted
 *
 * Static (no browser, runs in the build), against BOTH the source and the built
 * output, because the source is not what a visitor executes:
 *
 *   1. No inline <Script> carries its code as JSX children. The form next/script
 *      documents for a third-party snippet is dangerouslySetInnerHTML, and the
 *      children form is what shipped the original defect.
 *   2. No inline <Script> has an id equal to a global its own snippet writes.
 *      This is the general form of the Clarity bug: id="clarity" next to
 *      `window.clarity`, id="dataLayer" next to `window.dataLayer`, and so on.
 *      The id is checked against every identifier-shaped string literal in the
 *      snippet and every `window.X` it touches.
 *   3. The built pages carry the Clarity bootstrap exactly once, the GA4 config
 *      exactly once, and no `"id":"clarity"` anywhere.
 *   4. The ids are unchanged: Clarity project yk7eoybep1, GA4 G-J277MJQFD0.
 *      Neither may be edited by accident.
 *   5. /ga4-events.js ships and the layout loads it.
 *
 * Live (--live, needs a Chrome; not part of the build), per route and repeated,
 * each run in a fresh browser context with a cold cache:
 *
 *   6. Zero page errors and zero console errors.
 *   7. typeof window.clarity === "function" (not an element, not undefined).
 *   8. scripts.clarity.ms/<version>/clarity.js requested.
 *   9. A Clarity /collect request made.
 *  10. Exactly one www.clarity.ms/tag/ request, i.e. the snippet executed once,
 *      and exactly one executing inline script on the page contains it. The RSC
 *      flight payload (self.__next_f) also contains the snippet as a JSON
 *      string; that one is data, not an execution, and is excluded.
 *  11. Exactly one gtag('config') in dataLayer, and exactly one
 *      /g/collect ... en=page_view per navigation.
 *
 * Both halves were watched failing against planted defects before being trusted
 * (2026-09-29): restoring the JSX-children form failed rule 1; restoring
 * id="clarity" failed rules 2, 3, 6, 7, 8 and 9.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const RESET = "\x1b[0m";

const CLARITY_PROJECT_ID = "yk7eoybep1";
const GA4_MEASUREMENT_ID = "G-J277MJQFD0";

const failures = [];
const fail = (msg) => failures.push(msg);

/* ------------------------------------------------------------------ helpers */

function walk(dir, test, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".git") continue;
    const path = join(dir, name);
    const st = statSync(path);
    if (st.isDirectory()) walk(path, test, out);
    else if (test(path)) out.push(path);
  }
  return out;
}

const countOf = (haystack, needle) => haystack.split(needle).length - 1;

/**
 * Comments out of the way first. src/app/layout.tsx documents the id trap by
 * quoting `<Script id="clarity">` in a JSX comment, and a scanner that reads
 * comments would report the documentation as the defect. Line comments are left
 * alone on purpose: the snippets contain `https://` and stripping `//` would eat
 * them.
 */
const stripComments = (source) =>
  source.replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, "").replace(/\/\*[\s\S]*?\*\//g, "");

/**
 * Every <Script ...> element in a source file, with its attribute text and the
 * body between the opening and closing tag (empty for a self-closing one).
 */
function findScriptElements(source) {
  const found = [];
  const re = /<Script(\s)/g;
  let m;
  while ((m = re.exec(source))) {
    // Walk forward to the end of the opening tag, tracking brace depth so that
    // a `>` inside a JSX expression attribute does not end it.
    let i = m.index + "<Script".length;
    let depth = 0;
    let selfClosing = false;
    for (; i < source.length; i += 1) {
      const ch = source[i];
      if (ch === "{") depth += 1;
      else if (ch === "}") depth -= 1;
      else if (ch === ">" && depth === 0) {
        selfClosing = source[i - 1] === "/";
        break;
      }
    }
    const attrs = source.slice(m.index, i);
    let body = "";
    if (!selfClosing) {
      const close = source.indexOf("</Script>", i);
      body = close === -1 ? "" : source.slice(i + 1, close);
    }
    found.push({ attrs, body, selfClosing, index: m.index });
  }
  return found;
}

/**
 * A real attribute of the opening tag. The inline snippet passed through
 * dangerouslySetInnerHTML contains `t.src="..."` of its own, so the template
 * literal is removed before the attributes are read.
 */
const attr = (attrs, name) => {
  const withoutSnippet = attrs.replace(/__html:\s*`[\s\S]*?`/g, "__html: ``");
  const m = withoutSnippet.match(new RegExp(`[\\s{]${name}="([^"]*)"`));
  return m ? m[1] : null;
};

/** Global names a snippet writes to or names by string, for the id-clash rule. */
function globalsTouchedBy(snippet) {
  const names = new Set();
  for (const m of snippet.matchAll(/["'`]([A-Za-z_$][A-Za-z0-9_$]*)["'`]/g)) {
    names.add(m[1]);
  }
  for (const m of snippet.matchAll(/window\.([A-Za-z_$][A-Za-z0-9_$]*)/g)) {
    names.add(m[1]);
  }
  return names;
}

/* ------------------------------------------------- 1, 2, 4, 5: source rules */

const sourceFiles = walk(join(ROOT, "src"), (p) => p.endsWith(".tsx") || p.endsWith(".ts"));
let inlineScriptsSeen = 0;
let clarityScriptsSeen = 0;
let ga4ScriptsSeen = 0;

for (const file of sourceFiles) {
  const source = stripComments(readFileSync(file, "utf8"));
  if (!source.includes("<Script")) continue;
  const rel = relative(ROOT, file);

  for (const el of findScriptElements(source)) {
    const id = attr(el.attrs, "id");
    const src = attr(el.attrs, "src");
    const dsih = el.attrs.includes("dangerouslySetInnerHTML");
    const childCode = el.body.trim();

    // Rule 1: no JSX children on an inline Script.
    if (childCode && childCode !== "") {
      fail(
        `${rel}: <Script id="${id}"> carries its snippet as JSX children. ` +
          `Use dangerouslySetInnerHTML={{ __html: \`...\` }} — the children form is ` +
          `what next/script documents against and what shipped the Clarity defect.`,
      );
    }

    const snippet = dsih
      ? (el.attrs.match(/__html:\s*`([\s\S]*?)`/) || [, ""])[1]
      : childCode;

    if (snippet) {
      inlineScriptsSeen += 1;
      // Rule 2: the id must not be a global the snippet itself writes.
      if (!id) {
        fail(`${rel}: an inline <Script> has no id; next/script needs one to de-duplicate it.`);
      } else if (globalsTouchedBy(snippet).has(id)) {
        fail(
          `${rel}: <Script id="${id}"> collides with the global \`${id}\` that its own ` +
            `snippet writes. An element id becomes a named window property, so the ` +
            `snippet sees the script element instead of undefined. Rename the id.`,
        );
      }
      if (snippet.includes("clarity.ms/tag/")) {
        clarityScriptsSeen += 1;
        // Rule 4.
        if (!snippet.includes(`"${CLARITY_PROJECT_ID}"`)) {
          fail(`${rel}: the Clarity snippet no longer carries project id ${CLARITY_PROJECT_ID}.`);
        }
      }
      if (snippet.includes("gtag('config'")) {
        ga4ScriptsSeen += 1;
        // Rule 4.
        if (!snippet.includes(`gtag('config','${GA4_MEASUREMENT_ID}')`)) {
          fail(`${rel}: the GA4 snippet no longer configures ${GA4_MEASUREMENT_ID}.`);
        }
      }
    }

    // Rule: the Clarity tag URL must never be loaded as a bare src. It reads
    // window.clarity.v on its first line and throws without the inline stub.
    if (src && src.includes("clarity.ms/tag/")) {
      fail(
        `${rel}: <Script src="${src}"> loads the Clarity tag with no inline stub. ` +
          `The tag reads window.clarity.v immediately and throws; it cannot bootstrap itself.`,
      );
    }
  }
}

if (clarityScriptsSeen !== 1) {
  fail(`the source declares ${clarityScriptsSeen} Clarity snippets; expected exactly 1.`);
}
if (ga4ScriptsSeen !== 1) {
  fail(`the source declares ${ga4ScriptsSeen} GA4 config snippets; expected exactly 1.`);
}

// Rule 5.
const eventsFile = join(ROOT, "public", "ga4-events.js");
if (!existsSync(eventsFile)) {
  fail("public/ga4-events.js is missing; the GA4 key events come from it.");
} else {
  const layout = readFileSync(join(ROOT, "src", "app", "layout.tsx"), "utf8");
  if (!layout.includes('src="/ga4-events.js"')) {
    fail("src/app/layout.tsx no longer loads /ga4-events.js.");
  }
}

/* --------------------------------------------------- 3: built-output rules */

const builtPages = walk(join(ROOT, ".next", "server", "app"), (p) => p.endsWith(".html"));
if (builtPages.length === 0) {
  fail("no built pages under .next/server/app — run `next build` first.");
}
let pagesChecked = 0;
for (const page of builtPages) {
  const name = relative(join(ROOT, ".next", "server", "app"), page);
  if (name.startsWith("_")) continue; // _not-found / _global-error
  const html = readFileSync(page, "utf8");
  if (!html.includes("__next_f")) continue; // not a rendered app page
  pagesChecked += 1;

  const bootstraps = countOf(html, "clarity.ms/tag/");
  if (bootstraps !== 1) {
    fail(`${name}: ${bootstraps} Clarity bootstraps in the built page; expected exactly 1.`);
  }
  if (!html.includes(CLARITY_PROJECT_ID)) {
    fail(`${name}: Clarity project id ${CLARITY_PROJECT_ID} is not in the built page.`);
  }
  const configs = countOf(html, `gtag('config','${GA4_MEASUREMENT_ID}')`);
  if (configs !== 1) {
    fail(`${name}: ${configs} gtag('config') snippets in the built page; expected exactly 1.`);
  }
  // The named-window-property trap, as it appears in the RSC payload.
  if (/id\\?":\\?"clarity\\?"/.test(html)) {
    fail(
      `${name}: a <Script> still ships with id="clarity". That id becomes ` +
        `window.clarity and breaks the snippet. Use a different id.`,
    );
  }
}

/* ------------------------------------------------------- 6-11: live checks */

const args = process.argv.slice(2);
const flag = (name, dflt) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : dflt;
};
const live = args.includes("--live") || args.some((a) => a.startsWith("--url="));

const liveReport = [];

if (live) {
  const base = (flag("url", "https://texasfootballuniforms.com")).replace(/\/$/, "");
  const routes = flag("routes", "/,/american-football-jerseys/,/checkout/")
    .split(",")
    .map((r) => r.trim())
    .filter(Boolean);
  const repeats = Number(flag("repeats", "5"));

  const { default: puppeteer } = await import("puppeteer-core").catch(() => ({ default: null }));
  if (!puppeteer) {
    fail("--live needs puppeteer-core (npm i -D puppeteer-core).");
  } else {
    const executablePath = resolveChrome();
    if (!executablePath) {
      fail(
        "--live found no Chrome. Set CHROME_PATH, or install one " +
          "(npx puppeteer browsers install chrome).",
      );
    } else {
      const browser = await puppeteer.launch({
        executablePath,
        headless: true,
        args: ["--no-sandbox", "--disable-dev-shm-usage"],
      });
      try {
        for (const route of routes) {
          for (let run = 1; run <= repeats; run += 1) {
            const result = await probe(browser, base + route);
            liveReport.push({ route, run, ...result });
            for (const problem of result.problems) {
              fail(`${route} run ${run}: ${problem}`);
            }
          }
        }
      } finally {
        await browser.close();
      }
    }
  }
}

function resolveChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
  ].filter(Boolean);
  // Whatever `puppeteer browsers install` last put in the cache.
  const cache = join(process.env.HOME || "", ".cache", "puppeteer", "chrome");
  if (existsSync(cache)) {
    for (const dir of readdirSync(cache).sort().reverse()) {
      candidates.push(
        join(cache, dir, "chrome-mac-arm64", "Google Chrome for Testing.app", "Contents", "MacOS", "Google Chrome for Testing"),
        join(cache, dir, "chrome-mac-x64", "Google Chrome for Testing.app", "Contents", "MacOS", "Google Chrome for Testing"),
        join(cache, dir, "chrome-linux64", "chrome"),
      );
    }
  }
  return candidates.find((p) => p && existsSync(p)) || null;
}

async function probe(browser, url) {
  // A fresh context per run: its own cookie jar and its own cold HTTP cache,
  // because a warm cache changes the order the tags execute in.
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  const errors = [];
  const requests = [];
  page.on("pageerror", (e) => errors.push(String(e.message || e)));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`console: ${m.text()}`);
  });
  page.on("request", (r) => requests.push({ url: r.url(), body: r.postData() || "" }));

  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
    // Clarity's tag inserts clarity.js and only then uploads; give it room.
    await new Promise((r) => setTimeout(r, 4000));
  } catch (e) {
    await context.close();
    return { problems: [`navigation failed: ${e.message}`], errors, clarityType: null };
  }

  const state = await page.evaluate(() => {
    const inline = [...document.querySelectorAll("script:not([src])")];
    return {
      clarityType: typeof window.clarity,
      clarityCtor:
        window.clarity && window.clarity.constructor ? window.clarity.constructor.name : null,
      // The flight payload carries the snippet as a JSON string; it is data,
      // not an execution, so it is not counted.
      inlineClarityBootstraps: inline.filter(
        (s) => s.textContent.includes("clarity.ms/tag/") && !s.textContent.includes("__next_f"),
      ).length,
      inlineGa4Configs: inline.filter(
        (s) => s.textContent.includes("gtag('config'") && !s.textContent.includes("__next_f"),
      ).length,
      gtagConfigs: (window.dataLayer || []).filter((a) => a && a[0] === "config").length,
      gtagJs: (window.dataLayer || []).filter((a) => a && a[0] === "js").length,
    };
  });

  const hits = (test) => requests.filter(({ url: u, body }) => test(u) || test(body)).length;
  const counts = {
    clarityTag: hits((s) => s.includes("clarity.ms/tag/")),
    clarityJs: hits((s) => /scripts\.clarity\.ms\/[\d.]+\/clarity\.js/.test(s)),
    clarityCollect: hits((s) => /clarity\.ms\/collect/.test(s)),
    pageView: hits((s) => s.includes("/g/collect") && s.includes("en=page_view")),
  };

  const problems = [];
  if (errors.length) problems.push(`${errors.length} page error(s): ${errors.join(" | ")}`);
  if (state.clarityType !== "function") {
    problems.push(
      `typeof window.clarity is "${state.clarityType}"` +
        (state.clarityCtor ? ` (${state.clarityCtor})` : "") +
        `, expected "function"`,
    );
  }
  if (counts.clarityJs < 1) problems.push("scripts.clarity.ms/<v>/clarity.js was never requested");
  if (counts.clarityCollect < 1) problems.push("no Clarity /collect request was made");
  if (counts.clarityTag !== 1) {
    problems.push(`${counts.clarityTag} requests to clarity.ms/tag/; expected exactly 1`);
  }
  if (state.inlineClarityBootstraps !== 1) {
    problems.push(
      `${state.inlineClarityBootstraps} executing inline scripts contain the Clarity snippet; expected exactly 1`,
    );
  }
  if (state.inlineGa4Configs !== 1) {
    problems.push(
      `${state.inlineGa4Configs} executing inline scripts contain gtag('config'); expected exactly 1`,
    );
  }
  if (state.gtagConfigs !== 1) {
    problems.push(`${state.gtagConfigs} gtag('config') calls in dataLayer; expected exactly 1`);
  }
  if (counts.pageView !== 1) {
    problems.push(`${counts.pageView} page_view hits to /g/collect; expected exactly 1`);
  }

  await context.close();
  return { problems, errors, ...state, ...counts };
}

/* ------------------------------------------------------------------ report */

if (live) {
  for (const row of liveReport) {
    const ok = row.problems.length === 0;
    console.log(
      `${ok ? GREEN + "  ok  " : RED + " FAIL "}${RESET}${row.route} run ${row.run}: ` +
        `clarity=${row.clarityType}${row.clarityCtor && row.clarityType !== "function" ? `(${row.clarityCtor})` : ""} ` +
        `tag=${row.clarityTag} clarity.js=${row.clarityJs} collect=${row.clarityCollect} ` +
        `inline=${row.inlineClarityBootstraps} gtagConfig=${row.gtagConfigs} page_view=${row.pageView} ` +
        `errors=${row.errors.length}` +
        (ok ? "" : `\n        ${row.problems.join("\n        ")}`),
    );
  }
}

if (failures.length) {
  console.error(`${RED}✗ analytics check failed${RESET} — ${failures.length} problem(s):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

console.log(
  `${GREEN}✓ analytics check passed${RESET} — ${inlineScriptsSeen} inline snippets in source ` +
    `(one Clarity ${CLARITY_PROJECT_ID}, one GA4 ${GA4_MEASUREMENT_ID}), none as JSX children, ` +
    `no id colliding with its own global; ${pagesChecked} built pages carry each snippet exactly once ` +
    `and none ships id="clarity"` +
    (live ? `; ${liveReport.length} live runs clean` : ""),
);
