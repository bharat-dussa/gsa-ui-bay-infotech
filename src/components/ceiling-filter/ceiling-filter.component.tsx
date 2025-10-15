import { useState, useEffect, useMemo } from "react";
import { useApp } from "../../store/app-wrapper.context";
import { useSearchParams } from "react-router";

export const CeilingFilter = () => {
  const { setFilter, setIsApplyFilterDisabled } = useApp();
  const [searchParams] = useSearchParams();

  const [min, setMin] = useState<string>("");
  const [max, setMax] = useState<string>("");
  const isError = useMemo(
    () => min && max && Number(min) > Number(max),
    [min, max]
  );

  useEffect(() => {
    const ceilingParam = searchParams.get("ceiling");
    if (ceilingParam && ceilingParam.includes("_")) {
      const [minVal, maxVal] = ceilingParam.split("_");
      setMin(minVal || "");
      setMax(maxVal && maxVal !== "999999999" ? maxVal : "");
      setFilter("ceiling", `${minVal || 0}_${maxVal || 999999999}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIsApplyFilterDisabled(!!isError);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError]);
  
  const handleCeilingChange = (minVal: string, maxVal: string) => {
    setMin(minVal);
    setMax(maxVal);

    if (!minVal && !maxVal) {
      setFilter("ceiling", "");
      return;
    }

    setFilter("ceiling", `${minVal || 0}_${maxVal || 999999999}`);
  };

  return (
    <div className="w-full">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Ceiling (USD)
      </label>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Min</label>
          <input
            type="number"
            min="0"
            placeholder="0"
            value={min}
            onChange={(e) => handleCeilingChange(e.target.value, max)}
            className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Max</label>
          <input
            type="number"
            min="0"
            placeholder="Any"
            value={max}
            onChange={(e) => handleCeilingChange(min, e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {isError && (
        <p className="mt-1 text-xs text-red-500">Min cannot exceed Max.</p>
      )}
    </div>
  );
};
