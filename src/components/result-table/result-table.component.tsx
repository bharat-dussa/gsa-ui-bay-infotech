/* eslint-disable @typescript-eslint/no-explicit-any */
import { format, formatDistanceToNowStrict, parseISO } from "date-fns";
import {
  Award,
  CircleCheckBig,
  CircleDotDashed,
  FileX,
  MailCheck
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { useApp, type Filters } from "../../store/app-wrapper.context";
import { applyFilters } from "../../utils/common";
import GSADialog from "../filter-dialog/filter-dialog.component";
import { Skeleton } from "../skeleton/rectangle.component";

type SortKey = "dueDate" | "percentComplete" | "fitScore" | null;
type SortDir = "asc" | "desc";

const MoveUp = "↑";
const MoveDown = "↓";

export const ResultsTable = ({ data }: { data: any[] }) => {
  const { filters, resetFilters, setFilter, isLoading } = useApp();
  const [sortKey, setSortKey] = useState<SortKey>("dueDate");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const { filtered } = applyFilters(data, filters);

  console.log("isLoading", isLoading);
  const results = useMemo(() => {
    const list = [...filtered];
    if (!sortKey) return list;

    list.sort((a, b) => {
      let av: any = a[sortKey];
      let bv: any = b[sortKey];

      if (sortKey === "dueDate") {
        av = new Date(a.dueDate).getTime();
        bv = new Date(b.dueDate).getTime();
      }

      return sortDir === "asc" ? av - bv : bv - av;
    });
    return list;
  }, [filtered, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const isFiltered = Object.values(filters || {}).some((v) =>
    Array.isArray(v) ? v.length > 0 : Boolean(v)
  );

  const markAsSubmitted = () => {
    if (!selectedItem) return;
    selectedItem.status = "Submitted";
    setFilter("dummy" as unknown as keyof Filters, Math.random().toString());
    setIsDetailsModalOpen(false);
  };

  const openDetails = (item: any) => {
    setSelectedItem(item);
    setIsDetailsModalOpen(true);
  };

  const timelines = useMemo(() => {
    if (selectedItem?.status) {
      return [
        {
          name: "Draft",
          icon: <CircleDotDashed strokeWidth={3} size={16} />,
          className: "animated-pulse",
        },
        {
          name: "Ready",
          icon: (
            <MailCheck
              strokeWidth={3}
              size={16}
              color={selectedItem.status === "Ready" ? "orange" : "grey"}
            />
          ),
        },
        {
          name: "Awarded",
          icon: (
            <Award
              strokeWidth={3}
              size={16}
              color={selectedItem.status === "Awarded" ? "green" : "grey"}
            />
          ),
        },
        {
          name: "Lost",
          icon: (
            <FileX
              strokeWidth={3}
              size={16}
              color={selectedItem.status === "Lost" ? "red" : "grey"}
            />
          ),
        },
        {
          name: "Submitted",
          icon: (
            <CircleCheckBig
              color={selectedItem.status === "Submitted" ? "green" : "grey"}
              strokeWidth={3}
              size={16}
            />
          ),
        },
      ];
    }

    return [];
  }, [selectedItem?.status]);

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <div className="text-sm text-gray-700">
          Showing{" "}
          <span className="font-semibold text-gray-900">{results.length}</span>{" "}
          {isFiltered ? "filtered results" : "total results"}
        </div>

        <div className="flex items-center gap-2">
          {isFiltered && (
            <button
              onClick={resetFilters}
              className="ml-2 px-3 py-1 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="py-3 px-3">Title</th>
              <th className="py-3 px-3">Agency</th>
              <th className="py-3 px-3">NAICS</th>
              <th className="py-3 px-3">Set-Aside</th>
              <th
                className="py-3 px-3 cursor-pointer"
                onClick={() => toggleSort("dueDate")}
              >
                Due Date{" "}
                {sortKey === "dueDate"
                  ? sortDir === "asc"
                    ? MoveUp
                    : MoveDown
                  : MoveUp}
              </th>
              <th className="py-3 px-3">Status</th>
              <th
                className="py-3 px-3 cursor-pointer"
                onClick={() => toggleSort("percentComplete")}
              >
                % Complete{" "}
                {sortKey === "percentComplete"
                  ? sortDir === "asc"
                    ? MoveUp
                    : MoveDown
                  : MoveUp}
              </th>
              <th
                className="py-3 px-3 cursor-pointer"
                onClick={() => toggleSort("fitScore")}
              >
                Fit Score{" "}
                {sortKey === "fitScore"
                  ? sortDir === "asc"
                    ? MoveUp
                    : MoveDown
                  : MoveUp}
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <>
                <tr className="my-2">
                  <td colSpan={8} className="my-12">
                    <Skeleton />
                  </td>
                </tr>
                <tr className="py-2">
                  <td colSpan={8}>
                    <Skeleton />
                  </td>
                </tr>
                <tr>
                  <td colSpan={8}>
                    <Skeleton />
                  </td>
                </tr>
              </>
            )}
            {results.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="p-8 sm:p-12 text-center bg-gray-50 border border-gray-200 rounded-lg"
                >
                  <div className="max-w-md mx-auto px-2">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                      No matches found
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-4">
                      Try adjusting your filters or resetting them to see all
                      opportunities.
                    </p>
                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 text-sm font-medium transition"
                    >
                      Clear Filters
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {results.length > 0 &&
              results.map((r, i) => (
                <tr
                  key={i}
                  className="border-t  transition-colors cursor-pointer hover:bg-gray-100"
                  onClick={() => openDetails(r)}
                >
                  <td className="py-2 px-3 font-medium">
                    {highlightText(r.title, filters.keywords)}
                  </td>
                  <td className="py-2 px-3">{r.agency}</td>
                  <td className="py-2 px-3">{r.naics}</td>
                  <td className="py-2 px-3">
                    <div className="flex flex-wrap gap-1">
                      {r.setAside.map((s: string) => (
                        <span
                          key={s}
                          className="text-xs bg-gray-100 px-2 py-0.5 rounded-full"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-2 px-3 text-sm text-gray-600">
                    <div>
                      {formatDistanceToNowStrict(new Date(r.dueDate))} left
                    </div>
                    <div className="text-xs text-gray-400">
                      {format(parseISO(r.dueDate), "MMM d, yyyy")}
                    </div>
                  </td>
                  <td className="py-2 px-3 text-xs">{r.status}</td>
                  <td className="py-2 px-3">
                    <div className="w-24 bg-gray-200 h-2 rounded-full">
                      <div
                        className="bg-black h-2 rounded-full"
                        style={{ width: `${r.percentComplete}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-2 px-3 font-semibold">{r.fitScore}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <GSADialog
        isOpen={isDetailsModalOpen}
        setOpen={() => setIsDetailsModalOpen((is) => !is)}
      >
        <div className="p-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {selectedItem?.title}
            </h2>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setIsDetailsModalOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="space-y-2 text-sm text-gray-700">
            <p>
              <strong>Agency:</strong> {selectedItem?.agency}
            </p>
            <p>
              <strong>NAICS:</strong> {selectedItem?.naics}
            </p>
            <p>
              <strong>Vehicle:</strong> {selectedItem?.vehicle}
            </p>
            <p>
              <strong>Due:</strong>{" "}
              {/* {format(parseISO(selectedItem?.dueDate || ""), "MMM d, yyyy")} */}
            </p>
            <p>
              <strong>Status:</strong> {selectedItem?.status}
            </p>
            <p>
              <strong>Fit Score:</strong> {selectedItem?.fitScore}
            </p>
          </div>

          {/* Timeline */}
          <div className="mt-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">
              Progress Timeline
            </h3>
            <div className="flex items-center justify-between text-xs text-gray-600">
              {timelines.map((timeline) => (
                <div key={timeline.name} className="flex flex-col items-center">
                  <span>{timeline.icon}</span>
                  <span>{timeline.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end">
            {selectedItem?.status !== "Submitted" && (
              <button
                onClick={markAsSubmitted}
                className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800"
              >
                Mark as Submitted
              </button>
            )}
          </div>
        </div>
      </GSADialog>
    </div>
  );
};

function highlightText(text: string, keywords: string[] = []) {
  if (!keywords || keywords.length === 0) return text;
  const regex = new RegExp(`(${keywords?.join("|")})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        keywords.some((kw) => kw.toLowerCase() === part.toLowerCase()) ? (
          <mark key={i} className="bg-yellow-200 text-black rounded-sm px-0.5">
            {part}
          </mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  );
}
