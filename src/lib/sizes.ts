/**
 * The size run, and nothing but the size run.
 *
 * Every size a buyer can pick in the cart comes from here, and this list is the
 * one published on /size-chart/ — youth XS through adult 5XL. Nothing invents a
 * size: `assertSizeChartRows` is called by the size-chart page itself, so if a
 * row is ever added, renamed or reordered there and not here, the build fails
 * instead of quietly offering a size the chart does not describe.
 *
 * Each product publishes its own ceiling in `blueprint.sizes` ("Adult S to
 * 5XL", "Youth XS to Youth XL"). `sizeRunFor` reads that published sentence and
 * returns the slice of the chart it names, so the cart grid on a youth jersey
 * stops at Youth XL exactly as the page says it does.
 */

export const SIZE_RUN = [
  "Youth XS",
  "Youth S",
  "Youth M",
  "Youth L",
  "Youth XL",
  "Adult S",
  "Adult M",
  "Adult L",
  "Adult XL",
  "Adult 2XL",
  "Adult 3XL",
  "Adult 4XL",
  "Adult 5XL",
] as const;

export type SizeLabel = (typeof SIZE_RUN)[number];

type Group = "Youth" | "Adult";

/**
 * Build-time guard for /size-chart/: the visible tables and this list have to
 * be the same sizes in the same order.
 */
export function assertSizeChartRows(caption: string, labels: string[]) {
  const expected = SIZE_RUN.join(" | ");
  const actual = labels.join(" | ");
  if (expected !== actual) {
    throw new Error(
      `The "${caption}" table on /size-chart/ no longer matches SIZE_RUN in src/lib/sizes.ts.\n` +
        `  chart: ${actual}\n  sizes: ${expected}\n` +
        "The cart offers exactly the sizes in SIZE_RUN, so the two must stay identical.",
    );
  }
}

function splitToken(token: string): { group: Group | null; size: string | null } {
  const cleaned = token.trim().replace(/\s+/g, " ");
  const groupMatch = /^(youth|adult)\b/i.exec(cleaned);
  const group = groupMatch
    ? ((groupMatch[1][0].toUpperCase() + groupMatch[1].slice(1).toLowerCase()) as Group)
    : null;
  const rest = (groupMatch ? cleaned.slice(groupMatch[0].length) : cleaned).trim();
  return { group, size: rest ? rest.toUpperCase() : null };
}

function firstOfGroup(group: Group) {
  return SIZE_RUN.find((size) => size.startsWith(`${group} `));
}

function lastOfGroup(group: Group) {
  return [...SIZE_RUN].reverse().find((size) => size.startsWith(`${group} `));
}

/**
 * "Adult S to 5XL" -> the eight adult sizes. A bare size on one side of the
 * range inherits the group named on the other, which is how the blueprints
 * write it.
 */
export function sizeRunFor(published: string): SizeLabel[] {
  const parts = published.split(/\s+to\s+/i);
  if (parts.length !== 2) {
    throw new Error(`Cannot read the published size range "${published}" — expected "X to Y".`);
  }

  const start = splitToken(parts[0]);
  const end = splitToken(parts[1]);
  const startGroup = start.group ?? end.group;
  const endGroup = end.group ?? start.group;
  if (!startGroup || !endGroup) {
    throw new Error(`Size range "${published}" names neither Youth nor Adult.`);
  }

  const startLabel = start.size ? `${startGroup} ${start.size}` : firstOfGroup(startGroup);
  const endLabel = end.size ? `${endGroup} ${end.size}` : lastOfGroup(endGroup);

  const from = SIZE_RUN.indexOf(startLabel as SizeLabel);
  const to = SIZE_RUN.indexOf(endLabel as SizeLabel);
  if (from < 0) {
    throw new Error(`"${startLabel}" (from "${published}") is not a size on /size-chart/.`);
  }
  if (to < 0) {
    throw new Error(`"${endLabel}" (from "${published}") is not a size on /size-chart/.`);
  }
  if (to < from) {
    throw new Error(`Size range "${published}" runs backwards.`);
  }

  return SIZE_RUN.slice(from, to + 1);
}
