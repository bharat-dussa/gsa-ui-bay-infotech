import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { useApp } from "../../store/app-wrapper.context";
import { delay } from "../../utils/common";

type KeywordChipsProps = {
  value?: string[];
  onChange?: (next: string[]) => void;
  placeholder?: string;
  maxChips?: number;
};

export default function KeywordChips({
  value = [],
  onChange,
  placeholder = "Type and press Enter",
  maxChips = 20,
}: KeywordChipsProps) {
  const { setFilter, setIsLoading } = useApp();
  const [chips, setChips] = useState<string[]>(value);
  const [input, setInput] = useState("");
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [searchParams] = useSearchParams();

  const update = (next: string[]) => {
    setIsLoading(true);
    delay(350)
      .then(() => {
        setChips(next);
        onChange?.(next);
        setFilter("keywords", next);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    const kwParam = searchParams.get("keywords");
    if (kwParam) {
      const kwList = kwParam
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);
      if (kwList.length > 0) {
        update(kwList);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addChip = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed || chips.includes(trimmed) || chips.length >= maxChips) return;
    update([...chips, trimmed]);
    setInput("");
    inputRef.current?.focus();
  };

  const removeChip = (idx: number) => {
    const next = chips.filter((_, i) => i !== idx);
    update(next);
    setFocusedIndex(null);
    inputRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addChip(input);
      return;
    }
    if (e.key === "Backspace" && input === "" && chips.length > 0) {
      if (focusedIndex === chips.length - 1) removeChip(chips.length - 1);
      else setFocusedIndex(chips.length - 1);
    }
    if (e.key === "Escape") {
      setFocusedIndex(null);
      inputRef.current?.focus();
    }
  };

  const onChipKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    idx: number
  ) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      removeChip(idx);
      return;
    }
    if (e.key === "ArrowLeft") setFocusedIndex(idx > 0 ? idx - 1 : idx);
    if (e.key === "ArrowRight") {
      if (idx === chips.length - 1) {
        setFocusedIndex(null);
        inputRef.current?.focus();
      } else {
        setFocusedIndex(idx + 1);
      }
    }
  };

  // useEffect(() => {
  //   setFilter("keywords", chips);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [chips]);

  return (
    <div className="w-full" role="group" aria-labelledby="keywords-label">
      <label
        id="keywords-label"
        htmlFor="keyword-input"
        className="block text-sm font-medium text-gray-700"
      >
        Keywords
      </label>

      <div
        className="flex flex-wrap items-center gap-1.5 min-h-[40px] border border-gray-200 bg-white rounded-lg px-2.5 py-1.5 shadow-sm focus-within:ring-2 focus-within:ring-blue-400 transition"
        role="listbox"
        aria-multiselectable="true"
        aria-describedby="keywords-hint"
        tabIndex={0}
        onClick={() => inputRef.current?.focus()}
      >
        {chips.map((c, idx) => (
          <button
            key={c}
            role="option"
            aria-selected={focusedIndex === idx}
            aria-label={`Keyword: ${c}. Press backspace or delete to remove.`}
            onClick={() => setFocusedIndex(idx)}
            onKeyDown={(e) => onChipKeyDown(e, idx)}
            tabIndex={0}
            className={
              `inline-flex items-center gap-1.5 px-2 py-[3px] rounded-full text-xs font-medium border transition focus:outline-none ` +
              (focusedIndex === idx
                ? "bg-blue-50 border-blue-800 text-blue-700 ring-1 ring-blue-300"
                : "bg-blue-50 border-blue-800 hover:border-blue-300 hover:bg-blue-50")
            }
          >
            <span
              className="truncate max-w-[8rem]"
              title={c}
              aria-hidden="true"
            >
              {c}
            </span>
            <button
              type="button"
              onClick={(ev) => {
                ev.stopPropagation();
                removeChip(idx);
              }}
              className="text-gray-400 hover:text-red-500 transition text-[13px] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-400 rounded-full"
              aria-label={`Remove keyword ${c}`}
            >
              ✕
            </button>
          </button>
        ))}

        <input
          id="keyword-input"
          ref={inputRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setFocusedIndex(null);
          }}
          onKeyDown={onKeyDown}
          placeholder={chips.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] py-1.5 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
          aria-label="Add keyword input"
        />
      </div>

      <div
        id="keywords-hint"
        className="mt-1 text-[11px] text-gray-400"
        aria-live="polite"
      >
        Press{" "}
        <kbd
          className="px-1 py-0.5 bg-gray-100 rounded font-mono"
          aria-label="Enter key"
        >
          Enter
        </kbd>{" "}
        to add keywords
      </div>
    </div>
  );
}
