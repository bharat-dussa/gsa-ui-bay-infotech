import { useState, useEffect } from "react";
import { useApp } from "../../store/app-wrapper.context";
import { addDays, format, isAfter, parseISO } from "date-fns";
import { useSearchParams } from "react-router";
import clsx from "clsx";

export const PeriodFilter = () => {
  const { setFilter } = useApp();
  const [searchParams] = useSearchParams();

  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [quick, setQuick] = useState<number | null>(null);

  useEffect(() => {
    const periodParam = searchParams.get("period");
    if (!periodParam) return;

    if (periodParam.endsWith("d")) {
      const days = parseInt(periodParam.replace("d", ""), 10);
      setQuick(days);
      const today = new Date();
      const future = addDays(today, days);
      setFrom(format(today, "yyyy-MM-dd"));
      setTo(format(future, "yyyy-MM-dd"));
      setFilter("period", `${days}d`);
    } else if (periodParam.includes("_")) {
      const [start, end] = periodParam.split("_");
      if (start && end) {
        setQuick(null);
        setFrom(format(parseISO(start), "yyyy-MM-dd"));
        setTo(format(parseISO(end), "yyyy-MM-dd"));
        setFilter("period", `${start}_${end}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      <div className="flex gap-2 mb-3 flex-wrap">
        {[30, 60, 90].map((days) => (
          <button
            key={days}
            onClick={() => handleQuickSelect(days)}
            className={clsx(
              "px-3 py-1 text-sm rounded-full border border-dotted transition",
              quick === days
                ? "bg-black text-white border-black"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            )}
          >
            Next {days} days
          </button>
        ))}
      </div>

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
