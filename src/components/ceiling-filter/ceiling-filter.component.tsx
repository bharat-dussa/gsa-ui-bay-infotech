import { useState } from "react";
import { useApp } from "../../store/app-wrapper.context";

export const CeilingFilter = () => {
  const { filters, setFilter } = useApp();
  const [min, setMin] = useState<string>("");
  const [max, setMax] = useState<string>("");

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

      {min && max && Number(min) > Number(max) && (
        <p className="mt-1 text-xs text-red-500">Min cannot exceed Max.</p>
      )}
    </div>
  );
};
