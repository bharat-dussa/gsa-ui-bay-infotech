import {
  ChevronDown,
  ClipboardClock,
  Codesandbox,
  ListFilter,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useDelay } from "../../hooks/useDelay.hook";
import { useApp } from "../../store/app-wrapper.context";
import applications from "../../utils/applications.json";
import { applyFilters } from "../../utils/apply-filter";
import { CeilingFilter } from "../ceiling-filter/ceiling-filter.component";
import GSADialog from "../filter-dialog/filter-dialog.component";
import KeywordChips from "../keyword-chips/keyword-chips.component";
import { SelectBox } from "../multi-select/multi-select.component";
import { PeriodFilter } from "../period-filter/period-filter.component";
import { ProgressDashboard } from "../progress-dashboard/progress-dashboard.component";
import { ResultsTable } from "../result-table/result-table.component";

const FilterPanel = () => {
  const { savePresets, loadPresets, filters, isLoading } = useApp();
  const [open, setOpen] = useState(false);

  const naicsOptions = useMemo(
    () => Array.from(new Set(applications.map((item) => item.naics))),
    []
  );

  const setAsideOptions = useMemo(
    () => Array.from(new Set(applications.flatMap((item) => item.setAside))),
    []
  );

  const vehicles = useMemo(
    () => Array.from(new Set(applications.map((item) => item.vehicle))),
    []
  );
  const agency = useMemo(
    () => Array.from(new Set(applications.map((item) => item.agency))),
    []
  );

  const onClickApplyFilters = useDelay(() => {
    setOpen(false);
  }, 1000);

  const { filtered } = applyFilters(applications, filters);

  return (
    <div className="w-full">
      <div className="pb-6 justify-center flex gap-1 md:justify-start">
        <Codesandbox strokeWidth={3} />
        <p className="font-bold">GSA</p>
      </div>
      <ProgressDashboard results={filtered} />

      <div className="flex flex-col bg-white border border-gray-200 rounded-2xl shadow-sm w-full sticky top-1">
        {/* Filters Section */}
        <div className="px-4 sm:px-6 md:px-8 lg:px-10 py-5 space-y-5">
          {/* Keyword Chips */}
          <KeywordChips />

          {/* NAICS Dropdown */}
          <SelectBox label="NAICS" options={naicsOptions} filterKey="naics" />

          {/* Set-Aside MultiSelect */}
        </div>

        {/* Divider */}
        <hr className="h-px my-0 bg-gray-200 border-0" />

        <div className="flex flex-col px-2 justify-end mt-2 gap-2 pr-6 md:flex-row">
          <button
            onClick={savePresets}
            className="bg-black text-white w-full sm:w-auto rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-800 transition flex justify-center items-center gap-2"
          >
            <ClipboardClock size={16} /> Apply Preset
          </button>
          <button onClick={loadPresets}>Load Preset</button>
        </div>
        {/* More Filters Section */}
        <div
          className="flex items-center justify-center gap-2 py-4 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50 transition"
          onClick={() => setOpen(true)}
        >
          <ListFilter className="h-4  text-gray-600" />
          <p>More Filters</p>
          <ChevronDown size={16} />
        </div>
      </div>

      {/* Dialog Component */}

      <GSADialog isOpen={open} setOpen={setOpen}>
        <div className="w-full flex justify-center py-2 border-b border-gray-100 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-gray-300" />
        </div>

        <div className="px-4 pt-4 pb-6 sm:p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 text-center sm:text-left">
            Filter Options
          </h2>

          <div className="flex flex-col gap-4">
            <SelectBox
              label="Set Aside"
              options={setAsideOptions}
              filterKey="setAside"
              multi
            />
            <SelectBox
              label="Agency"
              options={agency}
              filterKey="agency"
              multi
              isSearch
            />
            <SelectBox label="Vehicle" options={vehicles} filterKey="vehicle" />
            <PeriodFilter />
            <CeilingFilter />
          </div>
        </div>

        <div className="border-t border-gray-200 flex flex-col sm:flex-row sm:justify-end p-4 gap-3">
          <button
            type="button"
            onClick={onClickApplyFilters}
            className="bg-black text-white w-full sm:w-auto rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-800 transition"
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="border border-gray-300 w-full sm:w-auto rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </GSADialog>

      <div className="pt-7">
        <ResultsTable data={applications} />
      </div>
    </div>
  );
};

export default FilterPanel;
