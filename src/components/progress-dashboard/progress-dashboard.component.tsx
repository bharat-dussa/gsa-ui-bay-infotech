/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import type { GSAItem } from "../../utils/common";

interface ProgressDashboardProps {
  results: GSAItem[];
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  results,
}) => {
  const statusCounts = useMemo(() => {
    const counts = { Draft: 0, Ready: 0, Submitted: 0, Awarded: 0, Lost: 0 };
    results.forEach((r) => {
      if (r.status && counts[r.status] !== undefined) counts[r.status]++;
    });
    return counts;
  }, [results]);

  const avgProgress = useMemo(() => {
    if (results.length === 0) return 0;
    return Math.round(
      results.reduce((sum, r) => sum + (r.percentComplete || 0), 0) /
        results.length
    );
  }, [results]);

  const COLORS = ["#1f2937", "#4b5563", "#9ca3af", "#d1d5db", "#e5e7eb"];

  const data = Object.entries(statusCounts).map(([status, value]) => ({
    name: status,
    value,
  }));

  return (
    <div
      className="w-full rounded-2xl bg-white border border-gray-200 sm:rounded-xl shadow-sm p-4 sm:p-6 mb-6 overflow-hidden"
      role="region"
      aria-labelledby="dashboard-summary"
    >
      <h2 id="dashboard-summary" className="font-bold">
        Dashboard Summary
      </h2>

      <div
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 w-full"
        role="group"
        aria-label="Status Overview and Donut Chart"
      >
        <div
          className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm w-full lg:w-auto"
          role="list"
          aria-label="Status Count Summary"
        >
          {Object.entries(statusCounts).map(([status, count]) => (
            <div
              key={status}
              className="text-center min-w-[70px] flex-1 sm:flex-none"
              role="listitem"
              tabIndex={0}
              aria-label={`${status}: ${count}`}
            >
              <div
                className="text-gray-500 text-xs sm:text-sm"
                aria-hidden="true"
              >
                {status}
              </div>
              <div
                className="text-lg sm:text-xl font-semibold text-gray-900"
                aria-label={`Count for ${status}: ${count}`}
              >
                {count}
              </div>
            </div>
          ))}
        </div>

        <div
          className="flex justify-center items-center w-full lg:w-[280px] h-40 sm:h-52 md:h-60"
          role="img"
          aria-label="Status distribution donut chart"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                label
                aria-label="Distribution of statuses represented as a donut chart"
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    role="presentation"
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div
        className="mt-8 w-full"
        role="region"
        aria-labelledby="average-progress"
      >
        <h3 id="average-progress" className="sr-only">
          Average Progress
        </h3>

        <div
          className="flex justify-between items-center text-xs sm:text-sm text-gray-600 mb-1 flex-wrap"
          role="text"
          aria-label={`Average progress is ${avgProgress} percent`}
        >
          <span>Average % Complete</span>
          <span className="font-medium text-gray-900">{avgProgress}%</span>
        </div>

        <div
          className="h-2 bg-gray-200 rounded-full w-full"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={avgProgress}
          aria-label={`Progress bar showing ${avgProgress} percent completion`}
        >
          <div
            className="h-2 bg-black rounded-full transition-all"
            style={{ width: `${avgProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
