import { divisions, navigation, projects } from "@/data/siteData";

export type SearchGroup = "Pages" | "Projects" | "Services";

export interface SearchEntry {
  id: string;
  title: string;
  meta: string;
  href: string;
  group: SearchGroup;
}

const pageEntries: SearchEntry[] = navigation.map((item) => ({
  id: `page-${item.index}`,
  title: item.label,
  meta: item.meta,
  href: item.href,
  group: "Pages",
}));

const divisionEntries: SearchEntry[] = divisions.map((division) => ({
  id: `division-${division.id}`,
  title: division.shortName,
  meta: `${division.kicker} · ${division.ref}`,
  href: `/capabilities?division=${division.id}`,
  group: "Services",
}));

const projectEntries: SearchEntry[] = projects.map((project) => ({
  id: `project-${project.slug}`,
  title: project.name,
  meta: `${project.location} · ${project.year} · ${project.status}`,
  href: `/projects/${project.slug}`,
  group: "Projects",
}));

const extraEntries: SearchEntry[] = [
  {
    id: "page-home",
    title: "Overview",
    meta: "Altrabuild.co.tz home",
    href: "/",
    group: "Pages",
  },
  {
    id: "page-legal",
    title: "Legal & privacy",
    meta: "Terms, privacy, modern slavery statement",
    href: "/legal/privacy",
    group: "Pages",
  },
];

export const searchEntries: SearchEntry[] = [
  ...extraEntries,
  ...pageEntries,
  ...divisionEntries,
  ...projectEntries,
];

export const searchGroups: SearchGroup[] = ["Pages", "Services", "Projects"];

function rank(entry: SearchEntry, query: string): number {
  const title = entry.title.toLowerCase();
  if (title.startsWith(query)) return 0;
  if (title.includes(query)) return 1;
  if (entry.meta.toLowerCase().includes(query)) return 2;
  return 3;
}

export function matchEntries(query: string, group: SearchGroup | "All"): SearchEntry[] {
  const q = query.trim().toLowerCase();
  return searchEntries
    .filter((entry) => {
      if (group !== "All" && entry.group !== group) return false;
      if (!q) return true;
      const haystack = `${entry.title} ${entry.meta}`.toLowerCase();
      return q.split(/\s+/).every((token) => haystack.includes(token));
    })
    .sort((a, b) => (q ? rank(a, q) - rank(b, q) : 0));
}
