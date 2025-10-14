import { addDays } from "date-fns";


export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface Filters {
  naics?: string;
  setAside?: string[];
  vehicle?: string;
  agency?: string[];
  period?: string;
  ceiling?: string;
  keywords?: string[];
}

interface FilterResult {
  filtered: any[];
  submissionProgress: number;
}
export function applyFilters(data: any[], filters: Filters): FilterResult {
  if (!filters) return { filtered: data, submissionProgress: 0 };

  const keywordList = Array.isArray(filters.keywords)
  ? filters.keywords
  : typeof filters.keywords === 'string'
  ? [filters.keywords]
  : [];

  const filtered = data.filter((item) => {
    if (filters.naics && item.naics !== filters.naics) return false;

    if (filters.vehicle && item.vehicle !== filters.vehicle) return false;

    if (
      filters.setAside &&
      filters.setAside.length > 0 &&
      !filters.setAside.some((s) => item.setAside.includes(s))
    ) {
      return false;
    }

    if (
      filters.agency &&
      filters.agency.length > 0 &&
      !filters.agency.includes(item.agency)
    ) {
      return false;
    }

    if (filters.period) {
      const due = new Date(item.dueDate);

      if (filters.period.endsWith("d")) {
        const days = parseInt(filters.period.replace("d", ""), 10);
        const now = new Date();
        const future = addDays(now, days);
        if (due < now || due > future) return false;
      }

      if (filters.period.includes("_")) {
        const [start, end] = filters.period.split("_");
        const from = new Date(start);
        const to = new Date(end);
        if (due < from || due > to) return false;
      }
    }

    if (filters.ceiling && filters.ceiling.includes("_")) {
      const [minStr, maxStr] = filters.ceiling.split("_");
      const min = Number(minStr || 0);
      const max = Number(maxStr || Number.MAX_SAFE_INTEGER);
      if (item.ceiling < min || item.ceiling > max) return false;
    }

    if (keywordList.length > 0) {
      const kw = keywordList.map((k) => String(k).toLowerCase());
      const match =
        kw.some((k) => item.title.toLowerCase().includes(k)) ||
        kw.some((k) =>
          item.keywords.some((word: string) => word.toLowerCase().includes(k))
        );

      if (!match) return false;
    }

    return true;
  });

  const total = filtered.length;
  const submitted = filtered.filter(
    (i) => i.status === "Submitted" || i.status === "Awarded"
  ).length;

  const submissionProgress =
    total > 0 ? Math.round((submitted / total) * 100) : 0;

  return { filtered, submissionProgress };
}
