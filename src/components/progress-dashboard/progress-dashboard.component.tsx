"use client";

import React, { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Sector } from "recharts";
import type { PieSectorDataItem } from "recharts/types/polar/Pie";

interface ProgressDashboardProps {
  results: any[];
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  results,
  submissionProgress,
}) => {
  const statusCounts = useMemo(() => {
    const counts = { Draft: 0, Ready: 0, Submitted: 0, Awarded: 0, Lost: 0 };
    results.forEach((r) => {
      if (r.status && counts[r.status] !== undefined) counts[r.status]++;
    });
    return counts;
  }, [results]);

  const total = Object.values(statusCounts).reduce((a, b) => a + b, 0) || 1;

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
    <div className="w-full rounded-2xl bg-white border border-gray-200  sm:rounded-xl shadow-sm p-4 sm:p-6 mb-6 overflow-hidden">
      {/* ✅ Responsive Flex Layout */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 w-full">
        {/* ✅ Status Counters */}
        <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm w-full lg:w-auto">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div
              key={status}
              className="text-center min-w-[70px] flex-1 sm:flex-none"
            >
              <div className="text-gray-500 text-xs sm:text-sm">{status}</div>
              <div className="text-lg sm:text-xl font-semibold text-gray-900">
                {count}
              </div>
            </div>
          ))}
        </div>

        {/* ✅ Donut Chart */}
        <div className="flex justify-center items-center w-full lg:w-[280px] h-40 sm:h-52 md:h-60">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} label>
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ✅ Average Progress */}
      <div className="mt-8 w-full">
        <div className="flex justify-between items-center text-xs sm:text-sm text-gray-600 mb-1 flex-wrap">
          <span>Average % Complete</span>
          <span className="font-medium text-gray-900">{avgProgress}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full w-full">
          <div
            className="h-2 bg-black rounded-full transition-all"
            style={{ width: `${avgProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
