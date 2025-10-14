import React from "react";
import { useApp } from "../../store/app-wrapper.context";

interface SelectProps {
  label: string;
  options: string[];
  filterKey: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  filterKey = "naics",
}) => {
  const { setFilter, filters } = useApp();

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    console.log(`${filterKey} changed to`, value);
    setFilter(filterKey as any, value);
  };

  return (
    <div className="max-w-sm w-full">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        {label}
      </label>

      <select
        id={filterKey}
        value={(filters as any)[filterKey] || ""}
        onChange={handleSelectChange}
        className="block w-full p-2.5 mb-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
      >
        <option value="">All</option>
        {options.map((opt, index) => (
          <option key={index} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};
