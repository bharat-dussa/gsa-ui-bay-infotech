"use client";

import { Fragment, useMemo, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { Check, ChevronDown, Search } from "lucide-react";
import { useApp, type Filters } from "../../store/app-wrapper.context";

interface SelectBoxProps {
  label: string;
  options: string[];
  filterKey: keyof Filters;
  multi?: boolean;
  isSearch?: boolean;
}

export const SelectBox: React.FC<SelectBoxProps> = ({
  label,
  options,
  filterKey,
  multi = false,
  isSearch
}) => {
  const [query, setQuery] = useState("");
  const { filters, setFilter } = useApp();

  const raw = (filters as any)[filterKey];
  const selected = multi
    ? Array.isArray(raw)
      ? raw
      : raw
      ? [raw]
      : []
    : typeof raw === "string"
    ? raw
    : "";

  const handleChange = (val: any) => {
    if (!multi) setFilter(filterKey as any, val);
    else setFilter(filterKey as any, val);
  };

  const filteredOptions = useMemo(() => {
    if(!isSearch) {
        return options;
    }
    if (!query.trim()) return options;
    return options.filter((opt) =>
      opt.toLowerCase().includes(query.toLowerCase())
    );
  }, [isSearch, options, query]);

  return (
    <div className="w-full">
      <Listbox value={selected} onChange={handleChange} multiple={multi}>
        {({ open }) => (
          <>
            <Listbox.Label className="block mb-2 text-sm font-medium text-gray-700">
              {label}
            </Listbox.Label>

            <div className="relative">
              <Listbox.Button className="relative w-full cursor-pointer rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                <span className="block truncate text-gray-800">
                  {multi
                    ? Array.isArray(selected) && selected.length > 0
                      ? selected.join(", ")
                      : "Select options"
                    : selected || "Select option"}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </span>
              </Listbox.Button>

              <Transition
                as={Fragment}
                show={open}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
                 {
                    isSearch ?  <div className="sticky top-0 bg-white px-2 py-2 border-b border-gray-100 flex items-center gap-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search..."
                      className="w-full text-sm outline-none bg-transparent placeholder-gray-400"
                    />
                  </div> : null
                 }

                  {filteredOptions.map((option) => (
                    <Listbox.Option
                      key={option}
                      value={option}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-10 pr-4  z-10 ${
                          active ? "bg-blue-50 text-blue-700" : "text-gray-700"
                        }`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {option}
                          </span>
                          {selected && (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                              <Check className="h-4 w-4" />
                            </span>
                          )}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    </div>
  );
};
