import { ChevronDown, Codesandbox, ListFilter } from "lucide-react";
import { useMemo, useState } from "react";
import { useApp } from "../../store/app-wrapper.context";
import applications from "../../utils/applications.json";
import { applyFilters, delay, type GSAItem } from "../../utils/common";
import { Button } from "../button/button.component";
import { CeilingFilter } from "../ceiling-filter/ceiling-filter.component";
import GSADialog from "../filter-dialog/filter-dialog.component";
import KeywordChips from "../keyword-chips/keyword-chips.component";
import { SelectBox } from "../multi-select/multi-select.component";
import { PeriodFilter } from "../period-filter/period-filter.component";
import { ProgressDashboard } from "../progress-dashboard/progress-dashboard.component";
import { ResultsTable } from "../result-table/result-table.component";
import toast from "react-hot-toast";
import { useDelay } from "../../hooks/useDelay.hook";

const FilterPanel = () => {
  const [isSavePresetsLoading, setIsSavePresetsLoading] = useState(false);
  const [isFilterApplying, setIsFilterApplying] = useState(false);
  const [, setIsPresetsLoading] = useState(false);
  const { savePresets, loadPresets, filters, isApplyFilterDisabled } = useApp();
  const [open, setOpen] = useState(false);

  const onLoadPresets = () => {
    setIsPresetsLoading(true);
    delay(450)
      .then(() => {
        loadPresets();
        toast.success("Previous presets are loaded!");
      })
      .catch(() => {
        toast.error("Error while getting presets");
      })
      .finally(() => setIsPresetsLoading(false));
  };

  const onSavePresets = () => {
    setIsSavePresetsLoading(true);
    delay(450)
      .then(() => {
        savePresets();
        toast.success("Presets are saved!");
      })
      .catch(() => {
        toast.error("Error while saving presets");
      })
      .finally(() => setIsSavePresetsLoading(false));
  };
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
    setIsFilterApplying(true);
    toast.success("Filters added successfully!");
    setIsFilterApplying(false);
  });

  const { filtered } = applyFilters(applications as GSAItem[], filters);

  return (
    <div className="w-full" role="main" aria-label="GSA Dashboard">
      <header
        className="pb-6 justify-center flex gap-1 md:justify-start"
        role="banner"
        aria-label="Dashboard Header"
      >
        <Codesandbox strokeWidth={3} aria-hidden="true" focusable="false" />
        <p className="font-bold" id="dashboard-title">
          GSA
        </p>
      </header>

      <section aria-labelledby="progress-dashboard" role="region">
        <ProgressDashboard results={filtered} />
      </section>

      <section
        className="flex flex-col bg-white border border-gray-200 rounded-2xl shadow-sm w-full sticky top-1"
        role="form"
        aria-labelledby="filters-section"
      >
        <h2 id="filters-section" className="font-bold px-6 pt-6">
          Filters Section
        </h2>

        <div className="px-4 sm:px-6 md:px-8 lg:px-10 py-5 space-y-5">
          <div role="group" aria-labelledby="keyword-chips-label">
            <KeywordChips />
          </div>

          <SelectBox
            label="NAICS"
            options={naicsOptions}
            filterKey="naics"
            aria-label="Select NAICS code"
          />
        </div>

        <hr
          className="h-px my-0 bg-gray-200 border-0"
          role="separator"
          aria-hidden="true"
        />

        <div
          className="flex flex-col px-2 justify-end mt-2 gap-2 pr-6 md:flex-row"
          role="group"
          aria-label="Preset Actions"
        >
          <Button
            disabled={isSavePresetsLoading}
            isLoading={isSavePresetsLoading}
            title="Save Preset"
            onClick={onSavePresets}
            loadingText="Saving..."
            icon
            aria-label="Save current filter preset"
          />
          <button
            onClick={onLoadPresets}
            type="button"
            className="text-sm font-medium text-gray-700 underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Load saved preset"
          >
            Load Preset
          </button>
        </div>

        <div
          className="flex items-center justify-center gap-2 py-4 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 mt-4 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          role="button"
          tabIndex={0}
          onClick={() => setOpen(true)}
          onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls="gsa-filters-dialog"
        >
          <ListFilter
            className="h-4 text-gray-600"
            aria-hidden="true"
            focusable="false"
          />
          <p>More Filters</p>
          <ChevronDown size={16} aria-hidden="true" />
        </div>
      </section>

      <GSADialog
        id="gsa-filters-dialog"
        isOpen={open}
        setOpen={setOpen}
        aria-modal="true"
        aria-labelledby="filter-dialog-title"
      >
        <div className="w-full flex justify-center py-2 border-b border-gray-100 sm:hidden">
          <div
            className="h-1 w-10 rounded-full bg-gray-300"
            aria-hidden="true"
          />
        </div>

        <div className="px-4 pt-4 pb-6 sm:p-6 space-y-4">
          <h2
            id="filter-dialog-title"
            className="text-lg font-semibold text-gray-800 mb-2 text-center sm:text-left"
          >
            Filter Options
          </h2>

          <div
            className="flex flex-col gap-4"
            role="group"
            aria-label="Filter Options"
          >
            <SelectBox
              label="Set Aside"
              options={setAsideOptions}
              filterKey="setAside"
              multi
              aria-label="Select Set Aside options"
            />
            <SelectBox
              label="Agency"
              options={agency}
              filterKey="agency"
              multi
              isSearch
              aria-label="Select Agency options"
            />
            <SelectBox
              label="Vehicle"
              options={vehicles}
              filterKey="vehicle"
              aria-label="Select Vehicle type"
            />
            <PeriodFilter aria-label="Select Period" />
            <CeilingFilter aria-label="Select Ceiling" />
          </div>
        </div>

        <div
          className="border-t border-gray-200 flex flex-col sm:flex-row sm:justify-end p-4 gap-3"
          role="group"
          aria-label="Dialog Actions"
        >
          <Button
            disabled={isApplyFilterDisabled || isFilterApplying}
            isLoading={isFilterApplying}
            title="Apply Filters"
            onClick={() => {
              setOpen(false);
              onClickApplyFilters();
            }}
            loadingText="Applying..."
            aria-label="Apply selected filters"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="border border-gray-300 w-full sm:w-auto rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Cancel filter changes"
          >
            Cancel
          </button>
        </div>
      </GSADialog>

      <section
        className="pt-7"
        aria-labelledby="results-table-label"
        role="region"
      >
        <h2 id="results-table-label" className="sr-only">
          Results Table
        </h2>
        <ResultsTable
          data={applications}
          aria-describedby="results-table-label"
        />
      </section>
    </div>
  );
};

export default FilterPanel;
