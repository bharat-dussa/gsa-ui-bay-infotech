/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type FC,
  type ReactNode,
} from "react";
import { useLocation, useNavigate } from "react-router";

export interface Filters {
  naics: string;
  setAside: string[];
  vehicle: string;
  agency: string[];
  period: string;
  ceiling: string;
  keywords: string[];
}

interface AppContextType {
  filters: Filters;
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  resetFilters: () => void;
  savePresets: () => void;
  loadPresets: () => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isApplyFilterDisabled: boolean;
  setIsApplyFilterDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY = "gsa-ui-filters";
const STORAGE_KEY_SAVED = "gsa-ui-filters_saved";

const defaultFilters: Filters = {
  naics: "",
  setAside: [],
  vehicle: "",
  agency: [],
  period: "",
  ceiling: "",
  keywords: [],
};

type Props = {
  children: ReactNode;
};

const AppWrapper: FC<Props> = ({ children }) => {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [isLoading, setIsLoading] = useState(false);
  const [isApplyFilterDisabled, setIsApplyFilterDisabled] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const obj: Partial<Filters> = {};
    for (const [key, value] of params.entries()) {
      if (value.includes(","))
        obj[key as keyof Filters] = value.split(",") as any;
      else obj[key as keyof Filters] = value as any;
    }

    if (Object.keys(obj).length > 0) {
      setFilters((prev) => ({ ...prev, ...obj }));
    } else {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setFilters(JSON.parse(saved));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  }, [filters]);

  const setFilter = async <K extends keyof Filters>(
    key: K,
    value: Filters[K]
  ) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: value };

      const params = new URLSearchParams();
      Object.entries(next).forEach(([k, v]) => {
        if (!v || (Array.isArray(v) && v.length === 0)) return;
        params.set(k, Array.isArray(v) ? v.join(",") : String(v));
      });

      navigate({ search: params.toString() });

      return next;
    });
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    navigate({ search: "" });
    localStorage.removeItem(STORAGE_KEY);
  };

  const savePresets = () => {
    localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(filters));
  };

  const loadPresets = () => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY_SAVED) || "");
    const params = new URLSearchParams();
    Object.entries(data).forEach(([k, v]) => {
      if (!v || (Array.isArray(v) && v.length === 0)) return;
      params.set(k, Array.isArray(v) ? v.join(",") : String(v));
    });
    navigate({ search: params.toString() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.location.reload();
  };

  console.log('isLoading', isLoading);

  const value = useMemo(
    () => ({
      filters,
      setFilter,
      resetFilters,
      savePresets,
      loadPresets,
      isLoading,
      setIsLoading,
      setIsApplyFilterDisabled,
      isApplyFilterDisabled,
    }),
    [
      filters,
      isApplyFilterDisabled,
      isLoading,
      // loadPresets,
      // resetFilters,
      // savePresets,
      // setFilter,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within <AppWrapper>");
  return ctx;
};

export default AppWrapper;
