import { useState } from "react";
import { useApp } from "../../store/app-wrapper.context";
import { addDays, format, isAfter } from "date-fns";
import clsx from "clsx";

export const PeriodFilter = () => {
  const { filters, setFilter } = useApp();

  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [quick, setQuick] = useState<number | null>(null);

  const handleQuickSelect = (days: number) => {
    setQuick(days);
    const today = new Date();
    const future = addDays(today, days);
    setFrom(format(today, "yyyy-MM-dd"));
    setTo(format(future, "yyyy-MM-dd"));
    setFilter("period", `${days}d`);
  };

  const handleCustomRange = (start: string, end: string) => {
    setQuick(null);
    setFrom(start);
    setTo(end);
    if (start && end && isAfter(new Date(end), new Date(start))) {
      setFilter("period", `${start}_${end}`);
    } else {
      setFilter("period", "");
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Period
      </label>

      {/* Quick Select Chips */}
      <div className="flex gap-2 mb-3">
        {[30, 60, 90].map((days) => (
          <button
            key={days}
            onClick={() => handleQuickSelect(days)}
            className={clsx(
              "px-3 py-1 text-sm rounded-full border transition",
              quick === days
                ? "bg-black text-white border-blue-600"
                : "bg-white text-gray-700 border-dashed border-blue-00 hover:bg-blue-50"
            )}
          >
            Next {days} days
          </button>
        ))}
      </div>

      {/* Custom Date Range */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-gray-500 mb-1">From</label>
          <input
            type="date"
            value={from}
            onChange={(e) => handleCustomRange(e.target.value, to)}
            className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">To</label>
          <input
            type="date"
            value={to}
            onChange={(e) => handleCustomRange(from, e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
